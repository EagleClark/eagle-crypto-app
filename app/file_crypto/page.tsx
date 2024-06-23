'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Input, message, Space, Spin, Upload } from 'antd';
import { open, save } from '@tauri-apps/api/dialog';
import { appWindow } from '@tauri-apps/api/window';
import { UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';

const { Dragger } = Upload;

const FileCrypto: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [filePath, setFilePath] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [secretKey, setSecretKey] = useState('');
  const [spinning, setSpinning] = useState(false);

  const callFileDialog = async () => {
    const selected = await open({
      multiple: false,
    });

    if (typeof selected === 'string') {
      setFilePath(selected);
    }

    return false;
  };

  const getSaveDefaultPath = () => {
    const index = filePath.lastIndexOf('/');

    return filePath.slice(0, index);
  };

  const callSaveDialog = async (isEncrypt: boolean) => {
    const savePath = await save({
      title: isEncrypt ? '选择加密文件保存路径' : '选择解密后的文件保存路径',
      defaultPath: getSaveDefaultPath(),
    });

    return savePath;
  };

  const handleKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSecretKey(event.currentTarget.value);
  };

  const checkInput = () => {
    if (!filePath) {
      messageApi.open({
        type: 'error',
        content: '请选择文件',
      });
      return false;
    }

    if (!secretKey) {
      messageApi.open({
        type: 'error',
        content: '密钥不能为空',
      });
      return false;
    }

    return true;
  }

  const handleEncrypt = async () => {
    if (!checkInput()) {
      return;
    }

    const savePath = await callSaveDialog(true);

    if (!savePath) {
      return;
    }

    setSpinning(true);
    invoke('aes256_encrypt', {
      filePath,
      secretKey: secretKey.padEnd(32, '0'),
      savePath,
    })
    .then(() => {
      messageApi.open({
        type: 'success',
        content: '加密文件成功，请保管好您的密码，否则文件将无法解密',
      });
    })
    .finally(() => {
      setSecretKey('');
      setSpinning(false);
    });
  };

  const handleDecrypt = async () => {
    if (!checkInput()) {
      return;
    }

    const savePath = await callSaveDialog(false);

    if (!savePath) {
      return;
    }

    setSpinning(true);
    invoke('aes256_decrypt', {
      filePath,
      secretKey: secretKey.padEnd(32, '0'),
      savePath,
    })
    .then(res => {
      if (res === 'success') {
        messageApi.open({
          type: 'success',
          content: '解密文件成功',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: '文件未加密或者密钥错误',
        });
      }
    })
    .finally(() => {
      setSecretKey('');
      setSpinning(false);
    });
  };

  useEffect(() => {
    let unlistenDropFile: UnlistenFn | (() => void) = () => {};

    async function listenDropFile() {
      unlistenDropFile = await appWindow.onFileDropEvent((event) => {
        if (event.payload.type === 'drop') {
          setFilePath(event.payload.paths[0]);
        }
      });
    }
    
    listenDropFile();

    return unlistenDropFile();
  }, []);

  return (
    <div>
      {contextHolder}
      <Spin tip={'程序执行中......'} spinning={spinning} fullscreen />
      <Space direction='vertical' className='w-full'>
        <div className='h-48' onClick={callFileDialog}>
          <Dragger
            fileList={fileList}
            showUploadList={false}
            openFileDialogOnClick={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              {'点击此区域或者拖拽文件到窗口以进行文件加密/解密'}
            </p>
            <p className="ant-upload-hint">
              {'AES256加密'}
            </p>
          </Dragger>
        </div>
        <Space.Compact className='w-full mt-2'>
          <Input
            disabled
            placeholder="请选择文件"
            size="large"
            value={filePath}
          />
        </Space.Compact>
        <div className='w-full mt-2'>
          <Input.Password
            placeholder="请输入密钥"
            size="large"
            maxLength={32}
            value={secretKey}
            onChange={handleKeyChange}
          />
        </div>
        <div className='w-full mt-2 flex'>
          <Button
            type="primary"
            size="large"
            className='w-1/2'
            onClick={handleEncrypt}
          >
            {'加密'}
          </Button>
          <Button
            size="large"
            className='ml-2 w-1/2'
            onClick={handleDecrypt}
          >
            {'解密'}
          </Button>
        </div>
      </Space>
    </div>
  );
}
  

export default FileCrypto;
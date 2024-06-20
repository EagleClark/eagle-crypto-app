'use client'

import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Input, Space, Upload } from 'antd';
import { open } from '@tauri-apps/api/dialog';
import { appWindow } from '@tauri-apps/api/window';
import { UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';

const { Dragger } = Upload;

const FileCrypto: React.FC = () => {
  const [filePath, setFilePath] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);

  const callFileDialog = async () => {
    const selected = await open({
      multiple: false,
    });

    if (typeof selected === 'string') {
      setFilePath(selected);
    }

    return false;
  };

  // const filePath = await save({
  //   filters: [{
  //     name: 'Image',
  //     extensions: ['png', 'jpeg']
  //   }]
  // });

  const handleEncrypt = async () => {
    setEncryptLoading(true);
    await invoke('aes256_encrypt', { filePath });
    setEncryptLoading(false);
  };

  const handleDecrypt = async () => {
    setDecryptLoading(true);
    await invoke('aes256_decrypt', { filePath });
    setDecryptLoading(false);
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
          <Input.Password placeholder="请输入密钥" size="large" />
        </div>
        <div className='w-full mt-2 flex'>
          <Button
            type="primary"
            size="large"
            className='w-1/2'
            loading={encryptLoading}
            onClick={handleEncrypt}
          >
            {'加密'}
          </Button>
          <Button
            size="large"
            className='ml-2 w-1/2'
            loading={decryptLoading}
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
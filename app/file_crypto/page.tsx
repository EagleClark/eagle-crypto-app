'use client'

import React, { DragEvent, useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Input, Space, Upload } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { open } from '@tauri-apps/api/dialog';
import { appWindow } from '@tauri-apps/api/window';
import { UnlistenFn } from '@tauri-apps/api/event';

const { Dragger } = Upload;

const FileCrypto: React.FC = () => {
  const [filePath, setFilePath] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const callFileDialog = async () => {
    console.log(123);
    const selected = await open({
      multiple: false,
    });

    console.log(selected);
    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
    }

    return false;
  };

  const handleChange = (file: UploadChangeParam<UploadFile>) => {
    // console.log(file.file.originFileObj.)
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  const handleOver = (e: DragEvent<HTMLDivElement>) => {
    console.log('123');
  }

  useEffect(() => {
    let unlistenDropFile: UnlistenFn | (() => void) = () => {};

    async function listenDropFile() {
      unlistenDropFile = await appWindow.onFileDropEvent((event) => {
        console.log(event);
        if (event.payload.type === 'hover') {
          console.log('User hovering', event.payload.paths);
        } else if (event.payload.type === 'drop') {
          console.log('User dropped', event.payload.paths);
          setFilePath(event.payload.paths[0]);
        } else {
          console.log('File drop cancelled');
        }
      });
    }
    
    listenDropFile();

    return unlistenDropFile();
  }, []);

  return (
    <div>
      <Space direction='vertical' className='w-full'>
        <div className='h-48' onClick={callFileDialog} onDrag={handleOver}>
          <Dragger
            fileList={fileList}
            showUploadList={false}
            openFileDialogOnClick={false}
            onChange={handleChange}
            onDrop={handleDrop}
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
          <Input.Password placeholder="请输入密码" size="large" />
        </div>
        <div className='w-full mt-2 flex'>
          <Button type="primary" size="large" className='w-1/2'>
            {'加密'}
          </Button>
          <Button size="large" className='ml-2 w-1/2'>
            {'解密'}
          </Button>
        </div>
      </Space>
    </div>
  );
}
  

export default FileCrypto;
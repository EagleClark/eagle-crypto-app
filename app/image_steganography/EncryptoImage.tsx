'use client'

import React, { useRef, useState } from 'react';
import { save } from '@tauri-apps/api/dialog';
import { useImage, FileType } from './useImage';
import { Alert, Button, Image, message, Space, Upload, UploadFile, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './EncryptoImage.module.scss';
import { encryptoWithLSB } from './lsbUtils';
import { writeBinaryFile } from '@tauri-apps/api/fs';

export default function EncryptoImage() {
  const originCanvas = useRef<HTMLCanvasElement>(null);
  const secretCanvas = useRef<HTMLCanvasElement>(null);
  const [, loadOriginImage] = useImage(originCanvas);
  const [, loadSecretImage] = useImage(secretCanvas);
  const [originSrc, setOriginSrc] = useState('');
  const [secretSrc, setSecretSrc] = useState('');
  const [originFileList, setOriginFileList] = useState<UploadFile[]>([]);
  const [secretFileList, setSecretFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handlePreview = (isOrigin: boolean) => (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = isOrigin ? originSrc : secretSrc;
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleOriginChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setOriginFileList(newFileList);

    if (newFileList.length === 0) {
      return;
    }

    const base64Url = await loadOriginImage(newFileList[0].originFileObj as FileType);
    setOriginSrc(base64Url);
  };

  const handleSecretChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setSecretFileList(newFileList);

    if (newFileList.length === 0) {
      return;
    }

    const base64Url = await loadSecretImage(newFileList[0].originFileObj as FileType);
    setSecretSrc(base64Url);
  };

  const handleExec = async () => {
    const originImageData = originCanvas.current
      ?.getContext('2d')
      ?.getImageData(0, 0, originCanvas.current!.width, originCanvas.current!.height);

    const secretImageData = secretCanvas.current
      ?.getContext('2d')
      ?.getImageData(0, 0, secretCanvas.current!.width, secretCanvas.current!.height);

    if (originImageData && secretImageData) {
      setLoading(true);
      const resImageData = encryptoWithLSB(originImageData, secretImageData);

      if (resImageData) {
        const canvas = document.createElement('canvas');
        canvas.width = originCanvas.current!.width;
        canvas.height = originCanvas.current!.height;
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(resImageData, 0, 0);
        
        const savePath = await save({ filters: [{ name: '', extensions: ['png'] }]});

        if (!savePath) {
          setLoading(false);
          return;
        }

        canvas.toBlob(async blob => {
          const arr = await blob!.arrayBuffer()
          await writeBinaryFile(savePath, arr);
          setLoading(false);
          messageApi.open({
            type: 'success',
            content: '隐写并保存成功！',
          });
        });
      } else {
        messageApi.open({
          type: 'error',
          content: '失败，请检查图片尺寸！',
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles['encrypto-image']}>
      {contextHolder}
      <Space direction='vertical' className='w-full'>
        <Alert
          message="本功能采用LSB图片隐写术，仅供休闲娱乐使用。"
          description="使用方法：先导入载体图片和要隐匿的图片（前者的像素数量需要至少为后者8倍，否则会出现信息丢失），下方会显示“隐写并保存”按钮。"
          type="info"
          showIcon
        />
        <div className='w-full mt-2 flex gap-x-2'>
          <Upload
            listType="picture"
            fileList={originFileList}
            onPreview={handlePreview(true)}
            className="w-1/2"
            maxCount={1}
            onChange={handleOriginChange}
          >
            <Button
              type="primary"
              size="large"
              block
              icon={<UploadOutlined />}
              disabled={originFileList.length > 0}
            >
              {'导入载体图片'}
            </Button>
          </Upload>
          
          <Upload
            listType="picture"
            fileList={secretFileList}
            onPreview={handlePreview(false)}
            className='ml-2 w-1/2'
            maxCount={1}
            onChange={handleSecretChange}
          >
            <Button
              size="large"
              block
              icon={<UploadOutlined />}
              disabled={secretFileList.length > 0}
            >
              {'导入要隐匿的图片'}
            </Button>
          </Upload>
        </div>
        {previewImage && (
          <Image
            alt=''
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
        {originFileList.length > 0 && secretFileList.length > 0 && (
          <Button
            size="large"
            type='primary'
            block
            onClick={handleExec}
            loading={loading}
          >
            {'隐写并保存'}
          </Button>
        )}
      </Space>
      <canvas ref={originCanvas} style={{ display: 'none' }} />
      <canvas ref={secretCanvas} style={{ display: 'none' }} />
    </div>
  );
}

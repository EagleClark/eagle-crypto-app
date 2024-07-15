'use client'

import React, { useRef, useState } from 'react';
import { save } from '@tauri-apps/api/dialog';
import { useImage, FileType } from './useImage';
import { Alert, Button, Image, message, Space, Upload, UploadFile, UploadProps } from 'antd';
import { UnlockOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './EncryptoImage.module.scss';
import { decryptoWithLSB } from './lsbUtils';
import { writeBinaryFile } from '@tauri-apps/api/fs';

export default function DecryptoImage() {
  const originCanvas = useRef<HTMLCanvasElement>(null);
  const [, loadOriginImage] = useImage(originCanvas);
  const [originSrc, setOriginSrc] = useState('');
  const [originFileList, setOriginFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handlePreview = (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = originSrc;
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

  const handleExec = async () => {
    const originImageData = originCanvas.current
      ?.getContext('2d')
      ?.getImageData(0, 0, originCanvas.current!.width, originCanvas.current!.height);

    if (originImageData) {
      setLoading(true);
      const { resImageData, widthPixels, heightPixels } = decryptoWithLSB(originImageData);

      if (resImageData) {
        const canvas = document.createElement('canvas');
        canvas.width = widthPixels;
        canvas.height = heightPixels;
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
            content: '解析并保存成功！',
          });
        });
      } else {
        messageApi.open({
          type: 'error',
          content: '图片不含有隐写内容或解析失败！',
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
          message="本功能用于解析本软件LSB隐写的图片，仅供休闲娱乐使用。"
          description="使用方法：先导入要解析的图片（图片格式尽量使用png，否则可能会出现信息丢失，无法解析），下方会显示“解析并保存”按钮。"
          type="info"
          showIcon
        />
        <div className='w-full mt-2 flex gap-x-2'>
          <Upload
            listType="picture"
            fileList={originFileList}
            onPreview={handlePreview}
            className="w-full"
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
              {'导入要解析的图片'}
            </Button>
          </Upload>
        </div>
        {originFileList.length > 0 && (
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            icon={<UnlockOutlined />}
            onClick={handleExec}
          >
            {'解析并保存'}
          </Button>
        )}
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
      </Space>
      <canvas ref={originCanvas} style={{ display: 'none' }} />
    </div>
  );
}

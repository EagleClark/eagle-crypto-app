'use client'

import React, { useRef, useState } from 'react';
import { save } from '@tauri-apps/api/dialog';
import { useImage, FileType } from './useImage';
import { Alert, Button, Image, message, Space, Upload, UploadFile, UploadProps } from 'antd';
import { SaveOutlined, UnlockOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './Styles.module.scss';
import { decryptWithLSB } from './lsbUtils';
import { writeBinaryFile } from '@tauri-apps/api/fs';

export default function DecryptImage() {
  const originCanvas = useRef<HTMLCanvasElement>(null);
  const [, loadOriginImage] = useImage(originCanvas);
  const [originSrc, setOriginSrc] = useState('');
  const [originFileList, setOriginFileList] = useState<UploadFile[]>([]);
  const [decryptFileList, setDecryptFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const decryptImageData = useRef<ImageData | null>(null);
  const decryptWidthPixels = useRef(0);
  const decryptHeightPixels = useRef(0);

  const handlePreview = (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // 导入的图片使用 preview 属性
      file.preview = originSrc;
    }

    // 解析的图片使用 url 属性
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleOriginChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    console.log(newFileList);
    setOriginFileList(newFileList);

    if (newFileList.length === 0) {
      return;
    }

    const base64Url = await loadOriginImage(newFileList[0].originFileObj as FileType);
    setOriginSrc(base64Url);
  };

  const handleDecrpytChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    if (newFileList.length === 0) {
      setDecryptFileList(newFileList);
    }
  };

  const handleDecrypt = async () => {
    const originImageData = originCanvas.current
      ?.getContext('2d')
      ?.getImageData(0, 0, originCanvas.current!.width, originCanvas.current!.height);

    if (originImageData) {
      setLoading(true);
      const { resImageData, widthPixels, heightPixels } = decryptWithLSB(originImageData);

      if (!resImageData) {
        messageApi.open({
          type: 'error',
          content: '图片不含有隐写内容或解析失败！',
        });
        setLoading(false);
        return;
      }

      decryptImageData.current = resImageData;
      decryptWidthPixels.current = widthPixels;
      decryptHeightPixels.current = heightPixels;

      if (resImageData) {
        const canvas = document.createElement('canvas');
        canvas.width = widthPixels;
        canvas.height = heightPixels;
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(resImageData, 0, 0);

        setDecryptFileList([{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: canvas.toDataURL(),
        },]);

        messageApi.open({
          type: 'success',
          content: '解析成功！',
        });
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!decryptImageData.current) {
      messageApi.open({
        type: 'error',
        content: '图片不含有隐写内容或解析失败！',
      });
      return;
    }

    setSaveLoading(true);

    const canvas = document.createElement('canvas');
    canvas.width = decryptWidthPixels.current;
    canvas.height = decryptHeightPixels.current;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(decryptImageData.current, 0, 0);
    
    const savePath = await save({ filters: [{ name: 'image', extensions: ['png'] }]});

    if (!savePath) {
      setSaveLoading(false);
      return;
    }

    canvas.toBlob(async blob => {
      const arr = await blob!.arrayBuffer()
      await writeBinaryFile(savePath, arr);
      setSaveLoading(false);
      messageApi.open({
        type: 'success',
        content: '保存成功！',
      });
    });

  };

  return (
    <div className={styles['upload-image']}>
      {contextHolder}
      <Space direction='vertical' className='w-full'>
        <Alert
          message="本功能用于解析本软件LSB隐写的图片，仅供休闲娱乐使用。"
          description="使用方法：先导入要解析的图片（图片格式尽量使用png，否则可能会出现信息丢失，无法解析），成功解析图片后下方会显示“保存图片”按钮。"
          type="info"
          showIcon
        />
        <div className='w-full mt-2 flex gap-x-2'>
          <Upload
            listType="picture"
            fileList={originFileList}
            onPreview={handlePreview}
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
              {'导入要解析的图片'}
            </Button>
          </Upload>
          <Upload
            listType="picture"
            fileList={decryptFileList}
            onPreview={handlePreview}
            className="w-1/2"
            maxCount={1}
            openFileDialogOnClick={false}
            onChange={handleDecrpytChange}
          >
            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              icon={<UnlockOutlined />}
              disabled={originFileList.length === 0}
              onClick={handleDecrypt}
            >
              {'解析图片'}
            </Button>
          </Upload>
        </div>
        {decryptFileList.length > 0 && (
          <Button
            type="primary"
            size="large"
            block
            loading={saveLoading}
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            {'保存图片'}
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

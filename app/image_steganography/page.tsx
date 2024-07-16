import React from 'react';
import { Tabs, TabsProps } from 'antd';
import EncryptImage from './EncryptImage';
import DecryptImage from './DecryptImage';

export default function Steganography() {
  const items: TabsProps['items'] = [
    {
      key: 'encrypt-image',
      label: '图片隐写',
      children: <EncryptImage />,
    },
    {
      key: 'decrypt-image',
      label: '图片反隐写',
      children: <DecryptImage />,
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="encrypt-image"
        type="card"
        items={items}
      />
    </div>
  );
}

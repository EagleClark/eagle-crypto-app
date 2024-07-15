import React from 'react';
import { Tabs, TabsProps } from 'antd';
import EncryptoImage from './EncryptoImage';
import DecryptoImage from './DecryptoImage';

export default function Steganography() {
  const items: TabsProps['items'] = [
    {
      key: 'encrypt-image',
      label: '图片隐写',
      children: <EncryptoImage />,
    },
    {
      key: 'decrypt-image',
      label: '图片反隐写',
      children: <DecryptoImage />,
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

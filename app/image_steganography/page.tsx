import React from 'react';
import { Tabs, TabsProps } from 'antd';
// import TextSteganography from './TextSteganography';
// import SensitiveWords from './SensitiveWords';

export default function Steganography() {
  const items: TabsProps['items'] = [
    {
      key: 'encrypt-image',
      label: '图片隐写',
      children: '',
    },
    {
      key: 'decrypt-image',
      label: '图片反隐写',
      children: '',
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

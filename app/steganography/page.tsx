import React from 'react';
import { Tabs, TabsProps } from 'antd';
import TextSteganography from './TextSteganography';
import SensitiveWords from './SensitiveWords';

export default function Steganography() {
  const items: TabsProps['items'] = [
    {
      key: 'text',
      label: '文字隐写',
      children: <TextSteganography />,
    },
    {
      key: 'sensitive-words',
      label: '敏感词绕过',
      children: <SensitiveWords />,
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="text"
        type="card"
        items={items}
      />
    </div>
  );
}

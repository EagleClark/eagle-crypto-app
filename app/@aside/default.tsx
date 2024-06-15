'use client'

import { Menu } from 'antd';
import { FileOutlined, PictureOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

type MenuItem = GetProp<MenuProps, 'items'>[number];

export default function Aside() {
  const router = useRouter();
  const items: MenuItem[] = [
    { key: '1', icon: <FileOutlined />, label: '文件加密/解密', onClick: () => {
      router.push('/file_crypto');
    } },
    { key: '2', icon: <PictureOutlined />, label: '图片隐写', onClick: () => {
      router.push('/image_crypto');
    }  },
  ];

  return (
    <>
      <Menu
        defaultSelectedKeys={['1']}
        inlineIndent={24}
        mode="inline"
        items={items}
      />
    </>
  )
}
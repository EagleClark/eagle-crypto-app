'use client'

import { Menu } from 'antd';
import { FileUnknownOutlined, LockOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { ROUTER_MAP } from '../lib/constant';

type MenuItem = GetProp<MenuProps, 'items'>[number];

export default function Aside() {
  const router = useRouter();
  const items: MenuItem[] = [
    { key: '1', icon: <LockOutlined />, label: ROUTER_MAP['/file_crypto'].title, onClick: () => {
      router.push(ROUTER_MAP['/file_crypto'].path);
    } },
    { key: '2', icon: <FileUnknownOutlined />, label: ROUTER_MAP['/steganography'].title, onClick: () => {
      router.push(ROUTER_MAP['/steganography'].path);
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
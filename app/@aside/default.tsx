'use client'

import { Menu } from 'antd';
import { FileImageOutlined, FileUnknownOutlined, LockOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { ROUTER_MAP } from '../lib/constant';
import Image from 'next/image';
import DarkSVG from '../../public/dark.svg';
import LightSVG from '../../public/light.svg';
import { useTheme } from '../lib/store/theme';

type MenuItem = GetProp<MenuProps, 'items'>[number];

export default function Aside() {
  const router = useRouter();
  const { switchTheme, theme } = useTheme();
  const items: MenuItem[] = [
    {
      key: '1',
      icon: <LockOutlined />,
      label: ROUTER_MAP['/file_crypto'].title,
      onClick: () => {
        router.push(ROUTER_MAP['/file_crypto'].path);
      },
    },
    {
      key: '2',
      icon: <FileUnknownOutlined />,
      label: ROUTER_MAP['/text_steganography'].title,
      onClick: () => {
        router.push(ROUTER_MAP['/text_steganography'].path);
      },
    },
    {
      key: '3',
      icon: <FileImageOutlined />,
      label: ROUTER_MAP['/image_steganography'].title,
      onClick: () => {
        router.push(ROUTER_MAP['/image_steganography'].path);
      },
    },
  ];

  return (
    <div className='h-full flex flex-col justify-between'>
      <Menu
        defaultSelectedKeys={['1']}
        inlineIndent={24}
        mode="inline"
        items={items}
      />
      <div className='flex flex-col items-center mb-4 cursor-pointer' title='主题'>
        {
          theme === 'dark' ?
            <Image src={LightSVG} alt={'主题'} width={28} height={28} onClick={switchTheme} /> :
            <Image src={DarkSVG} alt={'主题'} width={24} height={24} onClick={switchTheme} />
        }
      </div>
    </div>
  )
}
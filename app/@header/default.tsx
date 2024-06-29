'use client'

import { usePathname } from 'next/navigation';
import { ROUTER_MAP } from '../lib/constant';
import { useTheme } from '../lib/store/theme';

export default function Header() {
  const pathname = usePathname() as keyof typeof ROUTER_MAP;
  const { theme } = useTheme();

  return (
    <div
      className='h-12 flex justify-center items-center text-lg'
      style={{ backgroundColor: theme === 'light' ? '#ffffff' : '#001529' }}
    >
      { ROUTER_MAP[pathname].title }
    </div>
  )
}

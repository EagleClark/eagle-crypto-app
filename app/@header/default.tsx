'use client'

import { usePathname } from 'next/navigation';
import { ROUTER_MAP } from '../lib/constant';

export default function Header() {
  const pathname = usePathname() as keyof typeof ROUTER_MAP;

  return (
    <div className='h-12 flex justify-center items-center text-lg'>
      { ROUTER_MAP[pathname].title }
    </div>
  )
}

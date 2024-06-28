'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTER_MAP } from './lib/constant';

export default function Home() {
  const router = useRouter();

  async function setupAppWindow() {
    const { appWindow, LogicalSize } = (await import('@tauri-apps/api/window'));
    appWindow.setMinSize(new LogicalSize(800, 600));
  }

  useEffect(() => {
    setupAppWindow();
    router.push(ROUTER_MAP['/file_crypto'].path);
  }, [router]);

  return (
    <main>
    </main>
  );
}

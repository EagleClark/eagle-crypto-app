'use client'

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTER_MAP } from './lib/constant';
import { useTheme } from './lib/store/theme';

export default function Home() {
  const router = useRouter();
  const { init } = useTheme();

  const setupAppWindow = useCallback(async () => {
    const { appWindow, LogicalSize } = (await import('@tauri-apps/api/window'));
    appWindow.setMinSize(new LogicalSize(800, 600));
    init();
  }, [init]); 

  useEffect(() => {
    setupAppWindow();
    router.push(ROUTER_MAP['/file_crypto'].path);
  }, [router, setupAppWindow]);

  return (
    <main>
    </main>
  );
}

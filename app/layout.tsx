'use client'

import './globals.css';
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import { Layout } from 'antd';
import { useRouter } from 'next/navigation';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { ROUTER_MAP } from './lib/constant';

appWindow.setMinSize(new LogicalSize(800, 600));

const { Header, Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  height: '100vh',
  overflow: 'hidden',
};

const innerLayoutStyle: React.CSSProperties = {
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  height: 48,
  width: '100%',
  padding: 0,
};

const contentStyle: React.CSSProperties = {
  padding: 16,
  overflow: 'auto',
  minHeight: 'calc(100vh - 48px)',
};

const siderStyle: React.CSSProperties = {
  height: 'auto',
  overflow: 'hidden',
};

const RootLayout = (props: {
  children: React.ReactNode;
  header: React.ReactNode;
  aside: React.ReactNode;
}) => {
  const router = useRouter();
  router.push(ROUTER_MAP['/steganography'].path);

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          {/* <ConfigProvider> */}
            <Layout style={layoutStyle}>
              <Sider style={siderStyle} collapsed>
                {props.aside}
              </Sider>
              <Layout style={innerLayoutStyle}>
                <Header style={headerStyle}>
                  {props.header}
                </Header>
                <Content style={contentStyle}>{props.children}</Content>
              </Layout>
            </Layout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
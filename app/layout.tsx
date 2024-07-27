'use client'

import './globals.css';
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { Layout } from 'antd';
import { useTheme } from './lib/store/theme';

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
  const { theme, algorithm } = useTheme();

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={{ algorithm }}>
            <Layout style={layoutStyle}>
              <Sider style={siderStyle} collapsed theme={theme}>
                {props.aside}
              </Sider>
              <Layout style={innerLayoutStyle}>
                <Header style={headerStyle}>
                  {props.header}
                </Header>
                <Content className={theme} style={contentStyle}>{props.children}</Content>
              </Layout>
            </Layout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
};

export default RootLayout;
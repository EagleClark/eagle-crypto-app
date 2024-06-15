'use client'

import './globals.css';
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import { Layout } from 'antd';
import { useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  height: 48,
  width: '100%',
  padding: 0,
};

const contentStyle: React.CSSProperties = {
  padding: 16,
};

const siderStyle: React.CSSProperties = {
  height: '100vh',
};

const RootLayout = (props: {
  children: React.ReactNode;
  header: React.ReactNode;
  aside: React.ReactNode;
}) => {
  const router = useRouter();
  router.push('/file_crypto');

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          {/* <ConfigProvider> */}
            <Layout>
              <Sider style={siderStyle} collapsed>
                {props.aside}
              </Sider>
              <Layout>
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
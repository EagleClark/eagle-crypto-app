'use client'

import React from 'react';
import { Button } from 'antd';

export default function ImageCrypto() {
  const aaa = (event: any) => {
    console.log(event.target.value)
  }
  return (
    <main>
      <input type='file' onChange={aaa} />
    </main>
  );
}
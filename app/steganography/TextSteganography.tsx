import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Input, message, Space, Spin, Upload } from 'antd';

const { TextArea } = Input;

export default function TextSteganography() {
  const [form] = Form.useForm();
  const [yourText, setYourText] = useState('');

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setYourText(event.currentTarget.value);
  };
  return (
    <div>
      <Space direction='vertical' className='w-full'>
        <Form
        layout='vertical'
        form={form}
        >
          <Form.Item label="请输入明文文本">
            <TextArea
              placeholder="请输入..."
              rows={4}
              value={yourText}
              onChange={handleTextChange}
            />
          </Form.Item>
          <Form.Item label="处理结果">
            <TextArea
              placeholder="请输入..."
              rows={4}
              value={yourText}
              onChange={handleTextChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Submit</Button>
          </Form.Item>
        </Form>
        <div className='w-full mt-2 flex'>
          {/* <Button
            type="primary"
            size="large"
            className='w-1/2'
            onClick={handleEncrypt}
          >
            {'加密'}
          </Button>
          <Button
            size="large"
            className='ml-2 w-1/2'
            onClick={handleDecrypt}
          >
            {'解密'}
          </Button> */}
        </div>
      </Space>
    </div>
  );
}
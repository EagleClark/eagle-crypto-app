import React, { ChangeEvent, useState } from 'react';
import { Alert, Button, Form, Input, message, Space, Spin, Upload } from 'antd';
import { useCopy } from './useCopy';
import { ZERO_WIDTH_CHAR } from '../lib/constant';

const { TextArea } = Input;

export default function SensitiveWords() {
  const [form] = Form.useForm();
  const [yourText, setYourText] = useState('');
  const [resultText, setResultText, copy] = useCopy();

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setYourText(event.currentTarget.value);
  };

  const handleResTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setResultText(event.currentTarget.value);
  };

  const handleDealText = () => {
    const textArr = yourText.split('');
    const resultArr = textArr.map((char, index) => {
      if (index !== textArr.length - 1) {
        const zeroWidthCharIndex = Math.random() <= 0.5 ? 1 : 2;
        return `${char}${ZERO_WIDTH_CHAR[zeroWidthCharIndex]}`
      }

      return char;
    });

    setResultText(resultArr.join(''));
  };

  const handleCopy = async () => {
    await copy();

    message.open({
      type: 'success',
      content: '复制成功',
    });
  };

  return (
    <div>
      <Space direction='vertical' className='w-full'>
        <Alert message="简单的敏感词绕过功能，只适用于部分平台，本功能仅供休闲娱乐使用" type="info" showIcon />
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
              placeholder="处理结果将在此处显示..."
              rows={4}
              value={resultText}
              onChange={handleResTextChange}
            />
          </Form.Item>
          <Form.Item>
            <div className='w-full mt-2 flex'>
              <Button
                type="primary"
                size="large"
                className='w-1/2'
                onClick={handleDealText}
              >
                {'处理文本'}
              </Button>
              <Button
                size="large"
                className='ml-2 w-1/2'
                onClick={handleCopy}
              >
                {'复制结果'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
}
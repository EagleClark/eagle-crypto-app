import React, { ChangeEvent, useState } from 'react';
import { Button, Divider, Form, Input, message, Space } from 'antd';
import { useCopy } from './useCopy';

const { TextArea } = Input;

export default function TextSteganography() {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [yourText, setYourText] = useState('');
  const [secretText, setSecretText] = useState('');
  const [resultText, setResultText, copyResult] = useCopy();
  const [steganographyText, setSteganographyText] = useState('');
  const [hiddenText, setHiddenText, copyHidden] = useCopy();
  

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>, type: string) => {
    const { value } = event.currentTarget;
    switch (type) {
      case 'yourText':
        setYourText(value);
        break;
      case 'secretText':
        setSecretText(value);
        break;
      case 'resultText':
        setResultText(value);
        break;
      case 'steganographyText':
        setSteganographyText(value);
        break;
      case 'hiddenText':
        setHiddenText(value);
        break;
      default:
    }
  };

  const steganography = () => {};

  const handleCopy = async (type: string) => {
    if (type === 'result') {
      await copyResult();
    } else if (type === 'hidden') {
      await copyHidden();
    }

    message.open({
      type: 'success',
      content: '复制成功',
    });
  };

  const antiStego = () => {};

  return (
    <div>
      <Space direction='vertical' className='w-full'>
        <Form
          layout='vertical'
          form={form1}
        >
          <Form.Item label="请输入明文文本">
            <TextArea
              placeholder="请输入..."
              rows={1}
              value={yourText}
              onChange={$event => handleTextChange($event, 'yourText')}
            />
          </Form.Item>
          <Form.Item label="请输入要隐写的文本">
            <TextArea
              placeholder="请输入..."
              rows={1}
              value={secretText}
              onChange={$event => handleTextChange($event, 'secretText')}
            />
          </Form.Item>
          <Form.Item label="生成的隐写文本">
            <TextArea
              placeholder="隐写结果在此显示..."
              rows={1}
              value={resultText}
              onChange={$event => handleTextChange($event, 'resultText')}
            />
          </Form.Item>
          <Form.Item>
            <div className='w-full mt-2 flex'>
              <Button type="primary" className='w-1/2' onClick={steganography}>
                {'隐写'}
              </Button>
              <Button className='ml-2 w-1/2' onClick={() => handleCopy('result')}>
                {'复制结果'}
              </Button>
            </div>
          </Form.Item>
        </Form>

        <Divider></Divider>

        <Form
          layout='vertical'
          form={form2}
        >
          <Form.Item label="请输入要反隐写的文本">
            <TextArea
              placeholder="请输入..."
              rows={1}
              value={steganographyText}
              onChange={$event => handleTextChange($event, 'steganographyText')}
            />
          </Form.Item>
          <Form.Item label="隐写的文本">
            <TextArea
              placeholder="反隐写结果在此显示..."
              rows={1}
              value={hiddenText}
              onChange={$event => handleTextChange($event, 'hiddenText')}
            />
          </Form.Item>
          <Form.Item>
            <div className='w-full mt-2 flex'>
              <Button type="primary" className='w-1/2' onClick={antiStego}>
                {'反隐写'}
              </Button>
              <Button className='ml-2 w-1/2' onClick={() => handleCopy('hidden')}>
                {'复制结果'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
}
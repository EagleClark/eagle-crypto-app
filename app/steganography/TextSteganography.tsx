import React, { ChangeEvent, useState } from 'react';
import { Button, Divider, Form, Input, message, Space } from 'antd';
import { useCopy } from './useCopy';
import { ZERO_WIDTH_CHAR } from '../lib/constant';

const { TextArea } = Input;

export default function TextSteganography() {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [yourText, setYourText] = useState('');
  const [secretText, setSecretText] = useState('');
  const [resultText, setResultText, copyResult] = useCopy();
  const [steganographyText, setSteganographyText] = useState('');
  const [hiddenText, setHiddenText] = useState('');

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

  const handleCopy = async () => {
    await copyResult();

    message.open({
      type: 'success',
      content: '复制成功',
    });
  };

  const steganography = () => {
    // 字符转数组
    const res = Array.from(secretText)
      // 转成二级制
      .map(singleStr => singleStr.codePointAt(0)!.toString(2))
      // 0、1替换为零宽字符
      .map(binStr =>
        Array.from(binStr)
          .map(singleBinStr => singleBinStr === '1' ? ZERO_WIDTH_CHAR[1] : ZERO_WIDTH_CHAR[2])
          .join('')
      )
      .join(ZERO_WIDTH_CHAR[0]);

    if (yourText.length > 0) {
      const textArr = Array.from(yourText);
      textArr.splice(1, 0, res);
      setResultText(textArr.join(''));
    } else {
      setResultText(res);
    }
  };

  const antiStego = () => {
    if (steganographyText.length === 0) {
      message.open({
        type: 'warning',
        content: '要反隐写的文本不能为空',
      });

      return;
    }

    // 反隐写字符串分割成字符串数组
    const textArr = steganographyText.split(ZERO_WIDTH_CHAR[0]);

    // 将数组中的文本转回成二进制数组
    const binArr = textArr.map(str =>
      Array
        .from(str)
        .map(singleStr => {
          if (singleStr === ZERO_WIDTH_CHAR[1]) {
            return '1';
          }

          if (singleStr === ZERO_WIDTH_CHAR[2]) {
            return '0';
          }

          return '';
        })
        .join('')
    );

    // 将二进制文本转回十进制，再使用 String.fromCodePoint 转为原文本
    const hidden = binArr
      .map(singleBin => String.fromCodePoint(parseInt(singleBin, 2)))
      .join('');

    setHiddenText(hidden);
  };

  const handleReset = () => {
    setSteganographyText('');
    setHiddenText('');
  };

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
              <Button className='ml-2 w-1/2' onClick={handleCopy}>
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
              <Button className='ml-2 w-1/2' onClick={handleReset}>
                {'重置'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
}
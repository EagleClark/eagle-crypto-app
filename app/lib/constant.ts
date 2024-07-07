export const ROUTER_MAP = {
  '/': { path: '/', title: '' },
  '/file_crypto': { path: '/file_crypto', title: '文件加密/解密' },
  '/text_steganography': { path: '/text_steganography', title: '文本隐写' },
  '/image_steganography': { path: '/image_steganography', title: '图片隐写' },
};

// 零宽字符，U+200C、U+200D 在控制台也看不见
export const ZERO_WIDTH_CHAR = ['\u200B', '\u200C', '\u200D', '\u200E', '\u200F', '\uFEFF'];

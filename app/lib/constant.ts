export const ROUTER_MAP = {
  '/file_crypto': { path: '/file_crypto', title: '文件加密/解密' },
  '/steganography': { path: '/steganography', title: '隐写术' },
};

// 零宽字符，U+200C、U+200D 在控制台也看不见
export const ZERO_WIDTH_CHAR = ['\u200B', '\u200C', '\u200D', '\u200E', '\u200F', '\uFEFF'];
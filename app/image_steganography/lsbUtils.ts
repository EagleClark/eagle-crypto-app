// 前xx位存隐写数据的像素宽高
const WIDTH_PIXEL = 16;
const HEIGHT_PIXEL = 16;

const TOTAL_BIT = WIDTH_PIXEL + HEIGHT_PIXEL;

const getImageTotalBit = (widthPixels: number, heightPixels: number) =>
  widthPixels * heightPixels * 4 * 8 + TOTAL_BIT;

export function encryptWithLSB(originImageData: ImageData, secretImageData: ImageData) {
  const originPixel = originImageData.width * originImageData.height;
  const secretPixel = secretImageData.width * secretImageData.height;

  if (originPixel < secretPixel * 8 + TOTAL_BIT) {
    return null;
  }

  const resImageData = new ImageData(originImageData.width, originImageData.height);

  // 1.原图最低位全部置零后赋值
  for (let i = 0; i < originImageData.data.length; i++) {
    resImageData.data[i] = originImageData.data[i] & 0b11111110;
  }

  // 2.将隐写数据像素宽高写入原图最低位
  const widthBinArr = secretImageData.width.toString(2).padStart(WIDTH_PIXEL, "0").split("");
  const heightBinArr = secretImageData.height.toString(2).padStart(HEIGHT_PIXEL, "0").split("");

  for (let i = 0; i < widthBinArr.length; i++) {
    if (widthBinArr[i] === "1") {
      resImageData.data[i] = originImageData.data[i] | 0b00000001;
    } else if (widthBinArr[i] === "0") {
      resImageData.data[i] = originImageData.data[i] & 0b11111110;
    }
  }
  for (let i = 0; i < heightBinArr.length; i++) {
    if (heightBinArr[i] === "1") {
      resImageData.data[i + widthBinArr.length] = originImageData.data[i + widthBinArr.length] | 0b00000001;
    } else if (heightBinArr[i] === "0") {
      resImageData.data[i + widthBinArr.length] = originImageData.data[i + widthBinArr.length] & 0b11111110;
    }
  }

  // 3.将隐写数据写入原图
  let originImageDataIndex = TOTAL_BIT;
  for (let i = 0; i < secretImageData.data.length; i++) {
    const currentData = secretImageData.data[i];
    const currentDataArr = currentData.toString(2).padStart(8, "0").split("");

    currentDataArr.forEach(bit => {
      if (bit === "1") {
        resImageData.data[originImageDataIndex] = resImageData.data[originImageDataIndex] | 0b00000001;
      } else if (bit === "0") {
        resImageData.data[originImageDataIndex] = resImageData.data[originImageDataIndex] & 0b11111110;
      }

      originImageDataIndex++;
    });
    
  }

  return resImageData;
}

export function decryptWithLSB(originImageData: ImageData) {
  let widthBinStr = '';
  for (let i = 0; i < WIDTH_PIXEL; i++) {
    const lastBit = (originImageData.data[i] & 0b00000001).toString();
    widthBinStr += lastBit;
  }
  const widthPixels = parseInt(widthBinStr, 2);

  let heightBinStr = '';
  for (let i = WIDTH_PIXEL; i < TOTAL_BIT; i++) {
    const lastBit = (originImageData.data[i] & 0b00000001).toString();
    heightBinStr += lastBit;
  }
  const heightPixels = parseInt(heightBinStr, 2);

  const imageTotalBit = getImageTotalBit(widthPixels, heightPixels);

  if (
    widthPixels * heightPixels === 0
    || imageTotalBit > originImageData.data.length
  ) {
    return { resImageData: null, widthPixels, heightPixels };
  }

  const resImageData = new ImageData(widthPixels, heightPixels);

  let byteStr = '';
  let resImageIndex = 0;
  for (let i = TOTAL_BIT; i < imageTotalBit; i++) {
    const lastBit = (originImageData.data[i] & 0b00000001).toString();
    byteStr += lastBit;

    if (byteStr.length === 8) {
      resImageData.data[resImageIndex] = parseInt(byteStr, 2);
      byteStr = '';
      resImageIndex++;
    }
  }

  return { resImageData, widthPixels, heightPixels };
}

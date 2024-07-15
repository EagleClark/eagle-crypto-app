import { RefObject, useEffect, useRef } from "react";
import { GetProp, UploadProps } from 'antd';

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });

export function useImage(canvasRef: RefObject<HTMLCanvasElement>) {
  const image = useRef<HTMLImageElement | null>(null);

  const clearImage = () => {
    if (image.current) {
      image.current.onload = null;
    }
  };

  useEffect(() => {
    image.current = new Image();
    image.current.onload = () => {
      if (canvasRef.current && image.current) {
        canvasRef.current.width = image.current.width;
        canvasRef.current.height = image.current.height;
        canvasRef.current.getContext("2d")?.drawImage(image.current, 0, 0);
      }
    };

    return () => {
      clearImage();
    };
  }, [canvasRef]);

  const loadImage = async (file: FileType) => {
    if (image.current) {
      const base64 = await getBase64(file);
      image.current.src = base64;

      return base64;
    }

    return "";
  };

  return [image, loadImage] as const;
}
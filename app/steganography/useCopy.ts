import { useState } from "react";

export function useCopy() {
  const [text, setText] = useState('');

  const copy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return [text, setText, copy] as const;
}
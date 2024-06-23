use crypto::{blockmodes::PkcsPadding, buffer::{ReadBuffer, RefReadBuffer, RefWriteBuffer, WriteBuffer}, symmetriccipher::SymmetricCipherError};

/*
AES256-CBC-Pkcs加密
key 长度256Bits(32Bytes)
iv 128Bits(16Bytes)
*/
pub fn aes256_cbc_encrypt(
  data: &[u8],
  key: &[u8],
  iv: &[u8],
) -> Result<Vec<u8>, SymmetricCipherError> {
  let mut encryptor = crypto::aes::cbc_encryptor(
    crypto::aes::KeySize::KeySize256,
    key,
    iv,
    PkcsPadding,
  );

  let mut buffer = [0; 4096];
  let mut write_buffer = RefWriteBuffer::new(&mut buffer);
  let mut read_buffer = RefReadBuffer::new(data);
  let mut final_result = Vec::new();

  loop {
      let result = encryptor.encrypt(&mut read_buffer, &mut write_buffer, true)?;
      final_result.extend(write_buffer.take_read_buffer().take_remaining().iter().map(|&i| i));
      match result {
        crypto::buffer::BufferResult::BufferUnderflow => break,
        _ => continue,
      }
  }

  Ok(final_result)
}

/*
AES256-CBC-Pkcs解密
key 长度256Bits(32Bytes)
iv 128Bits(16Bytes)
*/
pub fn aes256_cbc_decrypt(
  data: &[u8],
  key: &[u8],
  iv: &[u8],
) -> Result<Vec<u8>, SymmetricCipherError> {
  let mut decryptor = crypto::aes::cbc_decryptor(
    crypto::aes::KeySize::KeySize256,
    key,
    iv,
    PkcsPadding,
  );

  let mut buffer = [0; 4096];
  let mut write_buffer = RefWriteBuffer::new(&mut buffer);
  let mut read_buffer = RefReadBuffer::new(data);
  let mut final_result = Vec::new();

  loop {
      let result = decryptor.decrypt(&mut read_buffer, &mut write_buffer, true)?;
      final_result.extend(write_buffer.take_read_buffer().take_remaining().iter().map(|&i| i));
      match result {
        crypto::buffer::BufferResult::BufferUnderflow => break,
        _ => continue,
      }
  }

  Ok(final_result)
}

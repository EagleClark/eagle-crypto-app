// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod aes256;

use std::fs::{File, OpenOptions};
use std::io::{Write, BufReader, BufRead};

const ENCRYPT_BUFFER_SIZE: usize = 512;

const DECRYPT_BUFFER_SIZE: usize = 528;

fn main() {
  use tauri::Manager;
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(debug_assertions)] // only include this code on debug builds
      {
        let window = app.get_window("main").unwrap();
        window.open_devtools();
        window.close_devtools();
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![aes256_encrypt, aes256_decrypt])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn aes256_encrypt(file_path: String) {
  // , secret_key: String
  let key = [0x31; 32];
  let iv = [0x30; 16];

  // 创建一个新文件
  let mut file = OpenOptions::new().create(true).append(true).open(format!("{}.encrypt", file_path)).unwrap();

  // 打开选择的文件
  let file_tobe_encrypt = File::open(file_path).unwrap();

  // 读取文件
  let mut reader = BufReader::with_capacity(ENCRYPT_BUFFER_SIZE, file_tobe_encrypt);

  loop {
      let buffer = reader.fill_buf().unwrap();

      let buffer_length = buffer.len();

      if buffer_length == 0 {
        break;
      }

      // 加密
      let e_data = aes256::aes256_cbc_encrypt(buffer, &key, &iv).unwrap();

      // 写入内容到文件
      file.write_all(&e_data).unwrap();

      // 冲缓冲区中消耗所有字节
      reader.consume(buffer_length);
  }
}

#[tauri::command]
fn aes256_decrypt(file_path: String) {
  // , secret_key: String
  let key = [0x31; 32];
  let iv = [0x30; 16];

  // 创建一个新文件，待写入数据
  let mut file = OpenOptions::new().create(true).append(true).open(format!("{}.decrypt", file_path)).unwrap();

  // 打开待解密文件
  let file_tobe_decrypt = File::open(file_path).unwrap();

  // 读取待解密文件
  let mut reader = BufReader::with_capacity(DECRYPT_BUFFER_SIZE, file_tobe_decrypt);

  loop {
      let buffer = reader.fill_buf().unwrap();

      let buffer_length = buffer.len();

      if buffer_length == 0 {
        break;
      }

      // 解密
      let d_data = aes256::aes256_cbc_decrypt(buffer, &key, &iv).unwrap();

      // 写入内容到新文件
      file.write_all(&d_data).unwrap();

      // 冲缓冲区中消耗所有字节
      reader.consume(buffer_length);
  }
}

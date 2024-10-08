# eagle-crypto-app

## Description

这是一个 `Tauri + NextJS` 开发的项目，开发 `eagle-crypto-app` 的目的主要是为了以项目驱动来学习 `Rust` 和 `NextJS` 开发。同时本人对一些加密、隐写术之类的东西比较感兴趣，所以就有了这个项目。

本项目仅做开发学习、交流使用，不可用于其他目的。

## Develop

下载代码之后，安装前端相关依赖：

```bash
pnpm install
```

开发模式运行：

```bash
pnpm tauri dev
```

开发完成之后打包：

```bash
pnpm tauri build
```

## 效果展示

### 文件加解密

![pic1](https://fastly.jsdelivr.net/gh/EagleClark/cdn@0.0.5/pictures/pic1.jpg)

### 文本隐写

![pic2](https://fastly.jsdelivr.net/gh/EagleClark/cdn@0.0.5/pictures/pic2.jpg)

![pic3](https://fastly.jsdelivr.net/gh/EagleClark/cdn@0.0.5/pictures/pic3.jpg)

### 图片隐写

![pic4](https://fastly.jsdelivr.net/gh/EagleClark/cdn@0.0.5/pictures/pic4.jpg)

![pic5](https://fastly.jsdelivr.net/gh/EagleClark/cdn@0.0.5/pictures/pic5.jpg)

## TODO LIST

- `AES` 加解密性能优化
- NextJS 服务端渲染和客户端渲染页面优化
- 国际化开发
- 更多隐写或加解密玩儿法

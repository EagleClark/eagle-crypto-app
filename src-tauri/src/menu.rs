use tauri::api::dialog::message;
use tauri::utils::assets::EmbeddedAssets;
use tauri::{AboutMetadata, Context, CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

// 应用菜单项
pub fn init(context: &Context<EmbeddedAssets>) -> Menu {
    // 应用名称
  let name = &context.package_info().name;
  println!("{}", name);
  // 应用主菜单
  let app_menu = Submenu::new(
    "",
    Menu::new()
      .add_native_item(MenuItem::About(name.into(), AboutMetadata::new()))
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Hide)
      .add_native_item(MenuItem::Minimize)
      .add_native_item(MenuItem::Zoom)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit),
  );
  // 作者菜单（自定义菜单）
  let author_menu = Submenu::new(
"Author",
Menu::new()
      .add_item(CustomMenuItem::new("author".to_string(), "About author")),
  );

  Menu::new()
    .add_submenu(app_menu)
    .add_submenu(author_menu)
}

// 应用菜单处理事件
pub fn handler(event: WindowMenuEvent) {
  // 菜单所属的窗口
  let win = Some(event.window());
  // 匹配菜单 id
  match event.menu_item_id() {
    "author" => {
      // 发送信息到菜单所属窗口（弹窗形式）
      message(win, "Eagle Clark's Blog", "https://eagle90.com");
    }
    _ => {}
  }
}
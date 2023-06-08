#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use crate::discord::DiscordClient;
use crate::project::ActiveProject;
use crate::server::ResourceRouter;
use crate::watcher::FileWatcher;
use window_shadows::set_shadow;

pub mod discord;
pub mod project;
pub mod server;
pub mod watcher;
pub mod simvars;

fn main() {
    tauri::Builder::default()
        .setup(move |app| {
            if cfg!(target_os = "windows") || cfg!(target_os = "linux") {
                let window = app.get_window("main").unwrap();
                set_shadow(&window, true).unwrap_or_default();
            }
            Ok(())
        })
        .register_uri_scheme_protocol("ace", server::handle_ace_request)
        .manage(ActiveProject::default())
        .manage(FileWatcher::default())
        .manage(ResourceRouter::new())
        .manage(DiscordClient::new())
        .invoke_handler(tauri::generate_handler![
            project::commands::create_project,
            project::commands::update_project,
            project::commands::load_project,
            project::commands::unload_project,
            project::instruments::load_instruments,
            simvars::load_simvars,
            simvars::save_simvars,
            watcher::watch,
            watcher::unwatch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

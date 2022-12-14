#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::discord::DiscordClient;
use crate::project::CurrentProject;
use crate::server::ResourceRouter;
use crate::watcher::FileWatcher;

pub mod discord;
pub mod project;
pub mod server;
pub mod watcher;

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("ace", server::handle_ace_request)
        .manage(CurrentProject::default())
        .manage(FileWatcher::default())
        .manage(ResourceRouter::new())
        .manage(DiscordClient::new())
        .invoke_handler(tauri::generate_handler![
            project::create_project,
            project::update_project,
            project::load_project,
            project::unload_project,
            project::instruments::load_instruments,
            project::simvars::load_simvars,
            project::simvars::save_simvars,
            watcher::watch,
            watcher::unwatch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

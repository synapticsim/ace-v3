#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::discord::DiscordClient;
use crate::project::CurrentProject;
use crate::server::ResourceRouter;

mod discord;
mod project;
mod server;
mod simvars;

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("ace", server::handle_ace_request)
        .manage(CurrentProject::default())
        .manage(ResourceRouter::new())
        .manage(DiscordClient::new())
        .invoke_handler(tauri::generate_handler![
            project::create_project,
            project::load_project,
            project::unload_project,
            simvars::load_simvars,
            simvars::save_simvars,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

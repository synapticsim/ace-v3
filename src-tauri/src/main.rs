#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::discord::DiscordClient;
use crate::project::ActiveProject;
use crate::server::ResourceRouter;
use crate::watcher::FileWatcher;
use log::LevelFilter;
use tauri::Manager;
use tauri_plugin_log::fern::colors::{Color, ColoredLevelConfig};
use tauri_plugin_log::LogTarget;
use window_shadows::set_shadow;

pub mod discord;
pub mod project;
pub mod server;
pub mod simvars;
pub mod watcher;

fn main() {
    let log_color_config = ColoredLevelConfig::default()
        .info(Color::Blue)
        .debug(Color::Cyan)
        .trace(Color::BrightWhite);

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .format(move |out, message, record| {
                    out.finish(format_args!(
                        "{:<5} [{}] {}",
                        log_color_config.color(record.level()),
                        record.target(),
                        message,
                    ));
                })
                .targets([LogTarget::LogDir, LogTarget::Stdout])
                .level(if cfg!(debug_assertions) {
                    LevelFilter::Debug
                } else {
                    LevelFilter::Info
                })
                .build(),
        )
        .setup(move |app| {
            // Window shadow and (on Windows) rounded corners since we disabled `decorations`.
            if cfg!(target_os = "windows") || cfg!(target_os = "linux") {
                let window = app.get_window("main").unwrap();
                set_shadow(&window, true).unwrap_or_default();
            }

            // Configure manage state here so that `tauri_plugin_log` can capture messages.
            app.manage(ActiveProject::default());
            app.manage(FileWatcher::default());
            app.manage(ResourceRouter::new());
            app.manage(DiscordClient::new());

            Ok(())
        })
        .register_uri_scheme_protocol("ace", server::handle_ace_request)
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

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::project::Project;
use crate::server::ResourceType;
use discord_rich_presence::{
    activity::{Activity, Timestamps},
    DiscordIpc, DiscordIpcClient,
};
use matchit::Router;
use std::default::Default;
use std::path::PathBuf;
use std::sync::RwLock;
use std::time::{SystemTime, UNIX_EPOCH};

mod project;
mod server;

pub struct ResourceRouter(RwLock<Router<ResourceType>>);

impl ResourceRouter {
    fn new() -> Self {
        let mut router = Router::new();
        router
            .insert("/project/*bundle", ResourceType::Bundle)
            .unwrap();
        router.insert("/*path", ResourceType::External).unwrap();

        ResourceRouter(RwLock::new(router))
    }
}

pub struct DiscordClient(RwLock<DiscordIpcClient>);

impl DiscordClient {
    fn new() -> Self {
        let mut discord = DiscordIpcClient::new("1046278806685622302").unwrap();
        discord.connect().unwrap();
        discord
            .set_activity(
                Activity::new().state("Idling").timestamps(
                    Timestamps::new().start(
                        SystemTime::now()
                            .duration_since(UNIX_EPOCH)
                            .unwrap()
                            .as_secs() as i64,
                    ),
                ),
            )
            .unwrap();

        DiscordClient(RwLock::new(discord))
    }
}

#[derive(Debug, Default)]
pub struct CurrentProject(RwLock<Option<(PathBuf, Project)>>);

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

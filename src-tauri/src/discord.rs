use discord_rich_presence::activity::{Activity, Timestamps};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use std::sync::RwLock;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct DiscordClient(pub RwLock<Option<DiscordIpcClient>>);

impl DiscordClient {
    pub fn new() -> Self {
        let mut discord = DiscordIpcClient::new("1046278806685622302").unwrap();
        let ipc = match discord.connect() {
            Ok(_) => Some(discord),
            Err(_) => None,
        };

        let client = DiscordClient(RwLock::new(ipc));
        client.set_idle();
        client
    }

    pub fn set_idle(&self) {
        match &mut *self.0.write().unwrap() {
            Some(ipc) => ipc.set_activity(Activity::new().state("Idling")).unwrap(),
            None => (),
        }
    }

    pub fn set_project(&self, project: &str) {
        match &mut *self.0.write().unwrap() {
            Some(ipc) => ipc
                .set_activity(
                    Activity::new().state(&format!("Working on {}", project)).timestamps(
                        Timestamps::new().start(
                            SystemTime::now()
                                .duration_since(UNIX_EPOCH)
                                .unwrap()
                                .as_secs() as i64,
                        ),
                    ),
                )
                .unwrap(),
            None => (),
        }
    }
}

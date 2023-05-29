use discord_rich_presence::activity::{Activity, Timestamps};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use std::ops::DerefMut;
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
        match self.0.write().unwrap().deref_mut() {
            Some(ipc) => match ipc.set_activity(Activity::new().state("Idling")) {
                Ok(_) => return,
                Err(_) => (),
            },
            None => return,
        }

        *self.0.write().unwrap() = None;
    }

    pub fn set_project(&self, project: &String) {
        match self.0.write().unwrap().deref_mut() {
            Some(ipc) => {
                let status = format!("Working on {project}");
                let activity = Activity::new().state(&status).timestamps(
                    Timestamps::new().start(
                        SystemTime::now()
                            .duration_since(UNIX_EPOCH)
                            .unwrap()
                            .as_secs() as i64,
                    ),
                );

                match ipc.set_activity(activity) {
                    Ok(_) => return,
                    Err(_) => (),
                };
            }
            None => return,
        }

        *self.0.write().unwrap() = None;
    }
}

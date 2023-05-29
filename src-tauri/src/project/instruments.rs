use crate::project::ActiveProject;
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::State;

#[derive(Debug, Deserialize, Serialize)]
pub struct Dimensions {
    width: u32,
    height: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InstrumentConfig {
    pub index: String,
    #[serde(rename = "isInteractive")]
    pub is_interactive: bool,
    pub name: String,
    pub dimensions: Dimensions,
}

#[tauri::command]
pub fn load_instruments(
    active_project: State<ActiveProject>,
) -> Result<Vec<InstrumentConfig>, String> {
    let project = active_project
        .0
        .read()
        .unwrap()
        .clone()
        .ok_or("No project currently loaded")?;

    let instruments: Vec<InstrumentConfig> =
        fs::read_dir(project.path.join(project.config.paths.instruments))
            .unwrap()
            .filter_map(|dir| {
                let config_path = dir.as_ref().unwrap().path().join("config.json");

                if fs::metadata(&config_path).is_err() {
                    return None;
                }

                let data = fs::read_to_string(&config_path).unwrap();
                match serde_json::from_str(data.as_str()) {
                    Ok(config) => Some(config),
                    Err(_) => None,
                }
            })
            .collect();

    Ok(instruments)
}

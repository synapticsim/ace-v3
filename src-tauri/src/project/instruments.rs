use crate::CurrentProject;
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
pub fn load_instruments(current_project: State<CurrentProject>) -> Result<Vec<String>, String> {
    let (project_root, project) = current_project
        .0
        .read()
        .unwrap()
        .clone()
        .ok_or("No project currently loaded")?;

    let instruments: Vec<String> = fs::read_dir(project_root.join(project.paths.instruments))
        .unwrap()
        .filter_map(|dir| {
            let config_path = dir.as_ref().unwrap().path().join("config.json");

            if fs::metadata(&config_path).is_err() {
                return None;
            }

            let data = fs::read_to_string(&config_path).unwrap();
            match serde_json::from_str::<InstrumentConfig>(data.as_str()) {
                Ok(config) => Some(config.name),
                Err(_) => None,
            }
        })
        .collect();

    Ok(instruments)
}

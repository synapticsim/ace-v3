use crate::discord::DiscordClient;
use crate::project::{AceConfig, AceProject, ActiveProject};
use crate::watcher::FileWatcher;
use std::fs;
use std::ops::DerefMut;
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub fn create_project(
    project: AceProject,
    active_project: State<ActiveProject>,
    discord: State<DiscordClient>,
) -> Result<AceProject, String> {
    if project.path.join(".ace/project.json").exists() {
        return Err("Project already exists in selected directory.".into());
    }
    project.write().map_err(|e| e.to_string())?;

    // Add project to global state
    *active_project.0.write().unwrap() = Some(project.clone());
    // Update Discord rich presence
    discord.inner().set_project(&project.config.name);

    Ok(project)
}

#[tauri::command]
pub fn update_project(
    new_config: AceConfig,
    active_project: State<ActiveProject>,
) -> Result<(), String> {
    match active_project.0.write().unwrap().deref_mut() {
        Some(project) => {
            project.config = new_config;
            project.write().map_err(|e| e.to_string())?;

            Ok(())
        }
        None => Err("No project currently loaded".into()),
    }
}

#[tauri::command]
pub fn load_project(
    path: PathBuf,
    active_project: State<ActiveProject>,
    discord: State<DiscordClient>,
) -> Result<AceProject, String> {
    let config_file = path.clone().join(".ace/project.json");
    if !config_file.exists() {
        return Err("Project not initialized in selected directory.".into());
    }

    // Read configuration from .ace/project.json
    let data = fs::read_to_string(config_file).map_err(|e| e.to_string())?;
    let config = serde_json::from_str(data.as_str()).map_err(|e| e.to_string())?;

    let project = AceProject::new(path, config);

    // Add project to global state
    *active_project.0.write().unwrap() = Some(project.clone());
    // Update Discord rich presence
    discord.inner().set_project(&project.config.name);

    Ok(project)
}

#[tauri::command]
pub fn unload_project(
    active_project: State<ActiveProject>,
    discord: State<DiscordClient>,
    watchers: State<FileWatcher>,
) -> Result<(), String> {
    // Clear project from global state
    *active_project.0.write().unwrap() = None;
    // Release all file watchers
    watchers.inner().0.write().unwrap().clear();
    // Update Discord rich presence
    discord.inner().set_idle();

    Ok(())
}

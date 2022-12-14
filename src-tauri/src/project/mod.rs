use crate::{DiscordClient, FileWatcher};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::RwLock;
use std::{fs, io};
use std::ops::DerefMut;
use tauri::State;
use uuid::Uuid;

pub mod instruments;
pub mod simvars;

#[derive(Debug, Default)]
pub struct CurrentProject(pub RwLock<Option<Project>>);

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ProjectPaths {
    pub instruments: PathBuf,
    pub bundles: PathBuf,
    pub html_ui: PathBuf,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum ElementType {
    Instrument,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Element {
    #[serde(default = "Uuid::new_v4")]
    pub uuid: Uuid,
    pub name: String,
    pub element: ElementType,
    pub width: u32,
    pub height: u32,
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ProjectConfig {
    pub name: String,
    pub paths: ProjectPaths,
    #[serde(default = "Vec::new")]
    pub elements: Vec<Element>,
}

#[derive(Debug, Clone)]
pub struct Project {
    pub path: PathBuf,
    pub config: ProjectConfig,
}

impl Project {
    fn new(path: &PathBuf, config: &mut ProjectConfig) -> Self {
        // Convert absolute paths to relative
        if config.paths.instruments.starts_with(&path) {
            config.paths.instruments = config
                .paths
                .instruments
                .strip_prefix(&path)
                .unwrap()
                .to_path_buf();
        }
        if config.paths.bundles.starts_with(&path) {
            config.paths.bundles = config
                .paths
                .bundles
                .strip_prefix(&path)
                .unwrap()
                .to_path_buf();
        }
        if config.paths.html_ui.starts_with(&path) {
            config.paths.html_ui = config
                .paths
                .html_ui
                .strip_prefix(&path)
                .unwrap()
                .to_path_buf();
        }

        Project {
            path: path.clone(),
            config: config.clone(),
        }
    }

    fn write(&self) -> io::Result<()> {
        let config_file = self.path.join(".ace/project.json");
        fs::create_dir_all(config_file.parent().unwrap())?;

        let data = serde_json::to_string_pretty(&self.config).unwrap();
        fs::write(config_file, data)?;

        Ok(())
    }
}

#[tauri::command]
pub fn create_project(
    path: PathBuf,
    mut config: ProjectConfig,
    current_project: State<CurrentProject>,
    discord: State<DiscordClient>,
) -> Result<ProjectConfig, String> {
    if path.join(".ace/project.json").exists() {
        return Err("Project already exists in selected directory.".into());
    }

    let project = Project::new(&path, &mut config);
    project.write().map_err(|e| e.to_string())?;

    // Add project to global state
    *current_project.0.write().unwrap() = Some(project);
    // Update Discord rich presence
    discord.inner().set_project(&config.name);

    Ok(config)
}

#[tauri::command]
pub fn update_project(
    mut new_config: ProjectConfig,
    current_project: State<CurrentProject>,
) -> Result<(), String> {
    match current_project.inner().0.write().unwrap().deref_mut() {
        Some(project) => {
            let new_project = Project::new(&project.path, &mut new_config);
            new_project.write().map_err(|e| e.to_string())?;

            *project = new_project;

            Ok(())
        },
        None => Err("No project currently loaded".into()),
    }
}

#[tauri::command]
pub fn load_project(
    path: PathBuf,
    current_project: State<CurrentProject>,
    discord: State<DiscordClient>,
) -> Result<ProjectConfig, String> {
    let config_file = path.clone().join(".ace/project.json");
    if !config_file.exists() {
        return Err("Project not initialized in selected directory.".into());
    }

    // Read configuration from .ace/project.json
    let data = fs::read_to_string(config_file).map_err(|e| e.to_string())?;
    let mut config = serde_json::from_str(data.as_str()).map_err(|e| e.to_string())?;

    let project = Project::new(&path, &mut config);

    // Add project to global state
    *current_project.0.write().unwrap() = Some(project);
    // Update Discord rich presence
    discord.inner().set_project(&config.name);

    Ok(config)
}

#[tauri::command]
pub fn unload_project(
    current_project: State<CurrentProject>,
    discord: State<DiscordClient>,
    watchers: State<FileWatcher>,
) -> Result<(), String> {
    // Clear project from global state
    *current_project.0.write().unwrap() = None;
    // Release all file watchers
    watchers.inner().0.write().unwrap().clear();
    // Update Discord rich presence
    discord.inner().set_idle();

    Ok(())
}

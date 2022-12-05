use crate::DiscordClient;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::RwLock;
use tauri::State;
use uuid::Uuid;

pub mod instruments;
pub mod simvars;

#[derive(Debug, Default)]
pub struct CurrentProject(pub RwLock<Option<(PathBuf, Project)>>);

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
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Project {
    pub name: String,
    pub paths: ProjectPaths,
    #[serde(default = "Vec::new")]
    pub elements: Vec<Element>,
}

#[tauri::command]
pub fn create_project(
    path: PathBuf,
    mut project: Project,
    current_project: State<CurrentProject>,
    discord: State<DiscordClient>,
) -> Result<Project, String> {
    let config_file = path.clone().join(".ace/project.json");
    if config_file.exists() {
        return Err("Project already exists in selected directory.".into());
    }

    // Convert absolute paths to relative
    project.paths.instruments = project
        .paths
        .instruments
        .strip_prefix(&path)
        .unwrap()
        .to_path_buf();
    project.paths.bundles = project
        .paths
        .bundles
        .strip_prefix(&path)
        .unwrap()
        .to_path_buf();
    project.paths.html_ui = project
        .paths
        .html_ui
        .strip_prefix(&path)
        .unwrap()
        .to_path_buf();

    let data = serde_json::to_string_pretty(&project).map_err(|e| e.to_string())?;
    fs::create_dir_all(config_file.parent().unwrap()).map_err(|e| e.to_string())?;
    fs::write(config_file, data).map_err(|e| e.to_string())?;

    *current_project.0.write().unwrap() = Some((path, project.clone()));

    discord.inner().set_project(&project.name);

    Ok(project)
}

#[tauri::command]
pub fn load_project(
    path: PathBuf,
    current_project: State<CurrentProject>,
    discord: State<DiscordClient>,
) -> Result<Project, String> {
    let config_file = path.clone().join(".ace/project.json");
    if !config_file.exists() {
        return Err("Project not initialized in selected directory.".into());
    }

    let data = fs::read_to_string(config_file).map_err(|e| e.to_string())?;
    let project: Project = serde_json::from_str(data.as_str()).map_err(|e| e.to_string())?;

    *current_project.0.write().unwrap() = Some((path, project.clone()));

    discord.inner().set_project(&project.name);

    Ok(project)
}

#[tauri::command]
pub fn unload_project(
    current_project: State<CurrentProject>,
    discord: State<DiscordClient>,
) -> Result<(), String> {
    *current_project.0.write().unwrap() = None;

    discord.inner().set_idle();

    Ok(())
}

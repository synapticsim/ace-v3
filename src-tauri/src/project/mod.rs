use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::RwLock;
use std::{fs, io};
use uuid::Uuid;

pub mod commands;
pub mod instruments;

#[derive(Debug, Default)]
pub struct ActiveProject(pub RwLock<Option<AceProject>>);

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct AcePaths {
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
pub struct AceConfig {
    pub name: String,
    pub paths: AcePaths,
    #[serde(default = "Vec::new")]
    pub elements: Vec<Element>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AceProject {
    pub path: PathBuf,
    pub config: AceConfig,
}

impl AceProject {
    fn new(path: PathBuf, config: AceConfig) -> Self {
        let mut sanitized_config = config.clone();

        let instruments = match config.paths.instruments.strip_prefix(&path) {
            Ok(path) => path.to_path_buf(),
            Err(_) => config.paths.instruments,
        };
        let bundles = match config.paths.bundles.strip_prefix(&path) {
            Ok(path) => path.to_path_buf(),
            Err(_) => config.paths.bundles,
        };
        let html_ui = match config.paths.html_ui.strip_prefix(&path) {
            Ok(path) => path.to_path_buf(),
            Err(_) => config.paths.html_ui,
        };

        sanitized_config.paths = AcePaths {
            instruments,
            bundles,
            html_ui,
        };

        AceProject {
            path,
            config: sanitized_config,
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

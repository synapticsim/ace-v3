use crate::{CurrentProject, ResourceRouter};
use std::error::Error;
use std::fs;
use tauri::http::{Request, Response, ResponseBuilder};
use tauri::{AppHandle, Manager, Wry};

#[derive(Debug)]
pub enum ResourceType {
    Bundle,
    External,
}

pub fn handle_ace_request(app: &AppHandle<Wry>, req: &Request) -> Result<Response, Box<dyn Error>> {
    let resource_router = app.state::<ResourceRouter>().inner();
    let current_project = app.state::<CurrentProject>().inner();

    let router = resource_router.0.read().unwrap();

    let (project_root, project) = current_project
        .0
        .read()
        .unwrap()
        .clone()
        .ok_or("No project currently loaded")?;

    let path = req.uri().replace("ace://localhost", "");
    let response = match router.at(path.as_str()) {
        Ok(matched) => {
            let file_path = match matched.value {
                ResourceType::Bundle => {
                    project_root
                        .join(project.paths.bundles.as_path())
                        .join(matched.params.get("bundle").unwrap())
                },
                ResourceType::External => project_root
                    .join(project.paths.html_ui.as_path())
                    .join(matched.params.get("path").unwrap()),
            };
            match fs::read(file_path) {
                Ok(data) => ResponseBuilder::new()
                    .status(200)
                    .header("Access-Control-Allow-Origin", "*")
                    .body(data)
                    .unwrap(),
                Err(_) => ResponseBuilder::new()
                    .status(404)
                    .body("Unknown path".as_bytes().to_vec())
                    .unwrap(),
            }
        }
        Err(_) => ResponseBuilder::new()
            .status(404)
            .body("Unknown path".as_bytes().to_vec())
            .unwrap()
    };

    Ok(response)
}

use crate::CurrentProject;
use notify::{RecommendedWatcher, RecursiveMode};
use notify_debouncer_mini::{new_debouncer, Debouncer};
use std::collections::HashMap;
use std::sync::mpsc::channel;
use std::sync::RwLock;
use std::thread;
use std::time::Duration;
use tauri::{State, Window, Wry};

#[derive(Default)]
pub struct FileWatcher(pub RwLock<HashMap<String, Debouncer<RecommendedWatcher>>>);

#[tauri::command]
pub fn watch(
    instrument: String,
    window: Window<Wry>,
    current_project: State<CurrentProject>,
    watchers: State<FileWatcher>,
) -> Result<(), String> {
    let (project_root, project) = current_project
        .inner()
        .0
        .read()
        .unwrap()
        .clone()
        .ok_or("No project currently loaded")?;

    let path = project_root.join(project.paths.bundles).join(&instrument);
    if !path.exists() {
        return Err(format!(
            "Instrument directory \"{}\" could not be found.",
            path.to_str().unwrap()
        )
        .into());
    }

    let (tx, rx) = channel();

    let mut debouncer = new_debouncer(Duration::from_millis(500), None, tx).unwrap();
    debouncer
        .watcher()
        .watch(path.as_path(), RecursiveMode::Recursive)
        .unwrap();

    watchers
        .inner()
        .0
        .write()
        .unwrap()
        .insert(instrument.clone(), debouncer);

    thread::spawn(move || {
        while let Ok(event) = rx.recv() {
            println!("{event:?}");
            window.emit("reload", instrument.as_str()).unwrap();
        }
    });

    Ok(())
}

#[tauri::command]
pub fn unwatch(instrument: String, watchers: State<FileWatcher>) -> Result<(), String> {
    let mut watchers = watchers.inner().0.write().unwrap();

    match watchers.remove_entry(instrument.as_str()) {
        Some(_) => Ok(()),
        None => Err(format!(
            "Instrument \"{instrument}\" is not currently being watched."
        )),
    }
}

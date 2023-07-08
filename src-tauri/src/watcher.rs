use crate::project::ActiveProject;
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
    active_project: State<ActiveProject>,
    watchers: State<FileWatcher>,
) -> Result<(), String> {
    let project = active_project
        .0
        .read()
        .unwrap()
        .clone()
        .ok_or("No project currently loaded")?;

    let instrument_path = project
        .path
        .join(project.config.paths.bundles)
        .join(&instrument);

    if !instrument_path.exists() {
        return Err(format!(
            "Path \"{}\" could not be found.",
            instrument_path.to_str().unwrap()
        )
        .into());
    }

    let (tx, rx) = channel();

    let mut debouncer = new_debouncer(Duration::from_millis(500), None, tx).unwrap();
    debouncer
        .watcher()
        .watch(instrument_path.as_path(), RecursiveMode::Recursive)
        .unwrap();

    watchers
        .inner()
        .0
        .write()
        .unwrap()
        .insert(instrument.clone(), debouncer);

    thread::spawn(move || {
        while let Ok(_event) = rx.recv() {
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

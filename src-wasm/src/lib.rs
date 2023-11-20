#![allow(non_snake_case)]

use std::sync::RwLock;
use crate::simvars::SimVarStore;
use wasm_bindgen::prelude::*;

extern crate console_error_panic_hook;

mod macros;
mod shims;
mod simvars;

#[wasm_bindgen]
pub struct SimulatorShim {
    simvars: RwLock<SimVarStore>,
}

#[wasm_bindgen]
impl SimulatorShim {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            simvars: RwLock::from(SimVarStore::new()),
        }
    }
}

#[wasm_bindgen(start)]
fn start() {
    console_error_panic_hook::set_once();
    wasm_logger::init(wasm_logger::Config::default());
}

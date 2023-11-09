mod macros;
mod shims;
mod simvars;

use crate::simvars::SimVarStore;
use wasm_bindgen::prelude::*;

extern crate console_error_panic_hook;

#[wasm_bindgen]
pub struct SimulatorShim {
    simvars: SimVarStore,
}

#[wasm_bindgen]
impl SimulatorShim {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();

        Self {
            simvars: SimVarStore::new(),
        }
    }
}

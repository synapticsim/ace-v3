use crate::simvars::values::SimVarValue;
use crate::SimulatorShim;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl SimulatorShim {
    pub fn simvar__register_simvar_watcher(
        &mut self,
        name: &str,
        unit_name: &str,
        _data_source: &str,
    ) -> usize {
        let mut simvar_guard = self.simvars.write().unwrap();

        let unit_id = simvar_guard.register_unit(unit_name);
        let unit = simvar_guard.get_unit(&unit_id).unwrap();

        simvar_guard.register_coherent_var(name, &unit)
    }

    pub fn simvar__get_value_reg(&self, id: usize) -> f64 {
        let value = self
            .simvars
            .read()
            .unwrap()
            .get_coherent_var(&id)
            .expect("Attempted to read un-registered variable");

        match value {
            SimVarValue::Number(value) => value,
            SimVarValue::String(_) => panic!("Attempted to read string value as number"),
        }
    }

    pub fn simvar__get_value_reg_string(&self, id: usize) -> String {
        let value = self
            .simvars
            .read()
            .unwrap()
            .get_coherent_var(&id)
            .expect("Attempted to read un-registered variable");

        match value {
            SimVarValue::String(value) => value,
            SimVarValue::Number(_) => panic!("Attempted to read numeric value as string"),
        }
    }

    pub fn print(&self) {
        log::debug!("{:#?}", self.simvars.read().unwrap());
    }
}

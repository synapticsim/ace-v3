use crate::SimulatorShim;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl SimulatorShim {
    pub fn aircraft_varget(&self, id: usize, unit_id: usize, index: i32) -> f64 {
        let unit = self
            .simvars
            .get_unit(unit_id)
            .expect("Attempted to read un-registered unit");

        self.simvars
            .get_quantity_with_unit(id, unit)
            .expect("Attempted to read un-registered variable")
    }

    pub fn get_aircraft_var_enum(&mut self, name: &str) -> usize {
        self.simvars.register_variable(name)
    }

    pub fn get_named_variable_value(&self, id: usize) -> f64 {
        self.simvars
            .get_quantity(id)
            .expect("Attempted to read un-registered variable")
    }

    pub fn get_units_enum(&mut self, name: &str) -> usize {
        self.simvars.register_unit(name)
    }

    pub fn register_named_variable(&mut self, name: &str) -> usize {
        self.simvars.register_variable(name)
    }

    pub fn set_named_variable_value(&mut self, id: usize, value: f64) {
        self.simvars
            .set_quantity(id, value)
            .expect("Attempted to write un-registered variable");
    }

    pub fn set_named_variable_typed_value(&mut self, id: usize, value: f64, unit_id: usize) {
        let unit = self
            .simvars
            .get_unit(unit_id)
            .expect("Attempted to write un-registered unit")
            .to_owned();

        self.simvars
            .set_quantity_with_unit(id, &unit, value)
            .expect("Attempted to write un-registered variable");
    }
}

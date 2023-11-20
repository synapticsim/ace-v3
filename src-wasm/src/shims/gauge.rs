use crate::simvars::types::SimVarType;
use crate::simvars::units::SimVarUnit;
use crate::simvars::values::SimVarValue;
use crate::SimulatorShim;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl SimulatorShim {
    pub fn gauge__aircraft_varget(&self, var_id: usize, unit_id: usize, index: usize) -> f64 {
        log::debug!("gauge__aircraft_varget :: var_id={var_id}, unit_id={unit_id}, index={index}");

        let simvar_guard = self.simvars.read().unwrap();

        let unit = simvar_guard
            .get_unit(&unit_id)
            .expect("Attempted to read un-registered unit");

        let value = simvar_guard
            .get_wasm_var(&var_id, &unit, Some(&index))
            .expect("Attempted to read un-registered variable");

        match value {
            SimVarValue::Number(value) => value,
            SimVarValue::String(_) => panic!("Attempted to read string value as number"),
        }
    }

    pub fn gauge__get_aircraft_var_enum(&mut self, name: &str) -> usize {
        log::debug!("gauge__get_aircraft_var_enum :: name={name}");

        self.simvars
            .write()
            .unwrap()
            .register_wasm_var(SimVarType::A, name)
    }

    pub fn gauge__get_named_variable_value(&self, id: usize) -> f64 {
        log::debug!("gauge__get_named_variable_value :: id={id}");

        let value = self
            .simvars
            .read()
            .unwrap()
            .get_wasm_var(&id, &SimVarUnit::Number, None)
            .expect("Attempted to read un-registered variable");

        match value {
            SimVarValue::Number(value) => value,
            SimVarValue::String(_) => panic!("Attempted to read string value as number"),
        }
    }

    pub fn gauge__get_units_enum(&mut self, name: &str) -> usize {
        log::debug!("gauge__get_units_enum :: name={name}");

        self.simvars.write().unwrap().register_unit(name)
    }

    pub fn gauge__register_named_variable(&mut self, name: &str) -> usize {
        log::debug!("gauge__register_named_variable :: name={name}");

        self.simvars
            .write()
            .unwrap()
            .register_wasm_var(SimVarType::L, name)
    }

    pub fn gauge__set_named_variable_value(&mut self, id: usize, value: f64) {
        log::debug!("gauge__register_named_variable :: id={id}, value={value}");

        self.simvars
            .write()
            .unwrap()
            .set_wasm_var(&id, &SimVarUnit::Number, None, SimVarValue::Number(value))
            .expect("Attempted to write un-registered variable");
    }

    pub fn gauge__set_named_variable_typed_value(&mut self, id: usize, value: f64, unit_id: usize) {
        log::debug!(
            "gauge__set_named_variable_typed_value :: id={id}, value={value}, unit_id={unit_id}"
        );

        let mut simvar_guard = self.simvars.write().unwrap();

        let unit = simvar_guard
            .get_unit(&unit_id)
            .expect("Attempted to write un-registered unit");

        simvar_guard
            .set_wasm_var(&id, &unit, None, SimVarValue::Number(value))
            .expect("Attempted to write un-registered variable");
    }
}

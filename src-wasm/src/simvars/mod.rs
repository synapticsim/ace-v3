use crate::simvars::units::SimVarUnit;
use bimap::BiMap;
use std::collections::HashMap;

pub mod units;

pub struct SimVarStore {
    unit_id: BiMap<SimVarUnit, usize>,
    variable_id: BiMap<String, usize>,
    variable_quantity: HashMap<usize, f64>,
}

impl SimVarStore {
    pub fn new() -> Self {
        Self {
            unit_id: BiMap::default(),
            variable_id: BiMap::default(),
            variable_quantity: HashMap::default(),
        }
    }

    pub fn register_unit(&mut self, name: &str) -> usize {
        let unit = SimVarUnit::from(name.to_lowercase().as_str());

        if let Some(id) = self.unit_id.get_by_left(&unit) {
            return *id;
        }

        let id = self.unit_id.len() + 1;
        self.unit_id.insert(unit, id);

        id
    }

    pub fn register_variable(&mut self, name: &str) -> usize {
        if let Some(id) = self.variable_id.get_by_left(name) {
            return *id;
        }

        let id = self.variable_id.len() + 1;

        self.variable_id.insert(name.to_owned(), id);
        self.variable_quantity.insert(id, 0.0);

        id
    }

    pub fn get_unit(&self, id: usize) -> Option<&SimVarUnit> {
        self.unit_id.get_by_right(&id)
    }

    pub fn get_quantity(&self, variable_id: usize) -> Option<f64> {
        self.variable_quantity.get(&variable_id).map(|v| *v)
    }

    pub fn get_quantity_with_unit(&self, variable_id: usize, unit: &SimVarUnit) -> Option<f64> {
        self.variable_quantity
            .get(&variable_id)
            .map(|v| unit.from_base(*v))
    }

    pub fn set_quantity(&mut self, variable_id: usize, value: f64) -> Option<f64> {
        self.variable_quantity.get_mut(&variable_id).map(|v| {
            *v = value;
            value
        })
    }

    pub fn set_quantity_with_unit(
        &mut self,
        variable_id: usize,
        unit: &SimVarUnit,
        value: f64,
    ) -> Option<f64> {
        self.variable_quantity.get_mut(&variable_id).map(|v| {
            let converted_value = unit.to_base(value);
            *v = unit.to_base(converted_value);
            converted_value
        })
    }
}

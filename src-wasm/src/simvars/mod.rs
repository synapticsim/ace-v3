use crate::simvars::types::SimVarType;
use crate::simvars::units::SimVarUnit;
use crate::simvars::values::SimVarValue;
use bimap::BiMap;
use once_cell::sync::Lazy;
use regex::Regex;
use std::collections::HashMap;

pub mod types;
pub mod units;
pub mod values;

pub type UnitId = usize;
pub type VarId = usize;
pub type VarIndex = usize;

fn normalize_name(input: &str) -> (SimVarType, String, VarIndex) {
    static RE: Lazy<Regex> = Lazy::new(|| {
        Regex::new(r"^(?:(?<type>[AEL]):)?(?<name>[^:]+)(?::(?<index>\d))?$").unwrap()
    });

    let caps = RE.captures(input).expect("Invalid variable name: {input}");

    let var_type = caps
        .name("type")
        .map_or(SimVarType::A, |m| SimVarType::from(m.as_str()));
    let var_name = caps
        .name("name")
        .map(|m| m.as_str().to_uppercase())
        .unwrap();
    let var_index = caps
        .name("index")
        .map_or(0, |m| m.as_str().parse::<usize>().unwrap());

    (var_type, var_name, var_index)
}

#[derive(Debug)]
pub struct SimVarStore {
    unit_ids: BiMap<SimVarUnit, UnitId>,

    coherent_var_ids: BiMap<VarId, (SimVarType, String, VarIndex, SimVarUnit)>,
    wasm_var_ids: BiMap<VarId, (SimVarType, String, VarIndex)>,

    var_values: HashMap<String, SimVarValue>,
}

impl SimVarStore {
    pub fn new() -> Self {
        Self {
            unit_ids: BiMap::new(),
            coherent_var_ids: BiMap::new(),
            wasm_var_ids: BiMap::new(),
            var_values: HashMap::new(),
        }
    }

    pub fn register_unit(&mut self, name: &str) -> UnitId {
        let unit = SimVarUnit::from(name.to_lowercase().as_str());

        if let Some(id) = self.unit_ids.get_by_left(&unit) {
            return *id;
        }

        let id = self.unit_ids.len() + 1;
        self.unit_ids.insert(unit, id);
        id
    }

    pub fn get_unit(&self, unit_id: &UnitId) -> Option<SimVarUnit> {
        self.unit_ids.get_by_right(unit_id).map(|v| v.to_owned())
    }

    pub fn register_coherent_var(&mut self, name: &str, unit: &SimVarUnit) -> VarId {
        let (var_type, var_name, var_index) = normalize_name(name);
        let key = (var_type, var_name, var_index, unit.to_owned());

        if let Some(&id) = self.coherent_var_ids.get_by_right(&key) {
            return id;
        }

        let id = self.coherent_var_ids.len() + 1;
        self.coherent_var_ids.insert(id, key);
        id
    }

    pub fn get_coherent_var(&self, id: &VarId) -> Option<SimVarValue> {
        let (var_type, var_name, var_index, unit) = self.coherent_var_ids.get_by_left(id)?;
        let key = format!("{var_type}:{var_name}:{var_index}");

        Some(
            self.var_values
                .get(&key)
                .map_or(SimVarValue::default_from_unit(unit), |v| {
                    v.get_with_unit(unit)
                }),
        )
    }

    pub fn set_coherent_var(&mut self, id: &VarId, new_value: SimVarValue) -> Result<(), ()> {
        let (var_type, var_name, var_index, unit) =
            self.coherent_var_ids.get_by_left(id).ok_or(())?;
        let key = format!("{var_type}:{var_name}:{var_index}");

        self.var_values
            .entry(key)
            .or_insert(SimVarValue::default_from_unit(unit))
            .set_with_unit(unit, new_value.clone());

        Ok(())
    }

    pub fn register_wasm_var(&mut self, var_type: SimVarType, name: &str) -> VarId {
        let (_, var_name, var_index) = normalize_name(name);
        let key = (var_type, var_name, var_index);

        if let Some(&id) = self.wasm_var_ids.get_by_right(&key) {
            return id;
        }

        let id = self.wasm_var_ids.len() + 1;
        self.wasm_var_ids.insert(id, key);
        id
    }

    pub fn get_wasm_var(
        &self,
        id: &VarId,
        unit: &SimVarUnit,
        index: Option<&VarIndex>,
    ) -> Option<SimVarValue> {
        let (var_type, var_name, var_index) = self.wasm_var_ids.get_by_left(id)?;
        let key = format!("{var_type}:{var_name}:{}", index.unwrap_or(var_index));

        Some(
            self.var_values
                .get(&key)
                .map_or(SimVarValue::default_from_unit(unit), |v| {
                    v.get_with_unit(unit)
                }),
        )
    }

    pub fn set_wasm_var(
        &mut self,
        id: &VarId,
        unit: &SimVarUnit,
        index: Option<&VarIndex>,
        new_value: SimVarValue,
    ) -> Result<(), ()> {
        let (var_type, var_name, var_index) = self.wasm_var_ids.get_by_left(id).ok_or(())?;
        let key = format!("{var_type}:{var_name}:{}", index.unwrap_or(var_index));

        self.var_values
            .entry(key)
            .or_insert(SimVarValue::default_from_unit(unit))
            .set_with_unit(unit, new_value.clone());

        Ok(())
    }
}

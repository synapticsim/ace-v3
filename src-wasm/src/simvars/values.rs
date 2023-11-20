use crate::simvars::units::SimVarUnit;
use wasm_bindgen::JsValue;

#[derive(Debug, Clone, PartialEq)]
pub enum SimVarValue {
    Number(f64),
    String(String),
}

impl SimVarValue {
    pub fn default_from_unit(unit: &SimVarUnit) -> Self {
        match unit {
            SimVarUnit::String => Self::String("".to_owned()),
            _ => Self::Number(0.0),
        }
    }

    pub fn get_with_unit(&self, unit: &SimVarUnit) -> Self {
        match (self, unit) {
            (Self::String(value), SimVarUnit::String) => Self::String(value.to_owned()),
            (Self::String(_), _) => panic!("Attempted to read string value as number"),
            (Self::Number(_), SimVarUnit::String) => {
                panic!("Attempted to read numeric value as string")
            }
            (Self::Number(value), _) => Self::Number(unit.from_base(*value)),
        }
    }

    pub fn set_with_unit(&mut self, unit: &SimVarUnit, new_value: Self) {
        match (self, new_value) {
            (Self::String(value), Self::String(new_value)) => *value = new_value,
            (Self::Number(value), Self::Number(new_value)) => *value = unit.to_base(new_value),
            (Self::String(_), Self::Number(_)) => {
                panic!("Attempted to write numeric value to string variable")
            }
            (Self::Number(_), Self::String(_)) => {
                panic!("Attempted to write string value to numeric variable")
            }
        }
    }
}

impl Into<JsValue> for SimVarValue {
    fn into(self) -> JsValue {
        match self {
            Self::Number(value) => JsValue::from_f64(value),
            Self::String(value) => JsValue::from_str(&value),
        }
    }
}

impl Into<SimVarValue> for f64 {
    fn into(self) -> SimVarValue {
        SimVarValue::Number(self)
    }
}

impl Into<SimVarValue> for String {
    fn into(self) -> SimVarValue {
        SimVarValue::String(self)
    }
}

#[cfg(test)]
mod tests {
    use crate::simvars::units::SimVarUnit;
    use crate::simvars::values::SimVarValue;

    #[test]
    fn convert_length() {
        let m = SimVarUnit::from("meter");
        let km = SimVarUnit::from("kilometer");

        let mut value = SimVarValue::default_from_unit(&m);
        value.set_with_unit(&km, SimVarValue::Number(1.0));

        assert_eq!(value.get_with_unit(&m), SimVarValue::Number(1000.0));
        assert_eq!(value.get_with_unit(&km), SimVarValue::Number(1.0));
    }
}

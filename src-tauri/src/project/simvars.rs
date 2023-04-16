use crate::CurrentProject;
use serde::de::Visitor;
use serde::{de, Deserialize, Deserializer, Serialize, Serializer};
use std::{fmt, fs};
use tauri::State;

#[derive(Deserialize, Serialize)]
enum SimVarType {
    A,
    E,
    L,
}

enum SimVarValue {
    String(String),
    Number(f64),
}

impl<'de> Deserialize<'de> for SimVarValue {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        struct ValueVisitor;

        impl<'de> Visitor<'de> for ValueVisitor {
            type Value = SimVarValue;

            fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.write_str("value as a number or string")
            }

            fn visit_i64<E>(self, num: i64) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                Ok(SimVarValue::Number(num as f64))
            }

            fn visit_u64<E>(self, num: u64) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                Ok(SimVarValue::Number(num as f64))
            }

            fn visit_f32<E>(self, num: f32) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                Ok(SimVarValue::Number(num as f64))
            }

            fn visit_f64<E>(self, num: f64) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                Ok(SimVarValue::Number(num))
            }

            fn visit_str<E>(self, str: &str) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                Ok(SimVarValue::String(str.to_string()))
            }
        }

        deserializer.deserialize_any(ValueVisitor)
    }
}

impl Serialize for SimVarValue {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self {
            SimVarValue::String(str) => serializer.serialize_str(str),
            SimVarValue::Number(num) => serializer.serialize_f64(*num),
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct SimVar {
    #[serde(rename = "type")]
    var_type: SimVarType,
    name: String,
    index: u8,
    unit: String,
    value: SimVarValue,
    #[serde(skip_serializing_if = "Option::is_none")]
    pinned: Option<bool>,
}

pub type SimVarConfig = Vec<SimVar>;

#[tauri::command]
pub fn load_simvars(current_project: State<CurrentProject>) -> Result<SimVarConfig, String> {
    let project = current_project
        .inner()
        .0
        .read()
        .unwrap()
        .clone()
        .ok_or("No project currently loaded")?;

    let simvars: SimVarConfig = match fs::read_to_string(project.path.join(".ace/simvars.json")) {
        Ok(data) => serde_json::from_str(&data).map_err(|e| e.to_string())?,
        Err(_) => SimVarConfig::default(),
    };

    Ok(simvars)
}

#[tauri::command]
pub fn save_simvars(
    simvars: SimVarConfig,
    current_project: State<CurrentProject>,
) -> Result<(), String> {
    let project = current_project
        .inner()
        .0
        .read()
        .unwrap()
        .clone()
        .ok_or("No project currently loaded")?;

    let data = serde_json::to_string_pretty(&simvars).map_err(|e| e.to_string())?;

    match fs::write(project.path.join(".ace/simvars.json"), data) {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

use crate::SimulatorShim;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
impl SimulatorShim {
    #[wasm_bindgen(variadic)]
    pub fn coherent__call(&mut self, name: &str, args: Vec<JsValue>) -> JsValue {
        match name {
            "setValueReg_Number" => {
                let id = args[0].as_f64().unwrap() as usize;
                let value = args[1].as_f64().unwrap();

                self.simvars
                    .write()
                    .unwrap()
                    .set_coherent_var(&id, value.into())
                    .expect("Attempted to write un-registered variable");

                JsValue::UNDEFINED
            }
            "setValueReg_String" => {
                let id = args[0].as_f64().unwrap() as usize;
                let value = args[1].as_string().unwrap();

                self.simvars
                    .write()
                    .unwrap()
                    .set_coherent_var(&id, value.into())
                    .expect("Attempted to write un-registered variable");

                JsValue::UNDEFINED
            }
            _ => {
                log::error!("Unsupported Coherent call: {name}");

                JsValue::UNDEFINED
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::simvars::values::SimVarValue;
    use crate::SimulatorShim;
    use wasm_bindgen::JsValue;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn set_value_reg_number() {
        let mut shims = SimulatorShim::new();

        let var_id = shims.simvar__register_simvar_watcher("L:TEST", "degree", "");

        let id = JsValue::from_f64(var_id as f64);
        let value = JsValue::from_f64(10.0);
        shims.coherent__call("setValueReg_Number", vec![id, value]);

        assert_eq!(
            shims.simvars.get_coherent_var(&var_id),
            Some(SimVarValue::Number(10.0))
        );
    }
}

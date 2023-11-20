#[macro_export]
macro_rules! units {
    {
        $(
            $name:ident as $uom_quantity:ident {
                $($($patterns:pat)* => $uom_unit:ident,)+
            },
        )+
    } => (
        #[derive(Debug, Copy, Clone, Eq, PartialEq, Hash)]
        pub enum SimVarUnit {
            Number,
            String,
            $($name(uom::si::$uom_quantity::Units),)+
        }

        impl From<&str> for SimVarUnit {
            fn from(value: &str) -> Self {
                match value {
                    $($(
                        $($patterns)* => Self::$name(uom::si::$uom_quantity::Units::$uom_unit(uom::si::$uom_quantity::$uom_unit)),
                    )+)+
                    "number" | "numbers" | "enum" | "bool" | "boolean" => Self::Number,
                    "string" => Self::String,
                    _ => panic!("Unsupported unit: {value}"),
                }
            }
        }

        impl SimVarUnit {
            pub fn from_base(&self, value: f64) -> f64 {
                let (coefficient, constant) = match self {
                    $($(
                        Self::$name(uom::si::$uom_quantity::Units::$uom_unit(_)) => (
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::coefficient(),
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::constant(uom::ConstantOp::Sub)
                        ),
                    )+)+
                    Self::Number => return value,
                    Self::String => panic!("from_base is not supported for String types"),
                    _ => unreachable!(),
                };

                value / coefficient - constant
            }

            pub fn to_base(&self, value: f64) -> f64 {
                let (coefficient, constant) = match self {
                    $($(
                        Self::$name(uom::si::$uom_quantity::Units::$uom_unit(_)) => (
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::coefficient(),
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::constant(uom::ConstantOp::Add)
                        ),
                    )+)+
                    Self::Number => return value,
                    Self::String => panic!("to_base is not supported for String types"),
                    _ => unreachable!(),
                };

                value * coefficient + constant
            }
        }
    );
}

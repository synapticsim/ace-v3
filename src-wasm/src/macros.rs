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
            Bool,
            $($name(uom::si::$uom_quantity::Units),)+
        }

        impl From<&str> for SimVarUnit {
            fn from(value: &str) -> Self {
                match value {
                    "number" | "numbers" | "enum" => Self::Number,
                    "bool" | "boolean" => Self::Bool,
                    $($(
                        $($patterns)* => Self::$name(uom::si::$uom_quantity::Units::$uom_unit(uom::si::$uom_quantity::$uom_unit)),
                    )+)+
                    _ => panic!("Unsupported unit: {value}"),
                }
            }
        }

        impl SimVarUnit {
            pub fn from_base(&self, value: f64) -> f64 {
                let (coefficient, constant) = match self {
                    Self::Number | Self::Bool => return value,
                    $($(
                        Self::$name(uom::si::$uom_quantity::Units::$uom_unit(_)) => (
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::coefficient(),
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::constant(uom::ConstantOp::Sub)
                        ),
                    )+)+
                    _ => unreachable!(),
                };

                coefficient / value - constant
            }

            pub fn to_base(&self, value: f64) -> f64 {
                let (coefficient, constant) = match self {
                    Self::Number | Self::Bool => return value,
                    $($(
                        Self::$name(uom::si::$uom_quantity::Units::$uom_unit(_)) => (
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::coefficient(),
                            <uom::si::$uom_quantity::$uom_unit as uom::Conversion<f64>>::constant(uom::ConstantOp::Add)
                        ),
                    )+)+
                    _ => unreachable!(),
                };

                coefficient * value + constant
            }
        }
    );
}

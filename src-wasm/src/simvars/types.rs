use std::fmt::{Display, Formatter};

#[derive(Debug, Eq, PartialEq, Hash)]
pub enum SimVarType {
    A,
    L,
}

impl From<&str> for SimVarType {
    fn from(value: &str) -> Self {
        match value {
            "A" => Self::A,
            "L" => Self::L,
            _ => panic!("Unsupported variable type: {value}"),
        }
    }
}

impl Display for SimVarType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::A => f.write_str("A"),
            Self::L => f.write_str("L"),
        }
    }
}

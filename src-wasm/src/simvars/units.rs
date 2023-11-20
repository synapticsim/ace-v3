use crate::units;

units! {
    Length as length {
        "meter" | "meters" | "m" => meter,
        "millimeter" | "millimeters" => millimeter,
        "centimeter" | "centimeters" | "cm" => centimeter,
        "kilometer" | "kilometers" | "km" => kilometer,
        "nautical mile" | "nautical miles" | "nmile" | "nmiles" => nautical_mile,
        "decinmile" | "decinmiles" => nautical_decimile,
        "inch" | "inches" | "in" => inch,
        "foot" | "feet" | "ft" => foot,
        "yard" | "yards" => yard,
        "decimile" | "decimiles" => decimile,
        "mile" | "miles" => mile,
    },
    Area as area {
        "square inch" | "square inches" | "sq in" | "in2" => square_inch,
        "square foot" | "square feet" | "sq ft" | "ft2" => square_foot,
        "square yard" | "square yards" | "sq yd" | "yd2" => square_yard,
        "square mile" | "square miles" => square_mile,
        "square millimeter" | "square millimeters" | "sq mm" | "mm2" => square_millimeter,
        "square centimeter" | "square centimeters" | "sq cm" | "cm2" => square_centimeter,
        "square meter" | "square meters" | "sq m" | "m2" => square_meter,
        "square kilometer" | "square kilometers" | "sq km" | "km2" => square_kilometer,
    },
    Volume as volume {
        "cubic inch" | "cubic inches" | "cu in" | "in3" => cubic_inch,
        "cubic foot" | "cubic feet" | "cu ft" | "ft3" => cubic_foot,
        "cubic yard" | "cubic yards" | "cu yd" | "yd3" => cubic_yard,
        "cubic mile" | "cubic miles" => cubic_mile,
        "cubic millimeter" | "cubic millimeters" | "cu mm" | "mm3" => cubic_millimeter,
        "cubic centimeter" | "cubic centimeters" | "cu cm" | "cm3" => cubic_centimeter,
        "cubic meter" | "cubic meters" | "meter cubed" | "meters cubed" | "cu m" | "m3" => cubic_meter,
        "cubic kilometer" | "cubic kilometers" | "cu km" | "km3" => cubic_kilometer,
        "liter" | "liters" => liter,
        "gallon" | "gallons" => gallon,
        "quart" | "quarts" => quart_liquid,
    },
    Temperature as thermodynamic_temperature {
        "kelvin" => kelvin,
        "rankine" => degree_rankine,
        "farenheit" | "fahrenheit" => degree_fahrenheit,
        "celsius" => degree_celsius,
    },
    Angle as angle {
        "radian" | "radians" => radian,
        "round" | "rounds" => revolution,
        "degree" | "degrees" => degree,
        "grad" | "grads" => gon,
    },
    // TODO: GlobalPosition
    AngularVelocity as angular_velocity {
        "radian per second" | "radians per second" => radian_per_second,
        "revolution per minute" | "revolutions per minute" | "rpm" | "rpms" => revolution_per_minute,
        "degree per second" | "degrees per second" => degree_per_second,
    },
    AngularAcceleration as angular_acceleration {
        "radian per second squared" | "radians per second squared" => radian_per_second_squared,
        "degree per second squared" | "degrees per second squared" => degree_per_second_squared,
    },
    Velocity as velocity {
        "meter per second" | "meters/second" | "m/s" => meter_per_second,
        "meter per minute" | "meters per minute" => meter_per_minute,
        "kilometer/hour" | "kilometers/hour" | "kilometers per hour" | "kph" => kilometer_per_hour,
        "feet/second" | "feet per second" => foot_per_second,
        "feet/minute" | "ft/min" | "feet per minute" => foot_per_minute,
        "mile per hour" | "miles per hour" | "mph" => mile_per_hour,
        "knot" | "knots" => knot,
        "mach" | "machs" => mach,
    },
    Acceleration as acceleration {
        "meter per second squared" | "meters per second squared" => meter_per_second_squared,
        "feet per second squared" | "foot per second squared" => foot_per_second_squared,
        "gforce" | "g Force" => standard_gravity,
    },
    Time as time {
        "second" | "seconds" => second,
        "minute" | "minutes" => minute,
        "hour" | "hours" => hour,
        "day" | "days" => day,
        "year" | "years" => year,
    },
    Power as power {
        "watt" | "watts" => watt,
        "ft lb per second" => foot_pound_per_second,
    },
    VolumeRate as volume_rate {
        "meter cubed per second" | "meters cubed per second" => cubic_meter_per_second,
        "liter per hour" | "liters per hour" => liter_per_hour,
        "gallon per hour" | "gallons per hour" | "gph" => gallon_per_hour,
    },
    Weight as mass {
        "kilogram" | "kilograms" | "kg" => kilogram,
        "pound" | "pounds" | "lbs" => pound,
        "slug" | "slugs" | "geepound" | "geepounds" => slug,
    },
    WeightRate as mass_rate {
        "kilogram per second" | "kilograms per second" => kilogram_per_second,
        "pound per hour" | "pounds per hour" => pound_per_hour,
    },
    ElectricCurrent as electric_current {
        "ampere" | "amperes" | "amp" | "amps" => ampere,
    },
    ElectricPotential as electric_potential {
        "volt" | "volts" => volt,
    },
    Frequency as frequency {
        "hertz" | "hz" => hertz,
        "kilohertz" | "khz" => kilohertz,
        "megahertz" | "mhz" => megahertz,
        // TODO: Frequency BCD16
        // TODO: Frequency BCD32
        // TODO: Frequency ADF BCD32
    },
    Density as mass_density {
        "kilogram per cubic meter" | "kilograms per cubic meter" => kilogram_per_cubic_meter,
        "slug per cubic feet" | "slugs per cubic feet" | "slug/ft3" | "slug per cubic foot" | "slugs per cubic foot" => slug_per_cubic_foot,
        "pound per gallon" | "pounds per gallon" | "lbs/gallon" => pound_per_gallon,
    },
    Pressure as pressure {
        "pascal" | "pascals" | "pa" | "newton per square meter" | "newtons per square meter" => pascal,
        "kilopascal" | "kpa" => kilopascal,
        "millimeter of mercury" | "millimeters of mercury" | "mmhg" => millimeter_of_mercury,
        "centimeter of mercury" | "centimeters of mercury" | "cmhg" | "boost cmhg" => centimeter_of_mercury,
        "inch of mercury" | "inches of mercury" | "inhg" | "boost inhg" => inch_of_mercury,
        "millimeter of water" | "millimeters of water" => millimeter_of_water,
        "kilogram force per square centimeter" | "kgfsqcm" => kilogram_force_per_square_centimeter,
        "kilogram meter squared" | "kilograms meter squared" => kilogram_force_per_square_meter,
        "atmosphere" | "atmospheres" | "atm" => atmosphere,
        "bar" | "bars" => bar,
        "millibar" | "millibars" | "mbar" | "mbars" | "hectopascal" | "hectopascals" => millibar,
        "pound-force per square inch" | "psi" | "boost psi" => pound_force_per_square_inch,
        "pound-force per square foot" | "psf" => pound_force_per_square_foot,
        "slug feet squared" | "slugs feet squared" => slug_per_square_foot,
    },
    Torque as torque {
        "newton meter" | "newton meters" | "nm" => newton_meter,
        "lbf-feet" => pound_force_foot,
        "kilogram meter" | "kilogram meters" | "kgf meter" | "kgf meters" => kilogram_force_meter,
    },
    Work as energy {
        // This was listed under "Torque" in the documentation for some reason...
        "foot-pound" | "foot pound" | "ft-lbs" | "foot-pounds" => foot_pound,
    },
    Ratio as ratio {
        "percent over 100" => ratio,
    },
}

#[cfg(test)]
mod tests {
    use super::SimVarUnit;

    #[test]
    fn unit_from_str() {
        assert_eq!(
            SimVarUnit::from("meter"),
            SimVarUnit::Length(uom::si::length::Units::meter(uom::si::length::meter)),
        );
        assert_eq!(
            SimVarUnit::from("degrees"),
            SimVarUnit::Angle(uom::si::angle::Units::degree(uom::si::angle::degree)),
        );
        assert_eq!(
            SimVarUnit::from("amp"),
            SimVarUnit::ElectricCurrent(uom::si::electric_current::Units::ampere(
                uom::si::electric_current::ampere
            )),
        );
    }
}

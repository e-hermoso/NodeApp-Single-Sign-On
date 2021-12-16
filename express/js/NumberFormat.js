// Convert azimuth from decimal degrees to bearing degree minutes and seconds based including direction.
function azimuth_DD_to_bearing_QDMS(azimuth_direction_DD) {
    var azimuthDD;
    // If data type is string convert to double
    if (typeof azimuth_direction_DD === 'string' || azimuth_direction_DD instanceof String) {
        azimuthDD = parseFloat(azimuth_direction_DD);
    } else {
        azimuthDD = azimuth_direction_DD
    }

    if (azimuthDD == 0) {
        // When tan(0/number): value is 0
        return "N0° 00.00\' + 00.00\\\"E";
    }
    else if (azimuthDD == 90) {
        // When tan(number/0): value is 90
        return "N90° 00.00\' + 00.00\\\"E";
    }
    else if (azimuthDD == 180) {

        return "S180° 00.00\' + 00.00\\\"E";
    }
    else if (azimuthDD == 270) {

        return "N270° 00.00\' + 00.00\\\"W";
    }
    else if (0 < azimuthDD && azimuthDD < 90) {
        quadrant_section = "NE";
        bearing_DMS = quadFormat_DMS(quadrant_section, azimuthDD);

        return bearing_DMS;
    }
    else if (90 < azimuthDD && azimuthDD < 180) {
        quadrant_section = "SE";
        SE_bearing_DD = 180 - azimuthDD;
        bearing_DMS = quadFormat_DMS(quadrant_section, SE_bearing_DD);
        return bearing_DMS;
    }
    else if (180 < azimuthDD && azimuthDD < 270) {
        quadrant_section = "SW";
        SW_bearing_DD = azimuthDD - 180;
        bearing_DMS = quadFormat_DMS(quadrant_section, SW_bearing_DD);
        return bearing_DMS;
    }
    else {
        quadrant_section = "NW";
        NW_bearing_DD = 360 - azimuthDD;
        bearing_DMS = quadFormat_DMS(quadrant_section, NW_bearing_DD);
        return bearing_DMS;
    }
}

// Convert azimuth from decimal degrees to bearing degree minutes and seconds not including direction.
function azimuth_DD_to_bearing_DMS(azimuth_direction_DD) {
    var azimuthDD;
    // If data type is string convert to double
    if (typeof azimuth_direction_DD === 'string' || azimuth_direction_DD instanceof String) {
        azimuthDD = parseFloat(azimuth_direction_DD);
    } else {
        azimuthDD = azimuth_direction_DD
    }

    if (azimuthDD == 0) {
        // When tan(0/number): value is 0
        return "0° 00.00\' + 00.00\\\"";
    }
    else if (azimuthDD == 90) {
        // When tan(number/0): value is 90
        return "90° 00.00\' + 00.00\\\"";
    }
    else if (azimuthDD == 180) {

        return "180° 00.00\' + 00.00\\\"";
    }
    else if (azimuthDD == 270) {

        return "270° 00.00\' + 00.00\\\"";
    }
    else if (0 < azimuthDD && azimuthDD < 90) {
        quadrant_section = "NE";
        bearing_DMS = format_DMS(azimuthDD)

        return bearing_DMS;
    }
    else if (90 < azimuthDD && azimuthDD < 180) {
        quadrant_section = "SE";
        SE_bearing_DD = 180 - azimuthDD;
        bearing_DMS = format_DMS(SE_bearing_DD)

        return bearing_DMS;
    }
    else if (180 < azimuthDD && azimuthDD < 270) {
        quadrant_section = "SW";
        SW_bearing_DD = azimuthDD - 180;
        bearing_DMS = format_DMS(SW_bearing_DD)

        return bearing_DMS;
    }
    else {
        quadrant_section = "NW";
        NW_bearing_DD = 360 - azimuthDD;
        bearing_DMS = format_DMS(NW_bearing_DD)

        return bearing_DMS;
    }
}

// Function returns bearing format "N D-MM-SS.SS E"
function quadFormat_DMS(quadrant_section, bearing_DD) {

    minutes = (bearing_DD - Math.floor(bearing_DD)) * 60;
    seconds = (minutes - Math.floor(minutes)) * 60;

    // Check if number is less then 9
    minutes_int = prependZero(Math.floor(minutes));
    seconds_int = handleSigFig(2,prependZero(seconds));
    // Get rid of fractional part
    degree_str = Math.floor(bearing_DD).toString();
    minutes_str = minutes_int.toString();
    seconds_str = seconds_int.toString();

    if (quadrant_section == "NE") {
        bearing_DMS = "N " + degree_str + "° " + minutes_str + "\' " + seconds_str + "\" E";
        return bearing_DMS;
    }
    else if (quadrant_section == "SE") {
        bearing_DMS = "S " + degree_str + "° " + minutes_str + "\' " + seconds_str + "\" E";
        return bearing_DMS;
    }
    else if (quadrant_section == "SW") {
        bearing_DMS = "S " + degree_str + "° " + minutes_str + "\' " + seconds_str + "\" W";
        return bearing_DMS;
    }
    else {
        bearing_DMS = "N " + degree_str + "° " + minutes_str + "\' " + seconds_str + "\" W";
        return bearing_DMS;
    }
}

// Function returns bearing format "D-MM-SS.SS"
function format_DMS(numberInput) {

    var numberValue;
    // If data type is string convert to double
    if (typeof numberInput === 'string' || numberInput instanceof String) {
        numberValue = parseFloat(numberInput);
    } else {
        numberValue = numberInput
    }

    minutes = (numberValue - Math.floor(numberValue)) * 60;
    seconds = (minutes - Math.floor(minutes)) * 60;

    // Check if number is less then 9
    minutes_int = prependZero(Math.floor(minutes));
    seconds_int = handleSigFig(2, prependZero(seconds));
    // Get rid of fractional part
    degree_str = Math.floor(numberValue).toString();
    minutes_str = minutes_int.toString();
    seconds_str = seconds_int.toString();

    string_DMS = degree_str + "° " + minutes_str + "\' " + seconds_str + "\"";

    return string_DMS
}

function prependZero(number) {
    var numberValue = number
    if (numberValue < 9) {number
        // Use "" + 5 + 6 to force it to strings
        numberValue.toString();
        return "0" + numberValue;
    }
    else {
        numberValue.toString();
        return numberValue;
    }

}
// Handle significant figures without rounding
function handleSigFig(numberDecimalPlace, numberValue) {
    var strNumberValue;

    // Check if the number is string
    if (typeof numberValue === 'number' || numberValue instanceof Number) {

        strNumberValue = numberValue.toString();
    } else {
        strNumberValue = numberValue
    }

    var regex = "\\d+(\\.\\d{0," + numberDecimalPlace.toString() + "})";
    var with2Decimals = strNumberValue.match(regex)
    // Check if match is success
    if (with2Decimals) {
        var getMatchValue = parseFloat(with2Decimals[0]);

        return getMatchValue
    }
    else {
        return "No Match Found : Regex Issue"
    }
}

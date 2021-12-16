// This function checks if Labels contains two sgnifcant figures, for line Labels.
function checkTwoLabelSigFigs(numberDecimalPlace, lineLabel, bearingLabel) {
    var lineLabelValue;
    var bearingLabelValue;

    // Check if lineLabel and bearingLabel is a string
    if (typeof lineLabel === 'number') {
        lineLabelValue = lineLabel.toString();
    } else {
        lineLabelValue = lineLabel
    }
    if (bearingLabel === 'number') {
        bearingLabelValue = bearingLabel.toString();
    }
    else {
        bearingLabelValue = bearingLabel
    }

    var regex = "(\\d+\\.\\d{0," + numberDecimalPlace.toString() + "})$";

    var lineLabelMatch = lineLabelValue.match(regex)
    var bearingLabelMatch= bearingLabelValue.match(regex)

    // Check if match is success
    if (lineLabelMatch && bearingLabelMatch) {
        return "Pass"
    }
    else {
        return "Fail"
    }
}
// This Function checks if the bearing format "N DD-MM-SS E" contains North Orientation
function checkNorthOrientation(dms_format) {

    var regex = "(N|n|North|north)";

    var match_northOrientation = dms_format.match(regex)
    // Check if match is success
    if (match_northOrientation) {

        return "Pass"
    }
    else {
        return "Fail"
    }

}
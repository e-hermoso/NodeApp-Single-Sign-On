// THIS FUNCTION IS NOT EXECUTING PROPERLY
//$(document).ready(function () {
//    function openCheck(evt, cityName) {
//        var i, tabcontent, tablinks;
//        tabcontent = document.getElementsByClassName("tabcontent");
//        for (i = 0; i < tabcontent.length; i++) {
//            tabcontent[i].style.display = "none";
//        }
//        tablinks = document.getElementsByClassName("tablinks");
//        for (i = 0; i < tablinks.length; i++) {
//            tablinks[i].className = tablinks[i].className.replace(" active", "");
//        }
//        document.getElementById(cityName).style.display = "block";
//        evt.currentTarget.className += " active";
//    }
//});

/* Formatting function for row details - modify as you need */
function builtLineTable(dataJson) {
    var tableBody = ""
    var rowNumber = 0
    $.each(dataJson["Parcels"], function (parcelName, obj) {
        // Access the collection of segment objects
        // Note: Make sure that when access the collection of segments the index is always [0]
        var segmentCollection = obj[0]["Segments"]
        $.each(segmentCollection, function (segmentNumber, segment_obj) {
            // Check if the segment is a line
            if (segment_obj["shapeType"] == "Line") {
                rowNumber = rowNumber + 1

                var labelLineLength;
                var labelLineBearing;
                var diffLineLength;
                var diffLineBearing;
                var lineLengthCheck;
                var lineBearingCheck;
                var sigFigResult;
                var northOrientationResult;

                var handleId = segment_obj["HandleId"];
                var oId = segment_obj["oid"];
                var lengthOfSegment = handleSigFig(3, segment_obj["length"]);
                var bearingOfSegment = azimuth_DD_to_bearing_QDMS(segment_obj["azimuth_DD"]);

                // Check if Labels_check key contain any values
                if (segment_obj["Labels_Check"]["LineLength_Check"] == "None") {
                    labelLineLength = "None"
                    diffLineLength = "None"
                    lineLengthCheck = "Fail"
                }
                else {
                    labelLineLength = segment_obj["Labels_Check"]["LineLength_Check"]["SegmentLength_Label"]
                    diffLineLength = handleSigFig(3, segment_obj["Labels_Check"]["LineLength_Check"]["Difference"])
                    lineLengthCheck = segment_obj["Labels_Check"]["LineLength_Check"]["SegmentLength_Check"]
                }
                if (segment_obj["Labels_Check"]["LineBearing_Check"] == "None") {
                    labelLineBearing = "None"
                    diffLineBearing = "None"
                    lineBearingCheck = "Fail"
                }
                else {
                    labelLineBearing = segment_obj["Labels_Check"]["LineBearing_Check"]["Bearing_Label"]
                    diffLineBearing = format_DMS(segment_obj["Labels_Check"]["LineBearing_Check"]["Difference"])
                    lineBearingCheck =segment_obj["Labels_Check"]["LineBearing_Check"]["SegmentBearing_Check"]
                }

                // CUSTOM CHECKS
                // 1: Check if line labels and bearing labels contain two significant figures.
                if (labelLineLength != "None" && labelLineBearing != "None") {
                    sigFigResult = checkTwoLabelSigFigs(2, labelLineLength, labelLineBearing)
                } else {
                    sigFigResult = "Fail"
                }
                // 2: Check if bearing label orientation is north
                if (labelLineBearing != "None") {
                    northOrientationResult = checkNorthOrientation(labelLineBearing)
                } else {
                    northOrientationResult = "Fail"
                }

                tableBody = tableBody + formatLineTable(parcelName, lengthOfSegment, bearingOfSegment, labelLineLength, labelLineBearing, diffLineLength, diffLineBearing, lineLengthCheck, lineBearingCheck, sigFigResult, northOrientationResult,handleId, oId)

            }
        })
    })
    $("#dynamicTable").append(tableBody)
}

function formatLineTable(parcel, lineLength, lineBearing, labelLineLength, labelLineBearing, diffLineLength, diffLineBearing, lineLengthCheck, lineBearingCheck, sigFig_check, north_check, handleId,OId) {

    var tableBody = ""
    tableBody = tableBody + "<tr class='main-parent-row geometry-type' dataHId=" + handleId + " dataOId=" + OId + ">"
    tableBody = tableBody + "<td>" + parcel + "</td>"
    tableBody = tableBody + "<td>" + lineLength + "</td>"
    tableBody = tableBody + "<td>" + lineBearing + "</td>"
    tableBody = tableBody + "<td>" + labelLineLength + "</td>"
    tableBody = tableBody + "<td>" + labelLineBearing + "</td>"
    tableBody = tableBody + "<td>" + diffLineLength + "</td>"
    tableBody = tableBody + "<td>" + diffLineBearing + "</td>"
    tableBody = tableBody + "<td>" + sigFig_check + "</td>"
    tableBody = tableBody + "<td>" + lineLengthCheck + "</td>"
    tableBody = tableBody + "<td>" + lineBearingCheck + "</td>"
    tableBody = tableBody + "<td>" + north_check + "</td>"
    tableBody = tableBody + "</tr>"

    return tableBody
}

function builtCurveTable(dataJson) {
    var tableBody = ""
    var rowNumber = 0
    $.each(dataJson["Parcels"], function (parcelName, obj) {
        // Access the collection of segment objects
        // Note: Make sure that when access the collection of segments the index is always [0]
        var segmentCollection = obj[0]["Segments"]
        $.each(segmentCollection, function (segmentNumber, segment_obj) {
            // Check if the segment is a Curve
            if (segment_obj["shapeType"] == "Curve") {
                rowNumber = rowNumber + 1
                // Access label checks
                // console.log(segment_obj["Labels_Check"])
                // Access ArcLength_Check
                // console.log(segment_obj["Labels_Check"]["ArcLength_Check"])
                // collect data that passed

                var labelArcLength
                var labelTotalAngle
                var labelStartTan
                var labelEndTan
                var diffArcLength
                var diffTotalAngle
                var diffStartTan
                var diffEndTan
                var sigFigResult;
                var arcLengthCheck
                var totalAngleCheck
                var startTanCheck
                var endTanCheck

                var handleId = segment_obj["HandleId"]
                var oId = segment_obj["oid"]
                var arcLengthOfSegment = handleSigFig(3,segment_obj["arcLength"])
                var arcDelta = format_DMS(segment_obj["arcDelta_DD"])
                var arcRadius = handleSigFig(3,segment_obj["arcRadius"])
                var startTangency = segment_obj["radtangent_start"]
                var endTangency = segment_obj["radtangent_end"]

                // Check if ArcLength_Check dictionary contain any values
                if (segment_obj["Labels_Check"]["ArcLength_Check"] == "None") {
                    labelArcLength = "None"
                    diffArcLength = "None"
                    arcLengthCheck = "Fail"
                }
                else {
                    labelArcLength = segment_obj["Labels_Check"]["ArcLength_Check"]["ArcLength_Label"]
                    diffArcLength = handleSigFig(3,segment_obj["Labels_Check"]["ArcLength_Check"]["Difference"])
                    arcLengthCheck = segment_obj["Labels_Check"]["ArcLength_Check"]["ArcLength_Check"]
                }
                // Check if ArcDelta_Check dictionary contain any values
                if (segment_obj["Labels_Check"]["ArcDelta_Check"] == "None") {
                    labelTotalAngle = "None"
                    diffTotalAngle = "None"
                    totalAngleCheck = "Fail"
                }
                else {
                    labelTotalAngle = segment_obj["Labels_Check"]["ArcDelta_Check"]["CurveTotalAngle_Label"]
                    diffTotalAngle = handleSigFig(3,segment_obj["Labels_Check"]["ArcDelta_Check"]["Difference"])
                    totalAngleCheck = segment_obj["Labels_Check"]["ArcDelta_Check"]["CurveTotalAngle_Check"]
                }
                // Check if Arc_StartPoint_Check is tangent
                if (startTangency == "Tangent") {
                    labelStartTan = "None"
                    diffStartTan = "None"
                    startTanCheck = "Pass"
                }
                else {
                    // Check if Arc_StartPoint_Check dictionary contain any values
                    if (segment_obj["Labels_Check"]["Arc_StartPoint_Check"] == "None") {
                        // No labels indicated for a non-tangent, reverse, or Compound curve
                        labelStartTan = "None"
                        diffStartTan = "None"
                        startTanCheck = "Fail"
                    }
                    else {

                        labelStartTan = segment_obj["Labels_Check"]["Arc_StartPoint_Check"]["StartPoint_Label"]
                        startTanCheck = segment_obj["Labels_Check"]["Arc_StartPoint_Check"]["Arc_StartPoint_Check"]

                        if (startTangency == "Reverse" || startTangency == "Compound") {
                            diffStartTan = "None"

                        } else {
                            diffStartTan = handleSigFig(3, segment_obj["Labels_Check"]["Arc_StartPoint_Check"]["Difference"])
                        }
                    }
                }
                // Check if Arc_EndPoint_Check is tangent
                if (endTangency == "Tangent") {
                    labelEndTan = "None"
                    diffEndTan = "None"
                    endTanCheck = "Pass"
                }
                else {
                    // Check if Arc_EndPoint_Check dictionary contain any values
                    if (segment_obj["Labels_Check"]["Arc_EndPoint_Check"] == "None") {
                        // No labels indicated for a non-tangent, reverse, or Compound curve
                        labelEndTan = "None"
                        diffEndTan = "None"
                        endTanCheck = "Fail"
                    }
                    else {
                        labelEndTan = segment_obj["Labels_Check"]["Arc_EndPoint_Check"]["EndPoint_Label"]
                        endTanCheck = segment_obj["Labels_Check"]["Arc_EndPoint_Check"]["Arc_EndPoint_Check"]

                        if (endTangency == "Reverse" || endTangency == "Compound") {
                            diffEndTan = "None"
                        } else {

                            diffEndTan = handleSigFig(3, segment_obj["Labels_Check"]["Arc_EndPoint_Check"]["Difference"])
                        }
                    }
                }

                // CUSTOM CHECKS
                // 1: Check if line labels and bearing labels contain two significant figures.
                if (labelArcLength != "None" && labelTotalAngle != "None") {
                    sigFigResult = checkTwoLabelSigFigs(2, labelArcLength, labelTotalAngle)
                } else {
                    sigFigResult = "Fail"
                }

                // Loop through the Feature Types in curve length checks
                // Note can not use in operator to search for length in None type unless its an object: {"ArcLength_Check":"None"}
                tableBody = tableBody + formatCurveTable(parcelName, startTangency, arcDelta, arcRadius, arcLengthOfSegment, endTangency, labelStartTan, labelTotalAngle, labelArcLength, labelEndTan, diffStartTan, diffTotalAngle, diffArcLength, diffEndTan, sigFigResult, startTanCheck, totalAngleCheck, arcLengthCheck, endTanCheck, handleId, oId)
            }
        })
    })
    $("#dynamicTable-Curve").append(tableBody)
}

function formatCurveTable(parcelName, startTangency, totalAngle, arcRadius, arcLength, endTangency, labelStartTan, labelTotalAngle, labelArcLength, labelEndTan, diffStartTan, diffTotalAngle, diffArcLength, diffEndTan, sifFig_results, startTanCheck, totalAngleCheck, arcLengthCheck, endTanCheck, handleId, OId) {

    var tableBody = ""
    tableBody = tableBody + "<tr class='main-parent-row geometry-type' dataHId=" + handleId + " dataOId=" + OId + ">"
    tableBody = tableBody + "<td>" + parcelName + "</td>"
    tableBody = tableBody + "<td>" + startTangency + "</td>"
    tableBody = tableBody + "<td>" + totalAngle + "</td>"
    tableBody = tableBody + "<td>" + arcRadius + "</td>"
    tableBody = tableBody + "<td>" + arcLength + "</td>"
    tableBody = tableBody + "<td>" + endTangency + "</td>"
    tableBody = tableBody + "<td>" + labelStartTan + "</td>"
    tableBody = tableBody + "<td>" + labelTotalAngle + "</td>"
    tableBody = tableBody + "<td>" + labelArcLength + "</td>"
    tableBody = tableBody + "<td>" + labelEndTan + "</td>"
    tableBody = tableBody + "<td>" + diffStartTan + "</td>"
    tableBody = tableBody + "<td>" + diffTotalAngle + "</td>"
    tableBody = tableBody + "<td>" + diffArcLength + "</td>"
    tableBody = tableBody + "<td>" + diffEndTan + "</td>"
    tableBody = tableBody + "<td>" + sifFig_results + "</td>"
    tableBody = tableBody + "<td>" + startTanCheck + "</td>"
    tableBody = tableBody + "<td>" + totalAngleCheck + "</td>"
    tableBody = tableBody + "<td>" + arcLengthCheck + "</td>"
    tableBody = tableBody + "<td>" + endTanCheck + "</td>"
    tableBody = tableBody + "</tr>"

    return tableBody
}

/*
 * Add Functionality to interact with the data in the table
 * and Forge Viewer after the table is created.
 */

// GetAllLeafComponents function
function getAllLeafComponents_v3(callback) {
    //alert("Object Tree")
    viewer.getObjectTree(function (tree) {
        let leaves = [];
        tree.enumNodeChildren(tree.getRootId(), function (dbId) {
            if (tree.getChildCount(dbId) === 0) {
                leaves.push(dbId);
            }
        }, true);
        callback(leaves);
    });
}

function executeFitToViewHandleId(handleIdData) {
    var itemObj
    // Execute test function getAllLeafComponents_v3
    getAllLeafComponents_v3((dbIds) => {
        // Now for leaf components, let's get some properties and count occurrences of each value
        const filteredProps = ['externalId'];

        // important! How does the search function work.

        // Get only the properties we need for the leaf dbIds
        viewer.model.getBulkProperties(dbIds, filteredProps, (items) => {
            // Iterate through the elements we found
            var handleIdFromViewer
            var dbIdVal

            itemObj = items.find(item => item['externalId'].toLowerCase() == handleIdData)
            dbIdVal = itemObj['dbId']
            viewer.select(dbIdVal)
            viewer.utilities.fitToView()

            // items.forEach((item) => {
            //
            //     // Check a polyline based on dwg file
            //
            //     // Unable to access properties from externalId
            //     //handleIdVal = item['properties'][0]['displayValue']
            //
            //     handleIdFromViewer = item['externalId'].toLowerCase();
            //     dbIdVal = item['dbId']
            //     // console.log("Viewer - Handle Id: ", handleIdVal)
            //     // console.log("Viewer - Type of", typeof handleIdVal)
            //     if (handleIdFromViewer == handleIdData) {
            //         console.log("Eric - Matched Handle Id ", handleIdFromViewer)
            //         viewer.select(dbIdVal)
            //         viewer.utilities.fitToView()
            //     }
            // });
            //console.log(viewer.select([testDbid]))
        });
    });
}

$(document).ready(function () {
    console.log("Prepare list of defined activies.")
    prepareLists();

    $('#clearAccount').click(clearAccount);
    $('#defineActivityShow').click(defineActivityModal);
    $('#createAppBundleActivity').click(createAppBundleActivity);
    $('#startWorkitem').click(startWorkitem);
    startConnection();

    // Interact with data table
    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.details-controls', function () {
        //var tr = $(this).closest('tr');
        var patt = /\d+/i;
        var idParentName = $(this).attr('id')
        var resultMatch = idParentName.match(patt); // returns an Array (object)
        var childClassName = "childTbl-" + resultMatch[0].toString() // create child table name

        // check if the child table has class name "show-tbl"
        var check = $("#" + childClassName).hasClass("show_tbl")
        //console.log(childClassName)

        if (check) {
            // Open this row
            $("#" + childClassName).removeClass("animation-hide-detail")
            $("#" + childClassName).removeClass("show_tbl")
            $("#" + childClassName).addClass("animation-show-detail")

        }
        else {
            // Close this row
            $("#" + childClassName).removeClass("animation-show-detail")
            //$("#" + childClassName).addClass("animation-hide-detail")
            $("#" + childClassName).addClass("show_tbl")
        }
    });
});

function prepareLists() {
    list('activity', backendBaseApi_URL + '/api/forge/designautomation/activities');
    list('engines', backendBaseApi_URL + '/api/forge/designautomation/engines');
    // list('localBundles', 'http://localhost:3000/api/appbundles');
}

function list(control, endpoint) {
    $('#' + control).find('option').remove().end();
    jQuery.ajax({
        url: endpoint,
        success: function (list) {
            if (list.length === 0)
                $('#' + control).append($('<option>', { disabled: true, text: 'Nothing found' }));
            else
                list.forEach(function (item) { $('#' + control).append($('<option>', { value: item, text: item })); })
        }
    });
}

function clearAccount() {
    if (!confirm('Clear existing activities & appbundles before start. ' +
        'This is useful if you believe there are wrong settings on your account.' +
        '\n\nYou cannot undo this operation. Proceed?')) return;

    jQuery.ajax({
        url: backendBaseApi_URL + '/api/forge/designautomation/account',
        method: 'DELETE',
        success: function () {
            prepareLists();
            writeLog('Account cleared, all appbundles & activities deleted');
        }
    });
}

function defineActivityModal() {
    $("#defineActivityModal").modal();
}

function createAppBundleActivity() {
    startConnection(function () {
        writeLog("Defining appbundle and activity for " + $('#engines').val());
        $("#defineActivityModal").modal('toggle');
        createAppBundle(function () {
            createActivity(function () {
                prepareLists();
            })
        });
    });
}

function createAppBundle(cb) {
    jQuery.ajax({
        url: backendBaseApi_URL + '/api/forge/designautomation/appbundles',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            zipFileName: $('#localBundles').val(),
            engine: $('#engines').val()
        }),
        success: function (res) {
            writeLog('AppBundle: ' + res.appBundle + ', v' + res.version);
            if (cb) cb();
        }
    });
}

function createActivity(cb) {
    jQuery.ajax({
        url: backendBaseApi_URL + '/api/forge/designautomation/activities',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            zipFileName: $('#localBundles').val(),
            engine: $('#engines').val()
        }),
        success: function (res) {
            writeLog('Activity: ' + res.activity);
            if (cb) cb();
        }
    });
}

function startWorkitem() {
    var inputFileField = document.getElementById('inputFile');
    if (inputFileField.files.length === 0) { alert('Please select an input file'); return; }
    if ($('#activity').val() === null) { alert('Please select an activity'); return };
    var file = inputFileField.files[0];
    startConnection(function () {
        var formData = new FormData();
        formData.append('inputFile', file);
        // Append users input of width and height
        formData.append('data', JSON.stringify({
            mapType: $('#mapType').val(),
            //height: $('#height').val(),
            activityName: $('#activity').val(),
            browerConnectionId: connectionId
        }));
        writeLog('Uploading input file...');
        $.ajax({
            url: backendBaseApi_URL + '/api/forge/designautomation/workitems',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (res) {
                writeLog('Workitem started: ' + res.workItemId);
                console.log(res);
                displayAlertMsg("Workitem started");
            }
        });
    });
}


function writeLog(text) {
    //$('#outputlog').append('<div style="border-top: 1px dashed #C0C0C0">' + text + '</div>');
    //var elem = document.getElementById('outputlog');
    console.log("================== Write Log Start ==================")
    console.log(text)
    console.log("================== Write Log End ==================")
    //var elem = $('#outputlog')[0];
    //elem.scrollTop = elem.scrollHeight;
}

var connection;
var connectionId;
var connection2;
var connectionId2;

function startConnection(onReady) {
    if (connection && connection.connectionState) { if (onReady) onReady(); return; }
    connection = new signalR.HubConnectionBuilder().withUrl(backendBaseApi_URL + "/api/signalr/designautomation").withAutomaticReconnect().build();
    console.log("new DA signalR.HubConnection: ",connection);
    connection.start()
        .then(function () {
            console.log("invoke connection on getConnectionId in Design Automation")
            connection.invoke('getConnectionId')
                .then(function (id) {
                    console.log("Design Automation connectionId: ",id)
                    connectionId = id; // we'll need this...
                    if (onReady) onReady();
                });
        });

    //Have an event handler for a type of message that we're receiving.
    //In this particular case we call that "downloadResult" from the server.
    //This allow us to use "connection.on()" and specify our ket "downloadResult".
    //It also takes a function, so this function is how do you want your client side
    //to react when it recives that particular message.
    connection.on("downloadResult", function (url) {
        writeLog('<a href="' + url + '">Download result file here</a>');
        getJsonFromDA(url);
    });

    connection.on("onComplete", function (message) {
        console.log("onComplete in connection.on")
        console.log(message)
        displayAlertMsg("Workitem completed");
        writeLog(message);
    });
    connection.on("objKeysInputFile", function (objectKeys) {
        console.log("Get bucket key and object name")
        console.log(objectKeys)
        displayAlertMsg("Translating dwg file on Viewer");
        translateObject(objectKeys[0], objectKeys[1])
    });

    connection2 = new signalR.HubConnectionBuilder().withUrl(backendBaseApi_URL + "/api/signalr/modelderivative").withAutomaticReconnect().build();
    console.log("new MD signalR.HubConnection:", connection2);
    connection2.start()
        .then(function () {
            console.log("invoke connection on getConnectionId in Model Derivative")
            connection2.invoke('getConnectionId')
                .then(function (id) {
                    //if (id.indexOf('_') !== -1) {
                    //    console.log('Restarting...');
                    //    connection.stop(); // need to fix this..
                    //    connection = null;
                    //    startConnection();
                    //    return;
                    //}
                    console.log("Model Derivative connectionId: ",id)
                    connectionId2 = id; // we'll need this...
                    if (onReady) onReady();
                });
        })
    connection2.on("extractionFinished", function (data) {
        console.log("extractionFinished in connection.on");
        $("#forgeViewer").empty();
        launchViewer(data.resourceUrn);
    });
}
// Handle data after Design Automation API successfully completed.

function displayAlertMsg(messageInfo) {
    $("#alert-info").text(messageInfo);
    $("div.success").fadeIn(300).delay(900).fadeOut(400);
};

function getJsonFromDA(url) {
    $.get(url, function (data, status) {
        //alert("Data: " + data + "\nStatus: " + status);
        const resultData = JSON.parse(data);
        console.log(status)
        console.log(resultData);
        // Generate dynamic table by calling the function from tableScript.js
        //builtTable(resultData) // Function from DynamicTable.js
        builtLineTable(resultData);
        builtCurveTable(resultData);
        // build esri map, function from esri.js
        base_map(resultData);

        // Set variable for other extention to access the json data
        da_jsonData = resultData;
    });
    //$.get(url)
    //    .done(function (data) {
    //        const resultData = JSON.parse(data);
    //        console.log(resultData);
    //    });

}

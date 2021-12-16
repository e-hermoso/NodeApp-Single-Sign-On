// Trnslate file object with model derivative 
function translateObject(bucketKey, objectKey) {
    $("#forgeViewer").empty();

    startConnection(function () {
        if (false) {
            $("#rootFileModal").modal();
            $("#translateZipObject").click(function () {
                $('#rootFileModal').modal('toggle');
                jQuery.post({
                    url: backendBaseApi_URL + '/api/forge/modelderivative/jobs',
                    contentType: 'application/json',
                    data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey, 'rootFilename': $("#rootFilename").val(), 'connectionId': connectionId2 }),
                    success: function (res) {
                        $("#forgeViewer").html('Translation started! Please try again in a moment.');
                    },
                });
            });
        }
        else {
            jQuery.post({
                url: backendBaseApi_URL + '/api/forge/modelderivative/jobs',
                contentType: 'application/json',
                data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey, 'connectionId': connectionId2 }),
                success: function (res) {
                    console.log("post url:/api/forge/modelderivative/jobs in order to translate the job")
                    $("#forgeViewer").html('Translation started! Model will load when ready...');
                },
            });
        }
    })
}
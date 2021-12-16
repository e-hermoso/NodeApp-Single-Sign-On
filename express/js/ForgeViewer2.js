var viewer;
var da_jsonData; // Assign json data to a variable after design automation is complete
var backendBaseApi_URL = "https://amcdevbe.azurewebsites.net"; // Access the backend API services

function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        api: 'derivativeV2',
        getAccessToken: getForgeToken,
        "da_jsonData": da_jsonData
    };

    Autodesk.Viewing.Initializer(options, () => {

        // Creatre Viewer instance
        viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['ModelSummaryExtensionClass', 'Autodesk.DocumentBrowser', 'OverLayGeometry'] }); // 'TransExplorerExtension'
        var startedCode = viewer.start(null, null, null, null, {
            webglInitParams: {
                useWebGL2: false
            }
        });

        if (startedCode > 0) {
            console.error('Failed to create a Viewer: WebGL not supported.');
            return;
        }

        console.log('Initialization complete, loading a model next...');

        // The documentId is a string value of the URN of the model that was translated.
        // The value assigned to documentId must be prefixed with the string urn:
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess2, onDocumentLoadFailure2);
        console.log("initialization complete, creating the viewer...");
    });
}


function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onDocumentLoadSuccess2(viewerDocument) {
    // viewerDocument is an instance of Autodesk.Viewing.Document
    console.log("Executing onDocumentLoadSuccess2 function.")
    var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(viewerDocument, defaultModel).then(async function (model) {
        await afterViewerEvents(
            viewer,
            [
                Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT
            ]
        );

        // Run other functionalities after model is done loading.
        console.log("Viewer GEOMETRY_LOADED_EVENT and OBJECT_TREE_CREATED_EVENT is completely loaded.")

    });
    console.log("Check if Viewer is completely loaded.")
}

function onDocumentLoadFailure2() {
    console.error('Failed fetching Forge manifest');
}

function getForgeToken(callback) {
    fetch(backendBaseApi_URL+'/api/forge/oauth/token').then(res => {
        res.json().then(data => {
            callback(data.access_token, data.expires_in);
        });
    });
}


function afterViewerEvents(viewer, events) {
    let promises = [];
    events.forEach(function (event) {
        promises.push(new Promise(function (resolve, reject) {
            let handler = function () {
                viewer.removeEventListener(event, handler);
                console.log(`Removed event listener for ${event}`)
                resolve();
            }
            viewer.addEventListener(event, handler);
            console.log(`Added event listener for ${event}`)
        }));
    });

    return Promise.all(promises)
}
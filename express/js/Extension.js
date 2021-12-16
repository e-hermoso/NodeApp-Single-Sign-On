// Content for 'Extension.js'
function SampleExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

SampleExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
SampleExtension.prototype.constructor = SampleExtension;

SampleExtension.prototype.load = function () {
    //alert('Erics - Extension is loaded!');

    // Note: The extension property this.viewer is the main access point for most of the Viewer’s features and customizations.
    var viewer = this.viewer;

    var lockBtn = document.getElementById('MyAwesomeLockButton');
    lockBtn.addEventListener('click', function () {
        viewer.setNavigationLock(true);
    });

    var unlockBtn = document.getElementById('MyAwesomeUnlockButton');
    unlockBtn.addEventListener('click', function () {
        viewer.setNavigationLock(false);
    });

    return true;
};

SampleExtension.prototype.unload = function () {
    console.log('Eric - Extension is now unloaded!');
    return true;
};

// Note: "SampleExtension" used in registerExtension() doesn't need to match the function named declaration.
Autodesk.Viewing.theExtensionManager.registerExtension('SampleExtension', SampleExtension);

// ===============================================================================================================================
// ANOTHER WAY TO WRITE THE SAME CODE ABOVE.

// Note: Its Good Practice to remove added event listeners to DOM elements when the extension is unloaded.
// https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/viewer_basics/extensions/#step-6-cleanup-on-unload
// To perform all cleanup operation in the unload method.

//function MyAwesomeExtension(viewer, options) {
//    Autodesk.Viewing.Extension.call(this, viewer, options);

//    // Preserve "this" reference when methods are invoked by event handlers.
//    this.lockViewport = this.lockViewport.bind(this);
//    this.unlockViewport = this.unlockViewport.bind(this);
//}

//MyAwesomeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
//MyAwesomeExtension.prototype.constructor = MyAwesomeExtension;

//MyAwesomeExtension.prototype.lockViewport = function () {
//    this.viewer.setNavigationLock(true);
//};

//MyAwesomeExtension.prototype.unlockViewport = function () {
//    this.viewer.setNavigationLock(false);
//};

//MyAwesomeExtension.prototype.load = function () {
//    // alert('MyAwesomeExtension is loaded!');

//    this._lockBtn = document.getElementById('MyAwesomeLockButton');
//    this._lockBtn.addEventListener('click', this.lockViewport);

//    this._unlockBtn = document.getElementById('MyAwesomeUnlockButton');
//    this._unlockBtn.addEventListener('click', this.unlockViewport);

//    return true;
//};

//MyAwesomeExtension.prototype.unload = function () {
//    // alert('MyAwesomeExtension is now unloaded!');

//    if (this._lockBtn) {
//        this._lockBtn.removeEventListener('click', this.lockViewport);
//        this._lockBtn = null;
//    }

//    if (this._unlockBtn) {
//        this._unlockBtn.removeEventListener('click', this.unlockViewport);
//        this._unlockBtn = null;
//    }

//    return true;
//};

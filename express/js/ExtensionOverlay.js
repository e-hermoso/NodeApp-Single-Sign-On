function GeometryCallback(viewer, copiedGeometryName, curveMaterial) {

    this.viewer = viewer;
    this.opiedGeometryName = copiedGeometryName;

    // linewidth does not take effect in Chrome and Firefox
    // It is a known issue with OpenGL core
    // try with Safari
    this.curveMaterial = curveMaterial;
    this.is2PITimes = function (angle1, angle2) {
        return Math.abs(angle1 - angle2) / Math.PI % 2 == 0
    }

}

GeometryCallback.prototype.onLineSegment = function (x1, y1, x2, y2, vpId) {

    var vpXform = this.viewer.model.getPageToModelTransform(vpId);
    //if in CAD coordinate system, applyMatrix4 with vpXform
    var pt1 = new THREE.Vector3().set(x1, y1, 0)//.applyMatrix4(vpXform);
    var pt2 = new THREE.Vector3().set(x2, y2, 0)//.applyMatrix4(vpXform);

    console.log('Line segment vertices coordinates: ', {
        pointX1: pt1.x,
        pointY1: pt1.y,
        pointX2: pt2.x,
        pointY2: pt2.y
    });

    //add overlay geometry
    var geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(pt1.x, pt1.y, 0))
    geometry.vertices.push(new THREE.Vector3(pt2.x, pt2.y, 0))

    var lines = new THREE.Line(geometry,
        this.curveMaterial,
        THREE.LinePieces)
    this.viewer.impl.addOverlay(this.opiedGeometryName, lines)
    this.viewer.impl.invalidate(false, false, true)
}

GeometryCallback.prototype.onCircularArc = function (cx, cy, start, end, radius, vpId) {

    var vpXform = this.viewer.model.getPageToModelTransform(vpId);
    //if in CAD coordinate system, applyMatrix4 with vpXform
    var center = new THREE.Vector3().set(cx, cy, 0)//.applyMatrix4(vpXform);

    console.log('CircleArc segment: ', {
        centerX: center.x,
        centerY: center.y,
        radius: radius,
        startAngle: start,
        endAngle: end
    });

    //add overlay geometry
    var curve = new THREE.EllipseCurve(
        center.x, center.y,
        radius, radius,
        start, end,
        false
    );
    var path = new THREE.Path(curve.getPoints(50));
    var geometry = path.createPointsGeometry(50);
    //remove last vertex if it an arc
    if (!this.is2PITimes(start, end))
        geometry.vertices.pop();
    var circularArc = new THREE.Line(geometry, this.curveMaterial);
    this.viewer.impl.addOverlay(this.opiedGeometryName, circularArc)
    this.viewer.impl.invalidate(false, false, true)
};

GeometryCallback.prototype.onEllipticalArc = function (cx, cy, start, end, major, minor, tilt, vpId) {
    var vpXform = this.viewer.model.getPageToModelTransform(vpId);
    //if in CAD coordinate system, applyMatrix4 with vpXform
    var center = new THREE.Vector3().set(cx, cy, 0)//.applyMatrix4(vpXform);

    console.log('EllipticalArc segment: ', {
        centerX: center.x,
        centerY: center.y,
        radius: radius,
        startAngle: start,
        endAngle: end
    });

    //add overlay geometry
    var curve = new THREE.EllipseCurve(
        center.x, center.y,
        major, minor,
        start, end,
        false
    );
    var path = new THREE.Path(curve.getPoints(50));
    var geometry = path.createPointsGeometry(50);
    //remove last vertex if it an arc
    if (!this.is2PITimes(start, end))
        geometry.vertices.pop();
    var ellipticalArc = new THREE.Line(geometry, this.curveMaterial);
    this.viewer.impl.addOverlay(this.opiedGeometryName, ellipticalArc)
    this.viewer.impl.invalidate(false, false, true)
};
GeometryCallback.prototype.onOneTriangle = function (x1, y1, x2, y2, x3, y3, vpId) {
    //Similar logic as above
};
GeometryCallback.prototype.onTexQuad = function (centerX, centerY, width, height, rotation, vpId) {
    //from VertexBufferReader.js:
    //Currently this case does not actually come up
};

//extension of Show2dCurve
function Show2dCurve(viewer) {

    //Autodesk.Viewing.Extension.call(this, viewer, options)
    Autodesk.Viewing.Extension.call(this, viewer)
    var _viewer = this.viewer
    var _copiedGeometryName = 'copiedGeometryName'

    // linewidth does not take effect in Chrome and Firefox
    // It is a known issue with OpenGL core
    // try with Safari
    var _curveMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color("rgb(135,206,250)"),
        transparent: true,
        depthWrite: false,
        depthTest: false,
        linewidth: 50,
        opacity: 1.0
    })

    //when extension is loaded
    this.load = function () {
        console.log('Eric - Show2dCurve extension is loaded!');

        //$(document).on('click', '.matched-found', function () {

        //    //alert($(this).attr('datainfo'));
        //    var handleIdFromElementAttribute = $(this).attr('datainfo')
        //    //var dbidFound = executeFitToViewHandleId(handleIdFromElementAttribute)
        //    console.log("searchSelectedObj function Executed");
        //    searchSelectedObj(handleIdFromElementAttribute)
        //})

        //bind keyup event
        $(document).bind('keyup', onKeyUp);
        _viewer.impl.invalidate(true);
        return true;
    };

    //when extension is unloaded
    this.unload = function () {
        console.log('MyShow2dCurve is now unloaded!');
        //unbind keyup event
        $(document).unbind('keyup', this.onKeyUp);
        return true;
    };

    //when key up
    function onKeyUp(evt) {
        console.log('Eric - onKeyUp:' + evt.keyCode);

        //when key 'S' is pressed
        if (evt.keyCode == 83) {
            //create overlay
            _viewer.impl.createOverlayScene(_copiedGeometryName, _curveMaterial)
            //start to monitor select event
            _viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, createOverlayforHandleIdObj)
        }

        //when key 'Q' is pressed
        if (evt.keyCode == 81) {
            //undelegate selection event
            _viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, createOverlayforHandleIdObj)
            //remove overlay
            _viewer.impl.removeOverlayScene(_copiedGeometryName);
            _viewer.impl.invalidate(false, false, true);
        }

        return true;
    }

    // Create an overlay on the selected object.
    function createOverlayforHandleIdObj(dbObjId) {
        _viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT)
        _viewer.impl.createOverlayScene(_copiedGeometryName, _curveMaterial)

        console.log("createOverlayforHandleIdObj executed");
        //get instance tree
        var it = _viewer.model.getData().instanceTree;
        console.log("get instance tree")
        console.log(it)
        //dump fragments of the object
        it.enumNodeFragments(dbObjId, function (fragId) {
            //get each fragment
            var m = _viewer.impl.getRenderProxy(_viewer.model, fragId);
            console.log("get each fragment")
            console.log(m)
            //initialize VertexBufferReader
            var vbr = new Autodesk.Viewing.Private.VertexBufferReader(m.geometry, _viewer.impl.use2dInstancing);
            console.log("initialize vertexBufferReader")
            console.log(vbr)
            //dump geometry of this fragment
            vbr.enumGeomsForObject(dbObjId, new GeometryCallback(_viewer, _copiedGeometryName, _curveMaterial));
        });
    }

    // GetAllLeafComponents function
    function getAllLeafComponents_v4(callback) {
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

    // search for the selected object based on the HandleId
    // "this" gives access to the searchSelectObj method in the browser
    this.searchSelectedObj = function (handleIdData) {
        var itemObj
        console.log("Execute function getAllLeafComponents_v4")
        // Execute test function getAllLeafComponents_v3
        getAllLeafComponents_v4((dbIds) => {
            // Now for leaf components, let's get some properties and count occurrences of each value
            const filteredProps = ['externalId'];

            console.log("Execute function getBulkProperties")

            // Get only the properties we need for the leaf dbIds
            viewer.model.getBulkProperties(dbIds, filteredProps, (items) => {
                // Iterate through the elements we found
                console.log("Searching for handleId")
                itemObj = items.find(item => item['externalId'].toLowerCase() == handleIdData)
                console.log("Object item found: " + itemObj)
                console.log("Searching for handleId DONE")

                var dbIdVal = itemObj['dbId']

                createOverlayforHandleIdObj(dbIdVal)
            });
            // Note: console.log() is executed while the find method is still being executed.
            console.log("Execute function getBulkProperties: COMPLETE")
        });
        // Note: console.log() is executed while the find method is still being executed.
        console.log("Execute function getAllLeafComponents_v4: COMPLETE")
    }
}

Show2dCurve.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
Show2dCurve.prototype.varructor = Show2dCurve;

Autodesk.Viewing.theExtensionManager.registerExtension('OverLayGeometry', Show2dCurve);
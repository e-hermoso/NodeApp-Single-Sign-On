// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// A $( document ).ready() block.

// Call esri map

var view;
var findposition = false;
var myitemid;
var myfile;
var correctcad = "Spatial reference of CAD file is in compliance with County standards."
var gp2failed = "File Failed to Convert."
var workingGDB;
function base_map(jsonData) {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/geometry/Polyline",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/geometry/SpatialReference",
        "esri/request",
        "esri/tasks/Geoprocessor",
        "esri/tasks/support/DataFile",
        "esri/config",
        "esri/layers/MapImageLayer",
        "esri/layers/TileLayer",
        "esri/widgets/BasemapToggle",
        "esri/Basemap",
        "esri/geometry/Point",
        "esri/geometry/Polygon"
    ], function (Map, MapView, Polyline, Graphic, GraphicsLayer, SpatialReference, esriRequest, Geoprocessor, DataFile, esriConfig, MapImageLayer, TileLayer, BasemapToggle, Basemap, Point, Polygon) {
        var dataFile = new DataFile();
        esriConfig.request.timeout = 300000;
        var mylocation = '{"displayFieldName": "","geometryType": "esriGeometryPoint","spatialReference": {"wkid": 2230,"latestWkid": 2230},"fields": [{"name": "OBJECTID","type": "esriFieldTypeOID","alias": "OBJECTID"}],"features": [{"attributes": {"OBJECTID": 1},"geometry": {"x": 6068758.9199999999,"y": 2242984.3800000008}}],"exceededTransferLimit": false}'
        var polylist = []
        var lods = [{
            "level": 0,
            "resolution": 217.01388888888889,
            "scale": 250000
        },
        {
            "level": 1,
            "resolution": 108.50694444444444,
            "scale": 125000
        },
        {
            "level": 2,
            "resolution": 55.55555555555555,
            "scale": 64000
        },
        {
            "level": 3,
            "resolution": 27.777777777777775,
            "scale": 32000
        },
        {
            "level": 4,
            "resolution": 13.888888888888888,
            "scale": 16000
        },
        {
            "level": 5,
            "resolution": 6.944444444444444,
            "scale": 8000
        },
        {
            "level": 6,
            "resolution": 3.472222222222222,
            "scale": 4000
        },
        {
            "level": 7,
            "resolution": 1.736111111111111,
            "scale": 2000
        },
        {
            "level": 8,
            "resolution": 0.8680555555555555,
            "scale": 1000
        },
        {
            "level": 9,
            "resolution": 0.43402777777777773,
            "scale": 500
        },
        {
            "level": 10,
            "resolution": 0.21701388888888887,
            "scale": 250
        },
        {
            "level": 11,
            "resolution": 0.066145965625264591,
            "scale": 100
        },
        {
            "level": 12,
            "resolution": 0.026458386250105836,
            "scale": 50
        },
        {
            "level": 13,
            "resolution": 0.016458386250105836,
            "scale": 25
        },
        {
            "level": 14,
            "resolution": 0.016458386250105836,
            "scale": 12
        },
        {
            "level": 15,
            "resolution": 0.006,
            "scale": 6
        }
        ];

        var oForm = document.getElementById('importFileForm');

        var dict = {};
        var dict2 = {};
        var hiddict = {};
        var parent = $('#content-sidebar');
        // Eric - Concat legeal description
        var parcelsDescription = "";
        var pDescriptionList = [];

        var graphicslayer = new GraphicsLayer({
            id: 'graphicslayer'
        });

        var graphicslayer2 = new GraphicsLayer({
            id: 'graphicslayer2'
        });

        var lblgraphicslayer = new GraphicsLayer({
            id: 'lblgraphicslayer'
        });

        lblgraphicslayer.minScale = 3000

        var lineSymbol = {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: 'cyan', // RGB color values as an array
            width: 4
        };


        var citylayers = new MapImageLayer({
            url: "https://www.ocgis.com/arcpub/rest/services/Map_Layers/City_Boundaries/MapServer",
            popupEnabled: false
        });

        var OCbasemapLayer = new TileLayer({
            url: "https://www.ocgis.com/survey/rest/services/Basemaps/County_Basemap_Ext/MapServer"
        });
        var eagleLayer = new TileLayer({
            url: "https://gis.ocgov.com/arcimg/rest/services/Aerial_Imagery_Countywide/Eagle_2017/MapServer"
        });

        var streetlayers = new MapImageLayer({
            url: "https://www.ocgis.com/survey/rest/services/WebApps/Streets/MapServer",
            popupEnabled: false
        });

        var OCB = new Basemap({
            baseLayers: [OCbasemapLayer],
            title: "Orange County",
            id: "ocbasemap",

            thumbnailUrl: "BasemapThumb.jpg"
        });

        var oceagle = new Basemap({
            baseLayers: [eagleLayer],
            title: "Eagle",
            id: "eagle",
            thumbnailUrl: "Eagle2017AerialThumbnail.jpg"
        });


        var parcellayer = new MapImageLayer({
            url: "https://www.ocgis.com/survey/rest/services/WebApps/Map_Layers_Associated_Documents/MapServer",
            sublayers: [
                {
                    id: 66,
                    visible: true,
                }, {
                    id: 67,
                    visible: false
                }, {
                    id: 68,
                    visible: false
                }
            ]
        });


        var map = new Map({
            //basemap: "streets-night-vector"
            basemap: OCB
        });

        var polygonSymbol = {
            type: "simple-fill",
            color: [255, 0, 0, 0.01],
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: 'red',
                width: 1
            }
        }

        map.add(citylayers);
        map.add(parcellayer);
        map.add(streetlayers);
        //map.basemap = "streets-night-vector";

        view = new MapView({
            container: "viewDiv",
            map: map,
            constraints: {
                lods: lods
            },
            spatialReference: new SpatialReference({
                wkid: 2230
            })
        });

        var btoggle = new BasemapToggle({
            titleVisible: true,
            view: view,
            nextBasemap: oceagle
        });

        view.ui.add("reset-map", "top-left");

        view.ui.add(btoggle, "bottom-left");
        //map.add(lblgraphicslayer);
        map.add(graphicslayer);
        map.add(graphicslayer2);

        map.add(lblgraphicslayer);


        view.when(function () {
            //myUpload()
        });

        var markerSymbol3 = {
            type: "simple-marker", // autocasts as SimpleFillSymbol
            style: "x",
            color: "red",
            size: "14pt",
            outline: {  // autocasts as new SimpleLineSymbol()
                color: "red",
                width: 3
            }

        }

        // view.on("click",function(evt){
        //   if (findposition){
        //     view.graphics.removeAll();
        //     console.log(evt.mapPoint.x, evt.mapPoint.y);
        //     mylocation = '{"displayFieldName": "","geometryType": "esriGeometryPoint","spatialReference": {"wkid": 2230,"latestWkid": 2230},"fields": [{"name": "OBJECTID","type": "esriFieldTypeOID","alias": "OBJECTID"}],"features": [{"attributes": {"OBJECTID": 1},"geometry": {"x": '+evt.mapPoint.x+',"y": '+evt.mapPoint.y+'}}],"exceededTransferLimit": false}'
        //     view.graphics.add(new Graphic(evt.mapPoint,markerSymbol3));
        //   }
        //
        // })

        function clearup() {
            dict = {};
            dict2 = {};
            oid2lbl = {}
            par2poly = {}
            oid2line = {}

            lblgroup = {}
            lblgroupstart = {}
            lblgroupend = {}

            lblgraphicslayer.graphics.removeAll();
            graphicslayer.graphics.removeAll();
            graphicslayer2.graphics.removeAll();
            view.graphics.removeAll();
            parent.empty();
            var addtitle = '<h3 align="center">Legal Description</h3>';
            parent.append(addtitle);
        }


        function ericJson(jsonData) {
            clearup()
            var dict = jsonData;
            //console.log('jsonData',ejson)
            var addtitle = '<h3 data-toggle="collapse" data-target="#tabapn"><span id = "apncount" class = "badge badge-success">0</span><span id = "apnresults"> Parcels </span></h3>'
            //addtitle = '<h3 align="left">Parcels</h3>';
            parent.append(addtitle);
            var addparcelgroup = '<div id = "tabapn" class="collapse" ></div>'
            parent.append(addparcelgroup);
            var parcelparent = $('#tabapn')
            var pnum = 0;
            var mkey = 'Parcel'
            for (var key in dict) {
                var value = dict[key];
                if (key == "Parcels") {

                    for (var key2 in value) {
                        pnum += 1
                        mkey = 'Parcel' + pnum
                        var addsubtitle = '<h4 data-toggle="collapse" data-target="#tabapn' + pnum + '" class = "headtab" id = "#tabp' + pnum + '"><span id = "apnresults' + pnum + '" class = "ptab" tid = "#tabp' + pnum + '" ppid = "#tabapn' + pnum + '"> Parcel' + pnum + '</span></h4>'
                        var parcelTitle_wordDoc = "<strong>Parcel" + pnum + "</strong>"
                        pDescriptionList.push(parcelTitle_wordDoc)
                        parcelparent.append(addsubtitle);
                        var addparcel = '<div id = "tabapn' + pnum + '" class="atab collapse" ></div>'
                        parcelparent.append(addparcel);
                        var parcelchild = $('#tabapn' + pnum)
                        var dictionary = value[key2][0]['Segments'];
                        var descArea = value[key2][1]['Closure_Report_Segments'];
                        var centroid = value[key2][2]['Centroid'];
                        var oidlist = value[key2][4]['Oidlist'];
                        oid2lbl[mkey] = oidlist
                        var centerx = Number(centroid[0]);
                        var centery = Number(centroid[1]);
                        var ring = value[key2][3]['Polygon'];
                        var poly = new Polygon({
                            rings: ring,
                            spatialReference: view.spatialReference
                        });
                        polylist.push(poly)
                        par2poly[mkey] = poly

                        var pAtt = {
                            apn: '#apnresults' + pnum,
                            tid: "#tabp" + pnum,
                            ppid: '#tabapn' + pnum,
                            pnum: 'Parcel' + pnum
                        };

                        //lblgraphicslayer.graphics.add(lblGraphic);
                        var newGraphic = new Graphic({
                            geometry: poly,
                            attributes: pAtt,
                            symbol: polygonSymbol
                        });

                        //view.graphics.add(newGraphic);
                        graphicslayer.graphics.add(newGraphic);




                        for (var key in dictionary) {
                            // check if the property/key is defined in the object itself, not in parent
                            if (dictionary.hasOwnProperty(key)) {

                                var shapetype = dictionary[key].shapeType;
                                var radtangentstart = dictionary[key].radtangent_start;
                                var radtangentend = dictionary[key].radtangent_end;
                                var bearingRadiusInDMSstart = dictionary[key].annweb_grid_radTanStart;
                                var bearingRadiusInDMSend = dictionary[key].annweb_grid_radTanEnd;
                                var startx = dictionary[key].startx;
                                var starty = dictionary[key].starty;
                                var endx = dictionary[key].endx;
                                var endy = dictionary[key].endy;
                                var words = dictionary[key].desc_ground;
                                //var oid = dictionary[key].coid;
                                var oid = dictionary[key].oid;
                                var wkt = dictionary[key].wkt;
                                var bdlabel = dictionary[key].annweb_ground;
                                var midx = Number(dictionary[key].midx);
                                var midy = Number(dictionary[key].midy);
                                //console.log("mid", midx, midy)
                                var hid = dictionary[key].HandleId;
                                // var mylabel = "<label id=" + oid + " class = 'lblclass' style = 'margin-right:3px'>"+words+" </label>";
                                // var newElement = $(mylabel);
                                // parent.append(newElement);

                                // var signx = Math.sign(centerx - startx);
                                // var signy = Math.sign(centery - starty)
                                // var offx = 0;
                                // var offy = 0;
                                // if (signx===-1){
                                //   console.log('x is positve')
                                //   startx = startx + 3;
                                // } else {
                                //   console.log('x is negative')
                                //   startx = startx - 3;
                                // }
                                // if (signy===-1){
                                //   console.log('y is positve')
                                //   starty = starty + 3;
                                // } else {
                                //   console.log('y is negative')
                                //   starty = starty - 3;
                                // }
                                //
                                // signx = Math.sign(centerx - endx);
                                // signy = Math.sign(centery - endy)
                                // offx = 0;
                                // offy = 0;
                                // if (signx===-1){
                                //   console.log('x is positve')
                                //   endx = endx + 3;
                                // } else {
                                //   console.log('x is negative')
                                //   endx = endx - 3;
                                // }
                                // if (signy===-1){
                                //   console.log('y is positve')
                                //   endy = endy + 3;
                                // } else {
                                //   console.log('y is negative')
                                //   endy = endy - 3;
                                // }

                                // Eric - Concat ground descripton of the segment
                                var segmentDescription_wordDoc = "<div>" + words + "</div>"
                                pDescriptionList.push(segmentDescription_wordDoc)
                                //console.log("==== CONCATENATING: Legal Description ====")
                                //console.log(parcelsDescription)
                                //console.log("==========================================")
                                signx = Math.sign(centerx - midx);
                                signy = Math.sign(centery - midy)
                                offx = 0;
                                offy = 0;
                                if (signx === -1) {
                                    //console.log('x is positve')
                                    midx = midx + 3;
                                } else {
                                    //console.log('x is negative')
                                    midx = midx - 3;
                                }
                                if (signy === -1) {
                                    //console.log('y is positve')
                                    midy = midy + 3;
                                } else {
                                    //console.log('y is negative')
                                    midy = midy - 3;
                                }
                                var point = new Point(midx, midy, view.spatialReference);
                                var lblGraphic = new Graphic({
                                    geometry: point,
                                    symbol: {
                                        type: "text", // autocasts as SimpleFillSymbol
                                        color: "black",
                                        haloColor: "white",
                                        haloSize: "1px",
                                        text: bdlabel,
                                        xoffset: 0,
                                        yoffset: 0,
                                        font: {  // autocast as new Font()
                                            size: 9,
                                            family: "sans-serif",
                                            weight: "bold"
                                        }

                                    }
                                });

                                lblgroup[oid] = lblGraphic;

                                if ((shapetype == 'Curve') && (radtangentstart == "Non-Tangent")) {

                                    var point = new Point(startx, starty, view.spatialReference);
                                    var lblGraphic = new Graphic({
                                        geometry: point,
                                        symbol: {
                                            type: "text", // autocasts as SimpleFillSymbol
                                            color: "black",
                                            haloColor: "white",
                                            haloSize: "1px",
                                            text: bearingRadiusInDMSstart + "\n(Non-Tangent)",
                                            xoffset: 0,
                                            yoffset: 0,
                                            font: {  // autocast as new Font()
                                                size: 9,
                                                family: "sans-serif",
                                                weight: "bold"
                                            }

                                        }
                                    });

                                    lblgroupstart[oid] = lblGraphic;

                                }

                                if ((shapetype == 'Curve') && (radtangentend == "Non-Tangent")) {

                                    var point = new Point(endx, endy, view.spatialReference);
                                    var lblGraphic = new Graphic({
                                        geometry: point,
                                        symbol: {
                                            type: "text", // autocasts as SimpleFillSymbol
                                            color: "black",
                                            haloColor: "white",
                                            haloSize: "1px",
                                            text: bearingRadiusInDMSend + "\n(Non-Tangent)",
                                            xoffset: 0,
                                            yoffset: 0,
                                            font: {  // autocast as new Font()
                                                size: 9,
                                                family: "sans-serif",
                                                weight: "bold"
                                            }

                                        }
                                    });

                                    lblgroupend[oid] = lblGraphic;
                                }
                                // var pAtt = {
                                //   legal: words,
                                //   oid: oid
                                // };

                                //lblgraphicslayer.graphics.add(lblGraphic);
                                // var newGraphic = new Graphic({
                                //        geometry: poly,
                                //        symbol: polygonSymbol
                                //      });

                                //view.graphics.add(newGraphic);
                                //graphicslayer.graphics.add(newGraphic);
                                var myAtt = {
                                    legal: words,
                                    oid: oid,
                                    hid: hid
                                };

                                function createFeature(path) {

                                    var myline = new Polyline({
                                        paths: path,
                                        spatialReference: { wkid: 2230 }
                                    });

                                    dict2[oid] = myline;
                                    dict[oid] = words;
                                    hiddict[oid] = hid;



                                    var mylabel = "<label id=" + oid + "  hid = '" + hid + "'  class = 'lblclass' pid = '#apnresults" + pnum + "' style = 'margin-right:3px'>" + words + " </label>";
                                    var newElement = $(mylabel);
                                    parcelchild.append(newElement);

                                    var a = oidlist.indexOf(oid);
                                    //console.log('a', a, oid)
                                    var color;

                                    if (a == 0) {
                                        color = 'blue'
                                    } else {
                                        var num = a % 2
                                        if (num == 1) {
                                            color = 'orange'
                                        } else {
                                            color = 'green'
                                        }
                                    }

                                    var mygraphic = new Graphic({
                                        geometry: myline,
                                        attributes: myAtt,
                                        symbol: {
                                            type: "simple-line",
                                            color: color,
                                            width: 3
                                        }
                                    });

                                    oid2line[oid] = mygraphic
                                    mygraphic = new Graphic({
                                        geometry: myline,
                                        symbol: {
                                            type: "simple-line",
                                            color: 'red',
                                            width: 1.5
                                        }
                                    });
                                    //graphicslayer.graphics.add(mygraphic);

                                }

                                var str = wkt
                                //console.log('Str1', str)
                                str = str.replace("MULTILINESTRING Z ((", "").replace('))', '')
                                //console.log('str2', str, shapetype)

                                if (shapetype == 'Line') {
                                    //console.log('Line')
                                    var x = str.split(',')[0].split(' ')[0]
                                    var y = str.split(',')[0].split(' ')[1]
                                    var x2 = str.split(',')[1].split(' ')[1]
                                    var y2 = str.split(',')[1].split(' ')[2]
                                    var path = [[x, y, 0], [x2, y2, 0]]

                                    createFeature(path);
                                } else if (shapetype == 'Curve') {
                                    var cstr = str.split(', ')
                                    //console.log('Curve', cstr)
                                    var item1 = []
                                    cstr.forEach(function (item) {
                                        var item2 = []
                                        var item3 = item.split(' ')
                                        //console.log('item3', item3)
                                        item3.forEach(function (itemx) {
                                            var num = Number(itemx)
                                            //console.log(itemx, num)
                                            item2.push(num)

                                        })
                                        item1.push(item2)
                                    })

                                    createFeature(item1);
                                }

                            }
                        }

                        var descArealabel = "<label class = 'lblclass' style = 'margin-right:3px'>" + descArea['desc_area'] + " </label>";
                        var descAreaElement = $(descArealabel);
                        parcelchild.append(descAreaElement);
                    }
                }
            }
            $('#apncount').text(pnum)
            lblgraphicslayer.when(function () {
                view.goTo(polylist, {
                    zoom: 10
                });
            });
        }

        ericJson(jsonData)
        // $("#runEric").click(function() {
        //   ericJson()
        // });



        $("#uploadcadbtn").click(function () {
            myUpload();
        });

        $('#reset-map').css('display', 'block');
        $("#reset-map").click(function () {
            clearup();
            //console.log('reset clicked')
            //remove existing graphic


        });

        // Eric - trigger function to generate word doc
        $(document).on("click", "#downloadWordDoc", function () {
            //console.log("downloadWordDoc triggered", pDescriptionList)
            parcelsDescription = pDescriptionList.join("");
            //console.log(parcelsDescription, pDescriptionList.toString())
            Export2Doc(parcelsDescription);
        })

        // Eric - Selecting legal description label will highlight the label and the row from the table;
        // also create an overlay on esri map and on forge viewer while zooming in.
        var lastgeo;
        $(document).on("click", ".lblclass", function () {
            // hover starts code here
            var oid = $(this).attr("id");
            var hid = $(this).attr("hid");

            // Get the instance of the extension.
            var overLayGeometryExtension = viewer.getExtension('OverLayGeometry')
            overLayGeometryExtension.searchSelectedObj(hid)

            // This approach is getting the definition, not the instance of the extension.
            // console.log(Autodesk.Viewing.theExtensionManager.getExtensionClass('MyOverLayGeo'))

            // Eric - Call Function to zoom in to object on viewer.
            executeFitToViewHandleId(hid);


            lastgeo = '';

            $("label").css("background-color", "white");
            $(".main-parent-row").css("background-color", "white");
            $("tr:nth-child(even)").css("background-color", "#17a2b8");
            $("tr[dataOId=" + oid + "]").css("background-color", "cyan");
            $(this).css("background-color", "cyan");
            var myline = dict2[oid]
            var mygraphic = new Graphic({
                geometry: myline,
                symbol: lineSymbol
            });
            view.graphics.removeAll();
            view.graphics.add(mygraphic);
        });

        // Eric - Selecting a row “tr” from data table highlights the row and legal description label, 
        // also create an overlay on esri map and on forge viewer while zooming in.
        $(document).on("click", ".geometry-type", function () {
            var oid = $(this).attr('dataOId')
            var handleIdFromElementAttribute = $(this).attr('dataHId')

            // Get the instance of the extension.
            var overLayGeometryExtension = viewer.getExtension('OverLayGeometry')
            overLayGeometryExtension.searchSelectedObj(handleIdFromElementAttribute)

            // Eric - Call Function to zoom in to object on viewer.
            executeFitToViewHandleId(handleIdFromElementAttribute)

            lastgeo = '';

            $("label").css("background-color", "white");
            $(".main-parent-row").css("background-color", "#fff");
            $("tr:nth-child(even)").css("background-color", "#17a2b8");
            $("label[id=" + oid + "]").css("background-color", "cyan");
            $(this).css("background-color", "cyan");
            var myline = dict2[oid]
            var mygraphic = new Graphic({
                geometry: myline,
                symbol: lineSymbol
            });
            view.graphics.removeAll();
            view.graphics.add(mygraphic);
        })

        $(document).on("click", ".ptab", function () {
            view.graphics.removeAll();
            lblgraphicslayer.graphics.removeAll();
            $(".lblclass").css("background-color", "white");
            $(".ptab").css("background-color", "white");
            $(".atab").removeClass("show");
            $(".headtab").addClass("collapsed");
            $(this).css("background-color", "cyan");
            var parcel = $(this).text().trim();
            if (parcel == 'Parcel1') {
                //console.log('MAtch')
                console.log(parcel, par2poly[parcel])
            }

            view.graphics.removeAll();
            graphicslayer2.graphics.removeAll();
            var oidlist = oid2lbl[parcel]
            oidlist.forEach(function (item) {
                //console.log(item)
                graphicslayer2.graphics.add(oid2line[item]);

                lblgraphicslayer.graphics.add(lblgroup[item]);
                if (lblgroupstart[item]) {
                    lblgraphicslayer.graphics.add(lblgroupstart[item]);
                }
                if (lblgroupend[item]) {
                    lblgraphicslayer.graphics.add(lblgroupend[item]);
                }
            })
            var newGraphic = new Graphic({
                geometry: par2poly[parcel],
                symbol: polygonSymbol
            });

            //view.graphics.add(newGraphic);
            //graphicslayer2.graphics.add(newGraphic);
        });

        // $(document).on("mouseleave", ".lblclass", function() {
        //     // hover ends code here
        //     console.log('something');
        //     $(this).css("background-color", "white");
        //     view.graphics.removeAll();
        // });
        view.on("hold", function (event) {
            // view.graphics.removeAll();
            // $( ".lblclass" ).css("background-color", "white");
            lastgeo = ''
            view.hitTest(event).then(function (response) {
                const graphic = response.results.filter(function (result) {
                    if (result.graphic.layer === graphicslayer) {
                        //console.log('Maybe poly')
                    }
                    return result.graphic.layer === graphicslayer;
                })[0].graphic;
                //console.log('Graphic', graphic)
                var apn = graphic.attributes.apn;
                //console.log('apn', apn)
                $(apn).click();


            })
        });


        view.on("pointer-down", function (event) {
            // view.graphics.removeAll();
            // $( ".lblclass" ).css("background-color", "white");
            lastgeo = ''
            view.hitTest(event).then(function (response) {
                const graphic = response.results.filter(function (result) {
                    if ((result.graphic.layer === graphicslayer) && (result.graphic.layer !== graphicslayer2)) {
                        //console.log('Mapbe poly')
                    }
                    return result.graphic.layer === graphicslayer2;
                })[0].graphic;
                var attribute = graphic.attributes;
                var hid = attribute.hid;
                var overLayGeometryExtension = viewer.getExtension('OverLayGeometry')
                if (hid) {
                    // Call Function to zoom in to object on viewer.
                    executeFitToViewHandleId(hid);

                    overLayGeometryExtension.searchSelectedObj(hid)
                }

                var geo = graphic.geometry;
                view.graphics.removeAll();
                $(".lblclass").css("background-color", "white");
                $(".ptab").css("background-color", "white");
                $(".atab").removeClass("show");
                $(".headtab").addClass("collapsed");


                if (lastgeo !== geo) {
                    lastgeo = geo;
                    //lineSymbol

                    var graphic3 = new Graphic({
                        geometry: geo,
                        symbol: lineSymbol
                    });

                    ////*[@id="87"]

                    view.graphics.add(graphic3);

                    $("#" + attribute.oid).css("background-color", "cyan");
                    var pid = $("#" + attribute.oid).attr("pid");
                    $(pid).css("background-color", "cyan");
                    var ppid = $(pid).attr("ppid");
                    var tid = $(pid).attr("tid");
                    $(ppid).addClass("show");
                    $(tid).removeClass("collapsed");
                    $(tid).attr("aria-expanded", "true")
                    //console.log('pid', pid, ppid)
                    // $(pid)[0].scrollIntoView({
                    //     behavior: "smooth", // or "auto" or "instant"
                    //     block: "start" // or "end"
                    // });
                    $(pid)[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "start" // or "end"
                    });
                    $("#" + attribute.oid)[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "start" // or "end"
                    });

                    // if (attribute.oid === 'lbl0'){
                    //   $( "#lbl0" ).css("background-color", "cyan");
                    //   $( "#lbl1" ).css("background-color", "white");
                    // } else if (attribute.oid === 'lbl1'){
                    //   $( "#lbl1" ).css("background-color", "cyan");
                    //   $( "#lbl0" ).css("background-color", "white");
                    // }
                } else {
                    //console.log('Same');
                }




            })
        });
    });
}

function makex() {
    //console.log('makex:true')
    findposition = true;
    view.surface.style.cursor = "crosshair";
    $("#reset-map").click();

}

$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#map_region').toggleClass('active');
    });

    //$("p").click(function(){
    //  alert("The paragraph was clicked.");
    //});

    $("#drop-area").addClass("d-none")
    $("#viewDiv").removeClass("d-none")
    //$("#upload-cad-file").removeClass("d-none")
});
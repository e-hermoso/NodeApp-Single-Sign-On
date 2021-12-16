function Export2Doc(htmlParcelDesc) {
    console.log("From WordDoc.js")
    //var element2 = "<div id='tabapn1' class='atab collapse in' aria-expanded='true' style=''><label id='1' hid='2573b' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>BEGINNING at South 43°12'42' East, 14.00 feet; </label><label id='2' hid='2573a' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence South 46°47'19' West, 25.38 feet; </label><label id='3' hid='25739' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence North 43°14'03' West, 25.92 feet; </label><label id='4' hid='25738' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence North 43°14'03' West, 80.30 feet; </label><label id='5' hid='2572e' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence North 46°47'19' East, 482.28 feet, </label><label id='6' hid='2572f' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'> to the beginning of a non-tangent curve, concave northeasterly, and having a radius of 1449.91 feet, a radial line to said beginning of curve bears South 56°42'54' West; Thence southeasterly along said curve 77.98 feet through a central angle of 3°04'53'; </label><label id='7' hid='25732' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence non-tangent to said curve South 57°17'28' West, 10.02 feet; </label><label id='8' hid='25731' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence South 57°17'26' West, 23.18 feet; </label><label id='9' hid='25730' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence South 57°17'27' West, 47.57 feet, </label><label id='10' hid='25734' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'> to the beginning of a non-tangent curve, concave northwesterly, and having a radius of 599.94 feet, a radial line to said beginning of curve bears South 65°14'41' East; Thence southwesterly along said curve 230.71 feet through a central angle of 22°02'01'; </label><label id='11' hid='25735' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence tangent to said curve South 46°47'19' West, 56.00 feet; </label><label id='12' hid='25736' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence North 43°12'41' West, 14.00 feet; </label><label id='13' hid='25737' class='lblclass' pid='#apnresults1' style='margin-right: 3px; background-color: white;'>Thence South 46°47'19' West, 85.00 feet,to the POINT OF BEGINNING </label></div>"
    //var element = " This is a <strong>test document</strong>. Please click on <a href='https://www.ocgis.com/OCPW/Services/OCSurvey/Document/ShowDoc?DocNum=CR%202017-3173&type=CR#page=2'>CR 2017-3173</a>"
    //console.log(element)
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    //  var html = preHtml+document.getElementById(element).innerHTML+postHtml;


    var html = preHtml + htmlParcelDesc + postHtml;


    var blob = new Blob(['\ufeff', html], {
        type: 'applicationvnd.ms-word;charset=utf-8'
    });
    // Specify link url
    var filename = 'docFM'
    // Specify file name
    filename = filename ? filename + '.doc' : 'document.doc';
    window.saveAs(blob, filename);

    // Create download link element
}
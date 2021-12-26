/************************************************************************
 *  turtleConsoleDrag -- javascript for the turtle graphic language console
 *
 *  Modified from
 *  Copyright (c) 2015-2019 Kirk Carlson
 *  MIT license
 ************************************************************************/


if (window.addEventListener) {
    window.addEventListener("resize", fixDragButton);
} else if (window.attachEvent) {
    window.attachEvent("onresize", fixDragButton);
}

document.getElementById("body").onresize=fixDragButton;

/*************************************************************************
 * onWindowLoad -- handler for when window loads
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function onWindowLoad() {
    fixDragButton()
    // check if an example was requested in the URL
    var queryString = window.location.search; // was "?..." specified
    if (queryString != undefined && queryString != "") {
        var exampleValue = ""
        var command = ""
        var pos = 0
        //queryString = queryString.substr(1) // get rid of leading '?'... simple case
        // want to (queryStrint + "&").search (/[?&]example=[^=]&/)
        // no want to split string up into separate queries... divide on &
        queries = queryString.split('&')
        console.log("queries was: " + queries + ", " + typeof(queries))
        // check specific queries like
        if (queries != undefined && queries.length > 0) {
            for (var i=0; i<queries.length; i = i+1) {
                pos = queries[i].search(/^\??example=/)
//want to change 'code' to 'exampleValue'
// exampleOption ...name that is displayed
// exampleValue ... example string name ,,, its value is the string itself
                if (pos >=0) {
                    console.log( "ind: " + queries[i] + ", " + typeof(queries[i]))
                    pos = queries[i].indexOf('=')
                    if (pos > 0 && pos < queries[i].length) {
                        exampleValue = queries[i].substr(pos + 1)
                        console.log("example query was: " + exampleValue + ".")
                    } else {
                        console.log("example query was null")
                    }
                }
                pos = queries[i].search(/^\??command=/)
                if (pos >=0) {
                    pos = queries[i].indexOf('=')
                    if (pos > 0 && pos < queries[i].length) {
                        command = queries[i].substr(pos + 1)
                        console.log("command query was: " + command + ".")
                    } else {
                        console.log("command query was null")
                    }
                }
                pos = queries[i].search(/^\??codeblock=/)
                if (pos >=0) {
                    pos = queries[i].indexOf('=')
                    if (pos > 0 && pos < queries[i].length) {
                        codeBlock = queries[i].substr(pos + 1)
                        codeBlock = decodeURIComponent(codeBlock)
                        codeBlock = he.decode(codeBlock)
                        document.getElementById('codeArea').value = codeBlock
                    } else {
                        console.log("command query was null")
                    }
                }
            }

            if (exampleValue != undefined && exampleValue != "") {
                sel = document.getElementById('examples') // post to examples selector
                sel.value = exampleValue; // set selector to requested string
                //... onchange hander should take over

                console.log("sel.value: " + sel.value + ".")
                if (sel.value !== undefined && sel.value !== "") {
                    console.log("almost in it now")
                    try {
                        document.getElementById('codeArea').value = eval(examples.value);
                    } catch (e) {
                        showError(e)
                    }

                    if (command !== undefined || command !== "") { // good enough validation??
                        console.log("in it now")
                        cmd ("demo()");
                    }
                    console.log("passed it")
                    commandChanged()
                }
            }
        }
    }
}


var draggingleft = false;
var draggingright = false;

/*************************************************************************
 * fixDragButton -- handler to fix the drag buttons
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function fixDragButton() {
    //console.log("fixDragButton")

    var w = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth; // variations for cross browser support

    var h = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight; // variations for cross browser support

    if (w < 12000) {
        var overallWidth = w;
    } else {
        var overallWidth = 1200;
    }

    // work area height
    var overallHeight = h /* guessed margin */;
    var workAreaHeight = h -4 ; /* - 50 /*top displacement* / - 17 /* guessed margin? */;
    if (workAreaHeight < 400) {
        var canvasHeight = 300;
    } else {
        var canvasHeight = workAreaHeight - 140 /* APPROXIMATION space for controls */;
    }

    var wrapWidth = overallWidth - 2; //leftcolWidth + midcolWidth + rightcolWidth;


    var referencewidth, refLeftPadding , dragleft, containertop, dropbarwidthleft, dropbarwidthright

    var containertop = Number(getStyleValue(document.getElementById("container"), "top").replace("px", ""));

    var wrapElement = document.getElementById("wrap");
    wrapElement.style.width = wrapWidth + "px";
    wrapElement.style.height = overallHeight + "px";

    /* dragbar setup*/

    /* left setup */
    var refElement = document.getElementById("reference");
    var leftcolElement = document.getElementById("leftcolumn")

    referenceWidth = Number(getStyleValue(document.getElementById("referencewrapper"), "width").replace("px", ""));
    var refTitleHeight = Number(getStyleValue(document.getElementById("referenceTitle"), "height").replace("px", ""));
    var refLeftPadding = Number(getStyleValue(document.getElementById("reference"), "padding-left").replace("px", ""));

    /* center setup */
    midWidth = getStyleValue(document.getElementById("canvaswrapper"), "width").replace("px","");
    midContainerHeight = getStyleValue(document.getElementById("midcolumncontainer"), "height").replace("px","");
    midLeftPadding = getStyleValue(document.getElementById("canvaswrapper"), "padding-left").replace("px","");
    midRightPadding = getStyleValue(document.getElementById("canvaswrapper"), "padding-right").replace("px","");
    canvasTitleHeight = getStyleValue(document.getElementById("canvastitle"), "height").replace("px","");
    commandWrapperHeight = getStyleValue(document.getElementById("commandwrapper"), "height").replace("px","");
    var canvasHeight = midContainerHeight - canvasTitleHeight - commandWrapperHeight -25;
    var canvasWidth = midWidth - midLeftPadding - midRightPadding;

    /* right setup */
    exampleWidth = Number(getStyleValue(document.getElementById("examplewrapper"), "width").replace("px", ""));
    examplesHeight = Number(getStyleValue(document.getElementById("examples"), "height").replace("px", "")); // basically the select height
    examplesMarginTop = Number(getStyleValue(document.getElementById("examples"), "margin-top").replace("px", "")); // around select height
    examplesMarginBottom = Number(getStyleValue(document.getElementById("examples"), "margin-bottom").replace("px", "")); // around select height

    var rightcolElement = document.getElementById("rightcolumn");
    var codeAreaElement = document.getElementById("codeArea");
    var codeAreaRightPadding = Number(getStyleValue(document.getElementById("codeArea"), "padding-right").replace("px", ""));

    /* dragbar attribute setting */
    document.getElementById("dragbarleft").style.width = "5px";
    document.getElementById("dragbarright").style.width = "5px";

    dropbarwidthleft = Number(getStyleValue(document.getElementById("dragbarleft"), "width").replace("px", ""));
    dropbarwidthright = Number(getStyleValue(document.getElementById("dragbarright"), "width").replace("px", ""));

    dragleft = referenceWidth + refLeftPadding + (refLeftPadding / 2) - (dropbarwidthleft / 2);
    dragright = exampleWidth + codeAreaRightPadding + (codeAreaRightPadding / 2) + (dropbarwidthright / 2);

    document.getElementById("dragbarleft").style.top = containertop + "px";
    document.getElementById("dragbarleft").style.left = dragleft + "px";
    document.getElementById("dragbarleft").style.height = workAreaHeight + "px";/*referenceheight;*/
    document.getElementById("dragbarleft").style.cursor = "col-resize";

    document.getElementById("dragbarright").style.top = containertop + "px";
    document.getElementById("dragbarright").style.right = dragright + "px";
    document.getElementById("dragbarright").style.height = workAreaHeight + "px";/*referenceheight;*/
    document.getElementById("dragbarright").style.cursor = "col-resize";


    /* left attribute setting */

    refElement.style.height = workAreaHeight - refTitleHeight -10 + "px";
    leftcolElement.style.height = workAreaHeight + "px";
    //console.log ("overallheight",overallHeight, "workAreaHeight", workAreaHeight)


    /* center attribute setting */
    imagecanvas.width = canvasWidth;
    imagecanvas.height = canvasHeight;
    turtlecanvas.width = canvasWidth;
    turtlecanvas.height = canvasHeight;
    document.getElementById("canvaswrapper").style.height = canvasHeight +8+ "px";
    //console.log("midWidth:", midWidth, midLeftPadding, midRightPadding);

    var midcolElement = document.getElementById("midcolumn")
    midcolElement.style.height = workAreaHeight + "px";


    /* right attribute setting */

    rightcolElement.style.height = workAreaHeight + "px";
    codeAreaElement.style.height = (workAreaHeight - examplesHeight - examplesMarginTop - examplesMarginBottom - 45) + "px";

}

/*************************************************************************
 * dragStartLeft -- handler for start of drag with left button
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function dragstartleft(e) {
    e.preventDefault();
    draggingleft = true;
}

/*************************************************************************
 * dragStartRight -- handler for start of drag with right button
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function dragstartright(e) {
    e.preventDefault();
    draggingright = true;
}

/*************************************************************************
 * dragMove -- handler for moving a drag button
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function dragmove(e) {
    if (draggingleft)
    {
        var rect = document.getElementById("dragbarright").getBoundingClientRect();
        //console.log("dragBarRight:", rect.top, rect.right, rect.bottom, rect.left);
        //console.log("window width:", window.innerWidth);
        var rightPercentage = 100 - (rect.left / window.innerWidth) * 100;

        leftPercentage = (e.pageX / window.innerWidth) * 100;
        if (leftPercentage > 1 && leftPercentage < 98) {
            var centerPercentage = 100-leftPercentage-rightPercentage;
            //console.log("left:", leftPercentage, centerPercentage, rightPercentage);
            document.getElementById("leftcolumncontainer").style.width = leftPercentage + "%";
            document.getElementById("midcolumncontainer").style.width = centerPercentage + "%";
            fixDragButton();
        }
    }

    if (draggingright)
    {
        var rect = document.getElementById("dragbarleft").getBoundingClientRect();
        //console.log("dragBarLeft:", rect.top, rect.right, rect.bottom, rect.left);
        //console.log("width:", window.innerWidth);
        var leftPercentage = (rect.right / window.innerWidth) * 100;
        //console.log("leftPercentage:", leftPercentage);

        var rightPercentage = 100 - (e.pageX / window.innerWidth) * 100;
        //console.log("rightPercentage:", rightPercentage);

        if (rightPercentage > 1 && rightPercentage < 98 - leftPercentage) {
            var centerPercentage = 100-rightPercentage-leftPercentage;
            //console.log("right:", leftPercentage, centerPercentage, rightPercentage);
            document.getElementById("rightcolumncontainer").style.width = rightPercentage + "%";
            document.getElementById("midcolumncontainer").style.width = centerPercentage + "%";
            fixDragButton();
        }
    }
}


/*************************************************************************
 * dragEnd -- handler for ending a drag move
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function dragend() {
    draggingleft = false;
    draggingright = false;
    if (window.editor) {
        window.editor.refresh();
    }
}


if (window.addEventListener) {
    document.getElementById("dragbarleft").addEventListener("mousedown", function(e) {dragstartleft(e);});
    document.getElementById("dragbarleft").addEventListener("touchstart", function(e) {dragstartleft(e);});
    document.getElementById("dragbarright").addEventListener("mousedown", function(e) {dragstartright(e);});
    document.getElementById("dragbarright").addEventListener("touchstart", function(e) {dragstartright(e);});
    window.addEventListener("mousemove", function(e) {dragmove(e);});
    window.addEventListener("touchmove", function(e) {dragmove(e);});
    window.addEventListener("mouseup", dragend);
    window.addEventListener("touchend", dragend);
    window.addEventListener("load", onWindowLoad);
}

/*************************************************************************
 * getStyleValue -- function
 *
 * arguments:
 *   elmnt: (object) pointer to object
 *   style: (string) name of the requested style
 *
 * returns:
 *   element style (string)
 *************************************************************************/

function getStyleValue(elmnt,style) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elmnt,null).getPropertyValue(style);
    } else {
        return elmnt.currentStyle[style];
    }
}

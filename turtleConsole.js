/************************************************************************
 *  turtleConsole -- javascript for the turtle graphic language console
 *
 *  Copyright (c) 2015-2019 Kirk Carlson
 *  MIT license
 ************************************************************************/
//console.log("Starting up")

//**GLOBALS***
var helpTextActive = true;
var errorFound = false;


/*************************************************************************
 * onWindowLoad -- handler for when window loads
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/

if (window.addEventListener) {
    window.addEventListener("load", resizeSketchWrapper);
	window.addEventListener("resize", resizeSketchWrapper);
}


/*************************************************************************
 * resizeSketchWrapper -- resize the central column so the turtle canvas 
 *                        is correctly sized and behaves properly.
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function resizeSketchWrapper() {
    console.log("resizeSketchWrapper")


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


    /* center setup */
	var margin = 5;
	
    //var sketchWrapperWidth = getStyleValue(document.getElementById("sketchwrapper"), "width").replace("px","");
	var sketchWrapperHeight = getStyleValue(document.getElementById("sketchwrapper"), "height").replace("px","");
	
	var sketchAreaWidth = getStyleValue(document.getElementById("sketcharea"), "width").replace("px","");
	//var sketchAreaHeight = getStyleValue(document.getElementById("sketcharea"), "height").replace("px","");
	var sketchAreaLeftPadding = getStyleValue(document.getElementById("sketcharea"), "padding-left").replace("px","");
	var sketchAreaRightPadding = getStyleValue(document.getElementById("sketcharea"), "padding-right").replace("px","");
	var sketchAreaLeftMargin = getStyleValue(document.getElementById("sketcharea"), "margin-left").replace("px","");
	var sketchAreaRightMargin = getStyleValue(document.getElementById("sketcharea"), "margin-right").replace("px","");
	
	var sketchTitleHeight = getStyleValue(document.getElementById("sketchtitle"), "height").replace("px","");
	
	//var canvasWidth = getStyleValue(document.getElementById("canvaswrapper"), "width").replace("px","");
	//var canvasHeight = getStyleValue(document.getElementById("canvaswrapper"), "height").replace("px","");
	//var canvasMargin = getStyleValue(document.getElementById("canvaswrapper"), "margin").replace("px","");
	//var canvasPadding = getStyleValue(document.getElementById("canvaswrapper"), "padding").replace("px","");
	
	//var commandWidth = getStyleValue(document.getElementById("commandwrapper"), "width").replace("px","");
	var commandHeight = getStyleValue(document.getElementById("commandwrapper"), "height").replace("px","");
	//var commandMargin = getStyleValue(document.getElementById("commandwrapper"), "margin").replace("px","");
	//var commandPadding = getStyleValue(document.getElementById("commandwrapper"), "padding").replace("px","");
	
	
	
	
    var canvasHeight = sketchWrapperHeight - sketchTitleHeight - commandHeight - 50;
    var canvasWidth  = sketchAreaWidth - 20;

	console.log("sketchWrapperHeight",sketchWrapperHeight);
	console.log("sketchAreaWidth",sketchAreaWidth);
	console.log("sketchAreaLeftPadding",sketchAreaLeftPadding);
	console.log("sketchAreaRightPadding",sketchAreaRightPadding);
	console.log("commandHeight",commandHeight);
	console.log("canvasHeight",canvasHeight);
	console.log("canvasWidth",canvasWidth);
	
    /* center attribute setting */
    imagecanvas.width = canvasWidth;
    imagecanvas.height = canvasHeight;
    turtlecanvas.width = canvasWidth;
    turtlecanvas.height = canvasHeight;
    document.getElementById("canvaswrapper").style.height = canvasHeight +8+ "px";
    
	console.log("==");
	console.log("imagecanvas",imagecanvas.width, imagecanvas.height);
	console.log("turtlecanvas",turtlecanvas.width, turtlecanvas.height);
	
	
	/* organise the right column */
    var commandsHeight = getStyleValue(document.getElementById("commandswrapper"), "height").replace("px","");
	var commandsWidth = getStyleValue(document.getElementById("commandswrapper"), "width").replace("px","");
	var commandsAreaWidth = getStyleValue(document.getElementById("commandsarea"), "width").replace("px","");
	
	
	var commandsButtonsHeight = getStyleValue(document.getElementById("commandsbuttons"), "height").replace("px","");
	var commandTitleHeight = getStyleValue(document.getElementById("commandstitle"), "height").replace("px","");
	
	var commandsTextHeight = commandsHeight-commandsButtonsHeight-commandTitleHeight-50;
	var commandsTextWidth = commandsAreaWidth-20;
	
	document.getElementById("commandslist").style.height = commandsTextHeight+ "px";
    document.getElementById("commandslist").style.width = commandsTextWidth+ "px";
    
	reset();
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




//SUPPORT FUNCTIONS
/************************************************************************
 * cmd -- put text into the command box
 *
 * arguments:
 *   text: (string) string to put into the command box
 *
 * returns:
 *   None
 ************************************************************************/
function cmd (text) {
  document.getElementById("command").value=text;
}

//EVENT PROCESSING FUNCTIONS


// set up command field to accept an ENTER without field modification
var command = document.getElementById("command");
if (command.addEventListener) {
    command.addEventListener("keypress", function(e) {
        if (e.keyCode === 13) {
            commandChanged();
            e.preventDefault();
        }
    }, false);
} else if (command.attachEvent) {
    command.attachEvent("onkeypress", function(e) {
        if (e.keyCode === 13) {
            commandChanged();
            return e.returnValue = false;
        }
    });
}

/*************************************************************************
 * resetClicked -- handler for when the reset button is clicked
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function resetClicked() {
    reset();
	
	document.getElementById("commandslist").value="";
	
}

/*************************************************************************
 * runClicked -- handler for when the run button is clicked
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
/*
function runClicked() {
    cmd ("demo()");
    commandChanged();
}
*/

/*************************************************************************
 * uploadChanged(e) -- handler for when the upload file name changes
 *
 * arguments:
 *   e: (element object) input file element that has changed
 *
 * returns:
 *   None
 *************************************************************************/
 /*
function uploadChanged(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('codeArea').value = e.target.result;
    };
    reader.readAsText(file);
}


var get_blob = function() {
   return Blob;
}
*/
/*************************************************************************
 * downloadClicked -- handler for when the download button is clicked
 *
 * arguments:
 *   None
 *
 * returns:
 *   false to prevent further processing
 *************************************************************************/
/*
function downloadClicked(e) {
    e.preventDefault();
    var BB = get_blob();
    saveAs(
        new BB(
            [codeArea.value || codeArea.placeholder]
            , {type: "text/plain;charset=" + document.characterSet}
        )
        , (downloadFilename.value || downloadFilename.placeholder) + ".js"
    );
    return false;
}
*/

/*************************************************************************
 * svgDownloadClicked -- handler for when the SVG download button is clicked
 *
 * arguments:
 *   None
 *
 * returns:
 *   false to prevent further processing
 *************************************************************************/
 
function svgDownloadClicked(e) {
/*
    e.preventDefault();
    svgClose();
    var BB = get_blob();
    saveAs(
        new BB(
            svgBlob, {type: "text/plain;charset=" + document.characterSet}
        )
        , (downloadFilename.value || downloadFilename.placeholder) + ".svg"
    );
*/
    return false;
}


/*************************************************************************
 * saveCanvasClicked -- handler for when the save canvas button is clicked
 *
 * arguments:
 *   None
 *
 * returns:
 *   false to prevent further processing
 *************************************************************************/
 /*
function saveCanvasClicked(e) {
    e.preventDefault();
    var BB = get_blob();
    saveAs(
        new BB(
            [codeArea.value || codeArea.placeholder]
            , {type: "text/plain;charset=" + document.characterSet}
        )
        , "turtleGraphic.png"
    );
    return false;
}
*/

/*************************************************************************
 * clearClicked -- handler for when the clear button is clicked
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
 
function clearClicked() {
    //console.log("clear clicked")
    document.getElementById("codeArea").value = "";
}

/*
// Set up all color button elements to be linked and have onclick functionality
var codeElements = document.querySelectorAll ("#reference button");
for (var i=0; i< codeElements.length; i++) {
    //console.log(codeElements[i].id)
    codeElements[i].onclick = function () {
        cmd ("color(\"" + this.id +"\");");
        commandChanged();
    }
}
*/

//INITITALIZATION FUNCTIONS


document.getElementById("command").onchange=commandChanged;

/*
--
on window load:
should the code auto run or not...
yes for the examples
yes for the samples
no for codeblock... override with command=demo()
on window load?
   not loaded with examples
   reloaded with with samples
   reloaded with codeblock
                  document.getElementById('codeArea').value = eval(sel.value);
                    eval (document.getElementById("codeArea").value);
                      console.log("eval \"demo()\"")
                      eval ("demo();");
                //eval (document.getElementById("codeArea").value);
                //  eval (command + "();");
        //document.getElementById('codeArea').value = eval(sel.value);

examples
kirk

*/


//**************************************
//*****                           ******
//*****  BEWARE THE EVIL EVAL!!!  ******
//*****                           ******
//**************************************
//*** Boys and girls please don't use eval() functions at home. In general
//*** the evals are evil because 'anything' can be entered by the user and
//*** executed. This includes changing variables and functions. Things
//*** will break. Most problems can be overcome by reloading the page.
//*** eval is useful for this type of web page because we need the student
//*** to enter, try, and experiment with code. That is the point of all this.


/*************************************************************************
 * examplesChanged -- handler for when the example select changed
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/

function examplesChanged () {
    stopAnimation()
    var codeArea = document.getElementById('codeArea')
    var examples = document.getElementById('examples')
    try {
        codeArea.value = eval(examples.value);
    } catch (e) {
        showError(e)
    }
    cmd ("demo()");
    commandChanged()
}


/*************************************************************************
 * commandChanged -- handler for when the command box is changed
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function commandChanged () {
    var commandElem = document.getElementById("command");
    var commandText = commandElem.value;
    errorFound = false

    // execute the code in the command box
	try {
		console.log("cC cmd: " + commandText + ".")
		eval(commandText);
		addToCommandList(commandText);
	} catch(e) {
		errorFound = true
		showError(e)
	} finally {
		// clear the command box
		commandElem.value = "";
	}
}



function addToCommandList(command){
	const commandList = document.getElementById("commandslist");
	var text = commandList.value;
	
	if (text!=""){
		text = text+"\n"+command;
	}
	else {
		text = command;
	}
	
	commandList.value = text;
}

function clearCommandList(){
	document.getElementById("commandslist").value="";
}

function runCommandList(reset = true){
	
	if(reset){
		reset();
	}
	
	var commands = commandList.split("\n");
	
	commands.forEach( command => eval(commandText));
	
}

function runNoResetCommandList(){
	runCommandList(false);
}


document.getElementById("runresetButton").addEventListener("click", runCommandList);
document.getElementById("runButton").addEventListener("click", runNoResetCommandList);



/*************************************************************************
 * showErrors -- show the trapped errors on the canvas
 *
 * arguments:
 *   e: (error object) error object
 *
 * returns:
 *   None
 *************************************************************************/
function showError(e) {
    //logTurtle("sEtop")
    saveTurtleState(turtleState)
    imageContext.save();
    //turtleState = turtle;
    //logTurtle("sEtop")
    height=10 // points
    goto (minX(), minY()+24+height/2 +2);
    angle(90);
    wrap(false);

    // clear the line for the error message
    penDown()
    color ("yellow")
    width (height+4)
    forward (maxY() * 2)
    goto (minX(), minY()+24)

    // write the error message
    color("red");
    setfont (height + "pt bold Helvetica, sans-serif")
    write(e.name + ": " + e.message);
    console.log(e.name + ": " + e.message);
    if (e.filename !== undefined) {

        // clear the line for the file message
        height=10 // points
        color ("yellow")
        width (height+4)
        goto (minX(), minY()+5+height/2 +2)
        forward (maxY() * 2)

        // write the file message
        color("blue");
        setfont (height + "pt bold Helvetica, sans-serif")
        goto (minX(), minY()+5)
        write(e.fileName.substr(-40) + " line: " + e.lineNumber);
        console.log("Error: " + e.fileName.substr(-40) + " line: " + e.lineNumber);
  }
  draw()
  restoreTurtleState(turtleState)
  imageContext.restore();
  draw()
  //logTurtle("sEbot")
}


/*************************************************************************
 * twoDigits -- convert a number to a two digit string
 *
 * arguments:
 *   None
 *
 * returns:
 *   None
 *************************************************************************/
function twoDigits(n) {
  n = n % 100; //in case over 100
  if (n <10) {
    n = "0" + n
  }
  return n
}

// set up the control buttons
document.getElementById("resetButton").onclick=resetClicked;
//document.getElementById("runButton").onclick=runClicked
//document.getElementById("infoButton").onclick=infoClicked;

//document.getElementById("stopButton").onclick=stopClicked;
//document.getElementById("stopButton").hidden=true;
//document.getElementById("downloadButton").onclick=downloadClicked;
//document.getElementById("saveSVG").onclick=svgDownloadClicked;
//document.getElementById("uploadButton").onclick= function () {
//    document.getElementById("uploadFile").click();
//};

//document.getElementById("clearButton").onclick=clearClicked;
//document.getElementById("saveCanvasButton").onclick=saveCanvasClicked;


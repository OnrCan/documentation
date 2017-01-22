function initializeApplication() {
	initializeShowHideByElement();
	enableTransitions();
}
function enableTransitions() {
	setTimeout(function() {
		$(".notransition").removeClass("notransition");
	}, 200);
}
function initializeCodeTextArea(elParent) {
	var arrCodeTextArea = $("textarea.textareaCodeMirror", elParent);
	var lCodeTextAreaCount = arrCodeTextArea.length;
	var elCodeTextArea = null;
	var objCodeMirror = null;

	for (var  i = 0; i < lCodeTextAreaCount; i++) {
		elCodeTextArea = arrCodeTextArea[i];
		objCodeMirror = CodeMirror.fromTextArea(elCodeTextArea, {
    		lineNumbers: true,
    		viewportMargin: Infinity,
			gutter: true,
    		lineWrapping: true
  		});
  		$(elCodeTextArea).data("objCodeMirror", objCodeMirror);
  		objCodeMirror.setValue("\r\n\r\n\r\n\r\n");
	}
}
function initializeShowHideByElement(elContainer) {
	var arrDIV = new Array();
	if (elContainer !== undefined) {
		arrDIV = $(".sh-element", elContainer);
	} else {
		arrDIV = $(".sh-element");
	}
	var lDIVCount = arrDIV.length;
	var elDIV = null;
	var elMainElement = null;
	var arrShowHideElementHistory = new Array();
	var arrCurrentElements = new Array();
	var arrCurrentValues = new Array();
	var strFunctionBody = "";
	var lCurrentElementCount = 0;
	var lCurrentElementValueCount = 0;
	var arrClassNames = new Array();
	var lClassNameCount = 0;
	var strCurrentClassName = "";
	var arrCurrentClassName = new Array();
	var lCurrentClassNameCount = 0;
	var strCurrentMainElementID = "";

	for (var i = 0; i < lDIVCount; i++) {
		elDIV = arrDIV[i];

		arrClassNames = elDIV.className.split(" ");
		lClassNameCount = arrClassNames.length;

		arrCurrentElements = new Array();
		arrCurrentValues = new Array();

		lCurrentElementCount = 0;

		for (var j = 0; j < lClassNameCount; j++) {
			arrCurrentClassName = String(arrClassNames[j]).split("-");
			if (arrCurrentClassName.length < 3) {
				continue;
			} else if ("sh" != arrCurrentClassName[0]) {
				continue;
			} else {
				lCurrentClassNameCount = arrCurrentClassName.length;
				strCurrentMainElementID = "";
				for (var k = 1; k < (lCurrentClassNameCount - 1); k++) {
					strCurrentMainElementID += arrCurrentClassName[k];
				}

				arrCurrentElements[strCurrentMainElementID] = 1;

				if (arrCurrentValues[strCurrentMainElementID]) {
					(arrCurrentValues[strCurrentMainElementID]).push(arrCurrentClassName[lCurrentClassNameCount - 1]);
				} else {
					arrCurrentValues[strCurrentMainElementID] = new Array();
					(arrCurrentValues[strCurrentMainElementID]).push(arrCurrentClassName[lCurrentClassNameCount - 1]);
					lCurrentElementCount++;
				}
			}
		}

		if (0 == lCurrentElementCount) {
			continue;
		}

		strFunctionBody = "var lScore=0;";

		for (var strArrayElementID in arrCurrentElements) {
			elMainElement = document.getElementById(strArrayElementID);

			lCurrentElementValueCount = (arrCurrentValues[strArrayElementID]).length;

			if (!elMainElement) {
				continue;
			}

			if ("INPUT" == elMainElement.tagName) {
				if (("radio" == elMainElement.getAttribute("type"))
						|| ("checkbox" == elMainElement.getAttribute("type"))) {
					
					if (!arrShowHideElementHistory[strArrayElementID]) {
						$(elMainElement).off("click").on("click", function() {
							doShowHideByElementMainElementChange(this);
						});
					}

					for (var j = 0; j < lCurrentElementValueCount; j++) {
						strFunctionBody += "if("
								+ arrCurrentValues[strArrayElementID][j]
								+ "==document.getElementById(\""
								+ elMainElement.id
								+ "\").checked){lScore++}";
					}
				}
			} else if ("SELECT" == elMainElement.tagName) {
				if (!arrShowHideElementHistory[strArrayElementID]) {
					$(elMainElement).off("change").on("change", function() {
						doShowHideByElementMainElementChange(this);
					});
				}

				for (var j = 0; j < lCurrentElementValueCount; j++) {
					strFunctionBody += "if("
							+ arrCurrentValues[strArrayElementID][j]
							+ "==$(\"#"
							+ elMainElement.id
							+ "\").val()){lScore++}";
				}
			}

			arrShowHideElementHistory[strArrayElementID] = 1;
		}

		strFunctionBody += "if(lScore=="
				+ lCurrentElementCount
				+ "){return true}else{return false}";

		elDIV.isShowHideStatusVisible
				= new Function(strFunctionBody);
	}
}
function doShowHideByElementMainElementChange(elThis) {
	if (!elThis) {
		return;
	}

	var arrDIV = $(".sh-element");
	var lDIVCount = arrDIV.length;
	var elDIV = null;

	for (var i = 0; i < lDIVCount; i++) {
		elDIV = arrDIV[i];
		if (elDIV.isShowHideStatusVisible) {
			if (elDIV.isShowHideStatusVisible()) {
				if (elDIV.style.display === "none") {
					$(elDIV).velocity("stop");
					$(elDIV).velocity("fadeIn", 500);
					refreshCodeTextArea(elDIV);
				}
			} else {
				$(elDIV).velocity("stop");
				elDIV.style.display = "none";
			}
		}  
	}
}
function refreshCodeTextArea(elParent) {
	var arrCodeTextArea = $("textarea.textareaCodeMirror", elParent);
	var lCodeTextAreaCount = arrCodeTextArea.length;
	var elCodeTextArea = null;
	var bInitialized = ("1" == elParent.getAttribute("data-cm-initialized"));
	var strElementID = "";

	/*
	if (bInitialized) {
		return;
	}
	*/

	for (var i = 0; i < lCodeTextAreaCount; i++) {
		elCodeTextArea = arrCodeTextArea[i];
		strElementID = elCodeTextArea.id;
		delayRefreshCodeTextArea(strElementID);
	}

	elParent.setAttribute("data-cm-initialized", "1");
}
function delayRefreshCodeTextArea(strCodeTextAreaID) {
	var tmCMRefreshTimer = $(document.body).data("tmCMRefreshTimer");
	clearTimeout(tmCMRefreshTimer);

	var strCMListCSV = $(document.body).data("strCMListCSV");

	if (undefined === strCMListCSV) {
		strCMListCSV = "";
	}

	if ("" != strCMListCSV) {
		strCMListCSV += ",";
	}

	strCMListCSV += strCodeTextAreaID;

	$(document.body).data("strCMListCSV", strCMListCSV);

	tmCMRefreshTimer = setTimeout(function () {
		var strCMListCSV = $(document.body).data("strCMListCSV");
		var arrCMListCSV = strCMListCSV.split(",");
		var lCMListCSVCount = arrCMListCSV.length;

		for (var i = 0; i < lCMListCSVCount; i++) {
			$("#" + arrCMListCSV[i]).data("objCodeMirror").refresh();
		}

		$(document.body).data("strCMListCSV", "");
	}, 50);

	$(document.body).data("tmCMRefreshTimer", tmCMRefreshTimer);
}
function refreshShowHideElements(strParentElementID) {
	var elParent = document.getElementById(strParentElementID);
	var arrDIV = null;

	if (elParent) {
		arrDIV = $(".sh-element", elParent);
	} else {
		arrDIV = $(".sh-element");
	}

	var lDIVCount = arrDIV.length;
	var elDIV = null;

	for (var i = 0; i < lDIVCount; i++) {
		elDIV = arrDIV[i];
		doShowHideByElementMainElementChange(elDIV);
	}
}
function sortTable(elTable, bDESC) {
	if (!elTable) {
		return;
	}
	var arrRows = $(">div", elTable);
	var lRowCount = arrRows.length;
	arrRows.sort(function(trA, trB) {
	    var txtA = $(trA).children().eq(0).text().toUpperCase();
	    var txtB = $(trB).children().eq(0).text().toUpperCase();
	    if(txtA < txtB) {
	    	return ((true === bDESC) ? 1 : -1);
	    }
	    if(txtA > txtB) {
	    	return ((true === bDESC) ? -1 : 1);
	    }
	    return 0; 
    });
    
    elTable.innerHTML = "";

	for (var i = 0; i < lRowCount; i++) {
		$(elTable).append(arrRows[i]);	
	}
}
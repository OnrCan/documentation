$(function() {
	initializeApplication();
	initializePage();
});
function initializePage() {
	$("#buttonShowSearch").on("click", function () {
		doShowSearchButtonClick(this);
	});

	$("#buttonShowContent").on("click", function () {
		doShowContentButtonClick(this);
	});

	showPage("divPageContent");
}
function doShowSearchButtonClick(elThis) {
	if (!elThis) {
		return;
	}

	document.getElementById("buttonShowSearch").style.display = "none";
	document.getElementById("buttonShowContent").style.display = "block";

	showDialog("divSearchContent");
}
function doShowContentButtonClick(elThis) {
	if (!elThis) {
		return;
	}

	document.getElementById("buttonShowSearch").style.display = "block";
	document.getElementById("buttonShowContent").style.display = "none";

	hideDialog("divSearchContent");
}
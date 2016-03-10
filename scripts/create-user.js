/*
 * Script create-user.js
 * 
 * This script signup a new user at actionbound.de, upload a image and extract the user-id
 * 
 * Adjust data given in section "User-Data" before running
 * 
 * PhantomJS is required for execution (http://phantomjs.org/)
 * 
 * Usage: path/to/phantomjs --cookies-file=cookies.txt create-user.js
 */
var page = require('webpage').create();

var cookies = {};

page.viewportSize = {
		  width: 1024,
		  height: 768
};

phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;

/*
 * Status variables
 */
var loadInProgress = false;
var tasks = [];
var taskIndex = 0;

/*
 * Event-Handler for page events
 */
page.onLoadStarted = function() {
	loadInProgress = true;
	console.log('Loading started... ');
};
page.onLoadFinished = function(status) {
	loadInProgress = false;
	console.log('Loading finished: ' + status + " - " +  page.url);
};
page.onUrlChanged = function(targetUrl) {
	  console.log('Loading URL: ' + targetUrl);
};

/*
 * User-Data - change this!
 */
var userName = "Some User Name";
var userMail = "SomeUserName@someprovider.com";
var password = "tops-secret";

function doSignUp() {
	page.open('https://de.actionbound.com/signup', function(status) {
		// fill formular
		var x = page.evaluate(function(userName, userMail, password) {
			// fill field Username
			document.getElementById('username').value = userName;
			// fill field E-Mail
			document.getElementById('email').value = userMail;
			// fill field Password (twice)
			document.getElementsByName('password')[0].value = password;
			document.getElementsByName("password_repeat")[0].value = password;
			// Agree to some legal stuff
			document.getElementsByName('inquiry_agree')[0].checked = true;
			document.getElementsByName('terms_agree')[0].checked = true;
			// submit signup-form
			document.querySelector("button[type=submit]").click();
			return userName;
		}, userName, userMail, password);
	});
}

function doLogin() {
	page.open('https://de.actionbound.com/signin', function(status) {
		page.evaluate(function(userMail, password) {
			document.getElementsByName('email')[0].value = userMail;
			document.getElementsByName('password')[0].value = password;
			document.querySelector("button[type=submit]").click();
		}, userMail, password);
	});
}

function openDropDown() {
	page.evaluateJavaScript(function() {
		document.querySelector("div.ui.dropdown.item").click();
	});
}

function clickMediathek() {
	page.evaluateJavaScript(function() {
		document.querySelector("a.item.open-media-modal").click();
	});
}

function selectUploadFile() {
		page.uploadFile('input[id=fileinp]', 'bild.png');
}

function clickUploadFile() {
	page.evaluateJavaScript(function() {
		document.querySelector("div.ui.primary.icon.labeled.button.start-upload").click();
	});
}

function selectImageTab() {
	page.evaluateJavaScript(function() {
		document.querySelector('a[data-tab="images"]').click();
	});
}

function getUserID() {
	var userID = page.evaluateJavaScript(function() {
		return document.querySelectorAll("a.image")[0].href;
	});
	console.log("url = " + userID);
	userID = userID.match(/[^\/]*(?=\/image)/)[0];
	console.log("UserID = " + userID);
}

function closeMediathek() {
	page.evaluateJavaScript(function() {
		document.querySelector('i.actionbound.close.icon').click();
	});
}

function logout() {
	page.evaluateJavaScript(function() {
		document.querySelector('a[href="/signout"]').click();
	});
}

tasks = [ 
         	//doLogin,
         	doSignUp,
         	openDropDown,
         	clickMediathek,
         	selectUploadFile,
         	clickUploadFile,
         	selectImageTab,
         	getUserID,
         	closeMediathek,
         	openDropDown,
         	logout
        ];

var interval = setInterval(taskRunner, 1500);

function taskRunner() {
	if (loadInProgress == false) {
		if (typeof tasks[taskIndex] == "function") {
			console.log("--> Running task " + tasks[taskIndex].name);
			tasks[taskIndex]();
			taskIndex++;
		} else {
			console.log("Starting Exit...");
			clearInterval(interval);
			console.log("Waiting 4 Seconds to come down...");
			setTimeout(function() {
				console.log("Save screenshot");
				page.render('login.png');
				page.onUrlChanged = null;
				page.close();
				console.log("Bye");
				phantom.exit();
			}, 4000);
		}
	}
}

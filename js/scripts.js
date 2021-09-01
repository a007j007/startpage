/*
    AUTHR: TacoAnon
    DESCR: Personal startpage
    BRWSR: Mozilla Firefox (Tested in WaterFox 35)
    NOTES: - I mainly restrict mnu label length and the amount of available mnus because it goes out of the con otherwise.
           - If you widen up the cons you should be able to fit more, but you're on your own if you do so.
*/

var $ = function (id) {
    return document.getElementById(id);
};

var bangs = [
    ["!bv", "https://search.brave.com/search?q=", "Brave Search"],
    ["!bbt", "https://bakabt.me/browse.php?q=", "BakaBT"],
    ["!ddg", "https://duckduckgo.com/?q=", "DuckDuckGo"],
    ["!g", "https://www.google.com/search?q=", "Google"],
    ["!gi", "https://www.google.com/search?tbm=isch&q=", "Google Images"],
    ["!imdb", "https://www.imdb.com/find?q=", "IMDB"],
    ["!ud", "https://www.urbandictionary.com/define.php?term=", "Urban Dictionary"],
    ["!wp", "https://en.wikipedia.org/w/index.php?search=", "Wikipedia"],
    ["!yt", "https://www.youtube.com/results?search_query=", "YouTube"],
    ["!sr", "https://www.reddit.com/r/", "Reddit (Specific Subreddit)"],
    ["!url", "https://"]
//    ["!ph", "https://www.pornhub.com/video/search?search=", "Pornhub"]
];

var mnus = [ // mnu Titles "Title",
    "Social",
    "Gaming",
    "Code/Rice",
    "Other"
];

var showFavicon = true; // Enable/Disable Favicons

// Link setup (separate with ["", "", ""],)
// Format: ["Name", "URL", "Custom Favicon"],
var links = [
    //Social
    
    ["YouTube",                     "https://youtube.com/feed/subscriptions",                   ""],
    ["Twitch",                      "https://www.twitch.tv/",               ""],
    ["Reddit",                      "https://reddit.com",                    ""],
    ["Facebook",                    "https://facebook.com",                  ""],
    
    ["", "", ""], //Gaming
    
    ["Counter-Strike",              "https://blog.counter-strike.net/index.php/category/updates/",     "http://blog.counter-strike.net/wp-content/themes/counterstrike_launch/favicon.ico"],
    ["Steam",                       "https://store.steampowered.com/",       ""],
    ["HumbleBundle",                "https://www.humblebundle.com/",        "https://humblebundle-a.akamaihd.net/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png"],
    
    ["", "", ""], //Code
    
    ["GitHub",                      "https://github.com/",                   ""],
    ["Pastebin",                    "https://pastebin.com",                  ""],
    ["JSFiddle",                    "https://jsfiddle.net/",                 "https://jsfiddle.net/img/favicon.png"],
    ["StackOverflow",               "https://stackoverflow.com/",            ""],
    
    ["", "", ""], //Other
    
    ["Gmail",                       "https://gmail.com/",                   "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon5.ico"],
    ["Google Drive",                "https://drive.google.com",              ""],
    ["Netflix",                     "https://netflix.com",                   ""],
    ["Weather",                     "https://www.weather.com/",              ""]
];

var hlpMnuMaxHgt = 86;

var ss = ""; //Leave empty
var defss = "!bv"; //default bang

//Keep bang for session
if (sessionStorage.eng) {
    var defss = sessionStorage.eng;
    console.log("bang session resumed");
} else {
    sessionStorage.setItem("eng", defss);
    console.log("new bang session started");
};

function init() {
    console.log("init started");
    if (!localStorage.visits) {
        localStorage.setItem("visits", 1);
        alert("This is your first visit!\nIf you need help, click the top right corner of the search bar.")
        var vis = parseInt(localStorage.visits);
        vis += 1;
        localStorage.visits = vis;
    } else if (localStorage.visits < 4) {
        alert("This is only visit number "+localStorage.visits+" for you.\n If you need help, click in the top right of the search bar.");
        var vis = parseInt(localStorage.visits);
        vis += 1;
        localStorage.visits = vis;
    } else {
        var vis = parseInt(localStorage.visits);
        vis += 1;
        localStorage.visits = vis;
    };

    if (!localStorage.username) {
        var name = prompt("Hello new user. Please enter your name.\n(Your name will be remembered for next time)");
        localStorage.setItem("username", name);
    };

    for (var i = 0; i < bangs.length; i++) {
        if (bangs[i][0] === defss) {
            ss=bangs[i][1]; 
            $('qry').placeholder = bangs[i][2];
            break;
            console.log("bang set to "+bangs[i][2]);
        }
    }

    if (ss === "") { alert("Error: Missing default search engine!"); }

    hlpMnuMaxHgt += (bangs.length * 15);
    $('qry').value = "";
    console.log("called weather");
    weather();
    build();
    buildWeatherBar();
    weatherAndTimeUpdater();
}

function build() { /*Code heavily based off of Twily's v4 homepage.*/
    console.log("build called");

    // Build Bang List
    for (var i = 0; i < bangs.length; i++) {
        $('bngLst').innerHTML += "<li><b class='hlpBang'>" + bangs[i][0] + "</b> - " + bangs[i][2] + "</li>";
    }

    // Build categoryList
    $('mnu').innerHTML = "";
    if (mnus.length > 8) {
        alert("Too many menu Categories. Please restrict to 6 or less.");
        return;
    }

    for (let p = 0; p < mnus.length; p++) { // Build mnu buttons
        if (mnus[p].length > 10) {
            alert("group label \"" + mnus[p] + "\" is too long. Please restrict to 10 or less characters. Skipping group label.");
            continue;
        } else {
            $('mnu').innerHTML += "<li onmouseover=\"javascript:blurOnHover();\" onmouseout=\"javascript:unBlurrer();\" id=\"mnuItm_" + (p+1) + "\" class=\"mnuItm\"><label id=\"mnuItmLbl_" + (p+1) + "\">" + mnus[p] + "</label><div class=\"subMnuCon\"><ul id=\"subMnu_" + (p) + "\" class=\"subMnu con\"></ul></div></li>";
        }
    }


    //Build mnus
    var m = 0;

    skip = false;

    for (var z = 0; z < links.length; z++) { // mnu links
        if (links[z][0] === "" && links[z][1] === "") {
            skip = true;
        }

        if (!skip) {
            var printimg = "";

            if (showFavicon) {
                var favicon = "";
                if (links[z][2] !== "") {
                    favicon = links[z][2];
                } else {
                    favicon = getFavicon(links[z][1]);
                }
                
                printimg = "<img id=\"img_" + z + "\" src=\"" + favicon + "\"" + " onload=\"javascript:this.style.visibility='inherit';\" /> ";
            }


            $('subMnu_' + m).innerHTML += "<li class='subMnuItm'><a target='_blank' href=\"" + links[z][1] + "\" target=\"_self\">" + printimg + links[z][0] + "</a></li>";
        } else {
            skip = false;
            m++;
        }
    }
    console.log("build complete");
    themes(localStorage.theme);
}

function buildWeatherBar(){
    if (!window.weatherData){console.log("couldnt build");return;};
    let wthr = window.weatherData;
    let whattime = "It's <span id='timeSpan' class='time'>"+time(wthr.timezone)+"</span>. ";
    let description = "There's <span class='weatherdescription'>"+wthr.weather[0].description+"</span> near you in <span class='location'>"+wthr.name+"</span>. ";
    let temp = "The temperature is at <span class='tempact'>"+(wthr.main.temp - 273.15).toFixed(1)+"℃</span>"
    if (wthr.main.temp - wthr.main.feels_like > 1){
    	temp += " but it feels like <span class='tempfeel'>"+(wthr.main.feels_like - 273.15).toFixed(1)+"℃</span>.";
    }else{
    	temp += "."
    }
    document.getElementById('weather').innerHTML = "<div class='weatherUpdate'>"+ whattime + description + temp+"</div>";
    console.log("weather build complete");
}

function handleQuery(e, q) { // Handle search query. based off of twily's v4 homepage.
    console.log("query made");
    var key = e.keyCode || e.which;

    if (key === 13) { // enter
        var qList = q.split(" ");
        var testWWW = q.split(".")
        if (qList[0].charAt(0) === "!") { //does the query call a bang
            for (var i = 0; i < bangs.length; i++) { //find which bang was called
                if (bangs[i][0] === qList[0]) {
                    ss = bangs[i][1];
                    if(bangs[i][0] != "!url"){sessionStorage.eng = bangs[i][0]};
                    $('qry').placeholder = bangs[i][2];
                    console.log("bang changed");
                    break;
                }
            }
            
            if (qList.length > 1) {
                qList.splice(0,1);
                tourl = ss + qList.join(" ").replace(/&/g, "%26").trim();
                window.open(tourl, "_blank");
            } else {
                $('qry').value = "";
                console.log("query bar reset - new bang");
            }
        } else { // where bang not specified, use selected search
            tourl = ss + q.replace(/&/g, "%26");
            window.open(tourl, "_blank");
        }
        $('qry').value = "";
        location.reload();
    }
}

var m = false;

function toggleHelp() { // Toggle help
    console.log("help menu called");
    m = !m;
    if (m) {
        $('hlpCon').style.opacity = "1";
        $('hlpCon').style.maxHeight = hlpMnuMaxHgt + "px";
        $('hlpCon').style.marginTop = "0";

    } else {
        $('hlpCon').style.opacity = "0";
        $('hlpCon').style.maxHeight = 0;
        $('hlpCon').style.marginTop = "-14px";
    }
}

function getFavicon(url) {
    var l = document.createElement("a");
    l.href = url;

    return l.protocol + "//" + l.hostname + "/favicon.ico";
    console.log(url+"favicon fetched");
}

//Nice little blur on mnu hover
function blurOnHover() {
//    document.getElementById('qry').value = "penis";
    document.getElementById("bkgImg").style.WebkitFilter = "blur(2px)";
    document.getElementById("qry").style.WebkitFilter = "blur(2px)";
    document.getElementById("weather").style.WebkitFilter = "blur(2px)";
};
function unBlurrer() {
//    document.getElementById('qry').value = "";
    document.getElementById("bkgImg").style.WebkitFilter = "blur(0px)";
    document.getElementById("qry").style.WebkitFilter = "blur(0px)";
    document.getElementById("weather").style.WebkitFilter = "blur(0px)";
};
//Focus 'qry' on keypress
function myFunction (x) {
    prsd = x.keyCode || x.which;
    if (document.getElementById("sec") != document.activeElement){
        document.getElementById('qry').focus();
        console.log("focus called to query bar");
//    }else if (x === 190 && document.getElementById('qry') != document.activeElement) {
//        document.getElementById("sec").focus();
    };
};

//Themery

var themelst = [
    ["air","url('./media/Airplane\ Theme/airback.jpg')","./media/Airplane\ Theme/airdio.ogg", "auto"],
    ["boobs","url('./media/Boobs\ Theme/boobs.jpg')",""],
    ["cats","url('./media/Cat\ Theme/cats.jpg')","./media/Cat\ Theme/nyan.ogg", "auto"],
    ["rain","url('./media/Rain\ Theme/rainback.jpg')","./media/Rain\ Theme/rain.ogg", "auto"],
    ["default","url('./media/background.jpg')","./media/music.ogg"]
];

function themes (Thm) {
    if (Thm) {
        localStorage.theme = Thm;
        for (var i = 0; i < themelst.length; i++) {
            if (Thm == themelst[i][0]) {
                document.getElementById("bkgImg").style.backgroundImage = themelst[i][1];
                console.log("Theme set to '"+themelst[i][0]+"'");
                if (themelst[i][2] != "") {
                    document.getElementById("music").src = themelst[i][2];
                    console.log("music set to " + themelst[i][2]);
                } else {
                    document.getElementById("music").src = "";
                    console.log("no music source for current theme");
                };
                if (themelst[i][3]) {
                    document.getElementById("music").play();
                    console.log("music autoplayed");
                };
                console.log("theme setup complete");
            };
        };

    } else {
        localStorage.setItem("theme", "default");
        Thm = "default";
        alert("No theme saved. Theme reset to default.")
    };
};

function youDidntSeeAnything (ev, egg) {
    var pressed = ev.keyCode || ev.which;

    if (pressed === 13) { // enter
        ears = document.getElementById("sec").value.toLowerCase();
	console.log(ears);
        switch (ears) {
            //THEMES//
            case "air":
                themes(ears);
                var wasthm = true;
                break;
            case "boobs":
                if (localStorage.username == "James"){
                themes(ears);
                } else {
                    themes("default");
                };
                var wasthm = true;
                break;
            case "cats":
                themes(ears);
                var wasthm = true;
                break;
            case "rain":
                themes(ears);
                Thm = "rain";
                var wasthm = true;
                break;
            case "default":
                themes(ears);
                var wasthm = true;
                break;
            //FUNCTIONS//
            case "pass":
                document.getElementById("dv4").innerHTML = '<a id="ck" onclick="javascript:check();">click me</a>';
                break;
            case "play":
                document.getElementById("music").play();
                break;
            case "pause":
                document.getElementById("music").pause();
                break;
            case "time":
                t = time();
                document.getElementById("weather").append("It is "+t);
                document.getElementById("time").className = "time";
                break;
            case "namechange":
                var newname = prompt("You have requested to change your username.\nPlease enter your new name:");
                localStorage.username = newname;
                location.reload();
		break;
            case "ftp":
		window.open("http://pin.redirectme.net/ftp/", "_blank");
                break;
            default:
                themes("default");
                document.getElementById("sec").value = "";
        };
        if (wasthm) {
            document.getElementById("sec").value = "";
            console.log("Theme '"+Thm+"' called");
            localStorage.theme = ears;
        	var wasthm = false;
        };
    	document.getElementById("sec").value = "";
    };
};
function check(){
    if (document.getElementById("sec").value == "z") {
        document.getElementById("ck").href = "./js/dv4.html";
        document.getElementById("ck").target = "_blank";
        location.reload();
    };
};

function time (tz) {
    var d = new Date();
    var hour = d.getUTCHours() + Math.round(tz/3600);
    var min = d.getMinutes();
    var ap = "AM"
    if (min < 10) {
        min = "0"+min;
    };
    if (hour >= 12) {
    	hour = (hour%13) + 1;
    	ap = "PM";
    };   
    return (String(hour)+":"+String(min)+String(ap));
}

function weatherAndTimeUpdater(){
	var currentDate = new Date();
//	console.log("The date/time is " + currentDate)
	var syncDelay = 60-currentDate.getSeconds();
//	console.log("There's a desync of "+syncDelay+" seconds.")
	setTimeout(function(){
		document.getElementById("timeSpan").innerHTML = time(window.weatherData.timezone);
//		console.log("Beginning update every 60s.")
		setInterval(function(){
			document.getElementById("timeSpan").innerHTML = time(window.weatherData.timezone);
//			console.log("Time updated.")
		}, 60000);
		setInterval(function(){
			buildWeatherBar();
		}, 900000)
	}, syncDelay*1000);
}


function weather () {
	var options = {
	    enableHighAccuracy: true,
	    timeout: 5000,
	    maximumAge: 0
	};
	function success(pos) {
	    var crd = pos.coords;
	    var lat = crd.latitude.toString();
	    var lng = crd.longitude.toString();
	    coordinates = [lat, lng];
	    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
		getWeather(lat,lng)
	    return;
	};
	function error(err) {
	    console.warn(`could not get weather data (location not accessible)`);
	};
	navigator.geolocation.getCurrentPosition(success, error, options);
	function getWeather (lat,long) {
		var xhr = new XMLHttpRequest();
		let linktoapi = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=4405144c3ae501fc87721c808cd550cd";
		xhr.open('GET', linktoapi, true);
		xhr.send();
		xhr.onreadystatechange = processRequest;
		console.log("aboutToListen -- "+xhr.readyState);
		xhr.addEventListener("readystatechange", processRequest, false);
		console.log("listening -- "+xhr.readyState);
		function processRequest(e) {
		    console.log("POP")
		    if (xhr.readyState == 4 && xhr.status == 200) {
		        window.weatherData = JSON.parse(xhr.responseText);
		        buildWeatherBar();
 			return;
		    }
		}
	}
}	

function toggle(div_id) {
    var panel = document.getElementById(div_id + "");
    if (panel) {
        if (panel.style.display == "none") {
            panel.style.display = "block";
        }
        else {
            panel.style.display = "none";
        }
    }
}

/* FIXME: Move to wm namespace */
function toggleSearchSubHeader(forceVisible, headerSearchPanelId, headerSearchButtonId) {
  headerSearchPanelId = headerSearchPanelId || "headerSearchPanel";
  headerSearchButtonId = headerSearchButtonId || "searchToggleIcon";
  forceVisible = forceVisible || false;
  if (!$("#"+headerSearchPanelId).is(":visible") || forceVisible) {
    $("#"+headerSearchPanelId).show();
    $("#"+headerSearchButtonId).hide();
    $(".inputField").focus();
  } else {
    $("#"+headerSearchPanelId).hide();
    $("#"+headerSearchButtonId).show();
  }
}

/* Not in use any longer */
function toggleTabSelection(toggleDiv) {
  for (var i = 0; i < 5; i++) {
    var image = $("#tab_"+i+" img");
    if ($(toggleDiv).attr("id") != $("#tab_"+i).attr("id")) {
      image[0].src = image[0].src.replace("eblue","gray");
    } else {
      image[0].src = image[0].src.replace("gray","eblue");
    }
  }
}

/* Not in use any longer */
function itemtoggle(divid) {
     var panelclass = document.getElementById(divid).className;
     if(panelclass == "expand")
     {
     	document.getElementById(divid).className = "collapse";
     }
     else
     {
     	document.getElementById(divid).className = "expand";
     }
}

function openShoppingListEdit() {
  var shoppingListEditLocation = document.URL + "&wicket:interface=:11:listNameLink::ILinkListener::";
  window.location = shoppingListEditLocation;
}

var offset = -1;
function showProcessingImage(div_id) {

	var isLastPage = document.getElementById('cachedResultPlaceHolder').lastPage;
	if(typeof(isLastPage)=='undefined'){
		isLastPage=false;
	}

	var _offset = document.getElementById('cachedResultPlaceHolder').offset;
	if(typeof(_offset)=='undefined'){
		_offset=0;
	}


	if(!isLastPage){
    document.getElementById(div_id + "").innerHTML = "<table align='center'><tr><td><img border='0' width='23' height='25' src='/r/images/IMG_Loading_Small_23x25.gif'/></td><td class='gpsText'>Please wait...</td></tr></table>";
	}
	else{
		var paginationLink = document.getElementById('paginatorMessage');
		paginationLink.onclick=function(){};

		var paginationMessageHolder = document.getElementById('paginationMessageHolder');
		paginationMessageHolder.style.display="none";

	}

	if(_offset>offset){
	getResultsCache('cachedResults',isLastPage);
	}
	else{
		setTimeout("showProcessingImage('"+div_id+"')", 200);
	}

	offset = _offset;
}

function getUrlParameter( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null ){
    return "";
  }
  else{
    return results[1];
  }
}


/**
 * expands collapsed breadcrumb (if it is of class 'collapse')
 * @param crumb - reference to the breadcrumb object
 */
function toggleCrumb(crumb) {
    if(crumb.className == "collapse") {
        crumb.className = "";
        return false;
    }
}

function showGeneralMessage(){
	var gps_processing = document.getElementById("processing");
    if (gps_processing) {
        gps_processing.style.display = "none";
    }
    var msg = document.getElementById("message");
    if (msg) {
        msg.style.display = "block";
    }
}

function hideGeneralMessage(){
	var msg = document.getElementById("message");
	if (msg) {
		msg.style.display = "none";
	}
	var gps_processing = document.getElementById("processing");
	if (gps_processing) {
		gps_processing.style.display = "block";
	}
}

function showLocation() {
    if (navigator.geolocation) {
    	hideGeneralMessage();
        var showLoc = document.getElementById("findMyLocationButton");
        if (showLoc) {
            showLoc.style.display = "block";
        }
    }
}

function loadPhoenixLocationWithGPS(route, noGPSroute) {
	withLocation({
		success: function(data) {
			route = route.replace(':longitude', data.longitude);
			route = route.replace(':latitude', data.latitude);
			window.location.href = '/r/phoenix/index.html#' + route;
		},
		fail: function(supported) {
			window.location.href = '/r/phoenix/index.html#' + noGPSroute;
		}
	});
}

function loadLocationWithGPS(resultsPageName, noGPSPagePageName) {
  var resultsPageName = resultsPageName || "storefinderresults?";
  var noGPSPagePageName = noGPSPagePageName || "storefinder";
  
  withLocation({
	  success: function(coords) {
		  window.location = "/m/"+resultsPageName+"lat="+coords.latitude+"&lon="+coords.longitude+"&zip=&city=&state=";
	  },
	  fail: function(supported) {
		  window.location = "/m/"+noGPSPagePageName;
	  }
  });
}

function withLocation(callback) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			callback.success(position.coords);
		}, function() {
			callback.fail(true);
		}, {timeout:5000});

		/* Try Google Gears Geolocation */
	} else if (typeof google !== 'undefined' && typeof google.gears !== 'undefined') {
		var geo = google.gears.factory.create('beta.geolocation');
		geo.getCurrentPosition(function(position) {
			callback.success(position.coords);
		}, function() {
			callback.fail(true);
		});
		/* Browser doesn't support Geolocation */
	} else {
		callback.fail(false);
	}
}

function getLocation(pickup) {
    var showErrroFunc = showError;
    if(typeof(pickup)!='undefined'){
     showErrroFunc=pickupError;
    }
    
    var showLoc = document.getElementById("findMyLocationButton");
    if (showLoc) {
        showLoc.style.display = "none";
    }
    var gpsImageLoading = document.getElementById("gpsImageLoading");
    if(gpsImageLoading){
    	gpsImageLoading.style.display="block";
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(submitStorefinder, showErrroFunc, {maximumAge:0});
        hideGeneralMessage();
    }
}

function showError(error) {
	showGeneralMessage();
}

function pickupError(error){
  var pickupLocation = document.getElementById('pickupLocation');
  
 if(pickupLocation){
     var gpsText=pickupLocation.getElementsByTagName("a");
  if(gpsText.length>0)
  {
    gpsText[0].innerHTML = "We could not find your location"
  }
  
   var gpsSpinner=document.getElementById("gpsImageLoading");
   
   if(gpsSpinner){
     gpsSpinner.style.visibility="hidden";
   }
 }
 
}

function submitStorefinder(position) {
    document.getElementById("lat").value = position.coords.latitude;
    document.getElementById("lon").value = position.coords.longitude;
    setTimeout("submitStoreFinderForm()",10);
}

function submitStoreFinderForm(){
	document.getElementById("submitButton").click();
}
var cacheCheck=0;
function getResultsCache(containerId,isLastPage){
	document.getElementById('cachedResultPlaceHolder').innerHTML+=document.getElementById(containerId+'').innerHTML;

	/* Always having a click event... */
	if(!isLastPage){
	getFirstCachedResults();
	}
	else{
		swapTitlesForPagination();
	}
}

function swapTitlesForPagination(){
	var paginationTitle = document.getElementById('processingTitle');
	var paginationTitle1 = document.getElementById('paginationMessageHolderTitle');
	if(paginationTitle1 && paginationTitle){
	paginationTitle1.innerHTML = paginationTitle.innerHTML;
	}

}
function getFirstCachedResults(){

	swapTitlesForPagination();
	var paginationTitle = document.getElementById('processingTitle');
	if(paginationTitle){
	var paginationMessageHolder = document.getElementById('paginationMessageHolder');
	paginationMessageHolder.style.display="block";
	}

	var paginationLink = document.getElementById('paginatorMessage');
	if(paginationLink){
	if (document.createEvent) {/* Firefox & Netscape */
		var click = document.createEvent('MouseEvents');
		click.initEvent('click',0,0);
		paginationLink.dispatchEvent(click);
	}
	else if (document.createEventObject) { /* IE */
		var click = document.createEventObject();
		paginationLink.fireEvent('onclick', click);
	}
	}
}

var touchStart_X = 0;
function mTouchStart(event) {
    touchStart_X = event.touches[0].pageX;
}
function mTouchEnd(event,className){
    var touchEndX = event.changedTouches[0].pageX;
    var touchDifference = touchEndX - touchStart_X;
    if(touchDifference<=-50){
        event.preventDefault();
        slideInsp(1,className);
    }
    else if(touchDifference>=50){
        event.preventDefault();
        slideInsp(-1,className);
    }
    touchStart_X=0;
}

function slideInsp(index,className){
    var slideContent = $("."+className);
    if(index=="1"){
        $(".next", slideContent).click();
    }
    else if(index == "-1"){
    $(".prev", slideContent).click();
    }
}

window.onload = function() {
    setTimeout(function(){window.scrollTo(0, 1);}, 10);
}
var noCache="";
window.onunload = function noRefresh(){
    if(noCache!=""){
     window.location.href=noCache;
    }
 }

/* type ahead rutines below */
function typeaheadResult(suggestions) {
    var query = suggestions.Q;
    var element  = suggestions.R;
    var suggestionList = new Array();
    if (element != "")  {
        if (isArray(element)) {
            for (var i=0; i < element.length; i++)  {
    /*           alert(element[i]); */
                displaySuggestion(element[i], 1, suggestionList);
            }

        }
        else {
            suggestions.push(element);
        }
    }
/*    alert("List is: " + suggestionList); */
    displayAllSuggestions(suggestionList, query);
    displayOtherElements(query);
}

function displaySuggestion(suggestion, level, suggestionList) {
    if (isArray(suggestion) && level < 4) {
        for (var i=0; i < suggestion.length; i++)  {
 /*          alert(suggestion[i]); */
            level++;
            displaySuggestion(suggestion[i], level, suggestionList);
        }

    }
    else {
        /* display simple suggestion */
        if (level >2)
            suggestionList.push(' in ' +suggestion);
        else
            suggestionList.push(suggestion);
    }
}

function displayAllSuggestions(suggestionList, query)  {

    var list= document.getElementById("suggestions");
    clear_list (list);
    var name ="";
    var deptPrefix =' in ';

    for (var i=0; i < suggestionList.length; i++)  {
        var str_array = null;
        var deptName ="0";
        var li = document.createElement("li");

        var index = suggestionList[i].indexOf(deptPrefix);
        /* test if that's department array structure example ->"Electronics,3241" */
        if (index != -1) {
            str_array = suggestionList[i].split(",");
            if(name == "")  {
                name = suggestionList[i-1];
            }
            li.className="child";
            deptName = str_array[0].substr(index + deptPrefix.length);
        }
        /* put name in text, dept ID in value */
        li.innerHTML = str_array != null ? str_array[0] : suggestionList[i];
        li.id = str_array != null ? deptName : "0";
        li.name = str_array != null ? name : "";
        li.onclick = submitSearch;
        list.appendChild(li);
   }

}
function displayOtherElements(query) {

    /* show hide header */
    var globalHeader = document.getElementById('globalHeader');
    if (globalHeader != null && globalHeader != undefined)  {
        if (query == null || query == "")
            globalHeader.style.display = "block";
        else
         globalHeader.style.display = "none";
    }

    /* deal with search page */
    var title = document.getElementById('search_title2');
    var panel = document.getElementById('search_panel2');

    if (title != null && title != undefined)  {
        if (query == null || query == "")
            title.style.display = "block";
        else
         title.style.display = "none";
    }
    if (panel != null && panel != undefined)  {
        if (query == null || query == "")
            panel.style.paddingTop = "10px";
        else
            panel.style.paddingTop = "0px";
    }
    /* Make sure focus corretly set to query input field when page layout chenges */
    if(query != null && (query =="" || query.length == 1))  {
         document.getElementById('query').focus();
    }


}
function clear_list (list) {
    if (list)   {
        while( list.hasChildNodes() ) {
        list.removeChild( list.lastChild );
        }
    }
}

function isArray(obj) {
    return (obj.constructor.toString().indexOf('Array') != -1);
}
function submitSearch() {

    var input = document.getElementsByName('query').item(0);
    var dept = document.getElementById('department');
    dept.value = this.id;
    if (dept.value != 0)
        input.value = this.name;
    else
       input.value = getText(this);

      document.forms[0].submit();

}

 function getText(el) {
    /* for most browsers */
    if (typeof el.textContent == 'string')
        return el.textContent;
    /* for IE */
    else if (typeof el.innerText == 'string')
        return el.innerText;
    /* just in case */
    else
        return el.innerHTML;
}

function expandRefineResultsPanel() {

    var refineToggle = document.getElementById('refine_toggle');
	if(refineToggle){
        var click;
        if (document.createEvent) {/* Firefox & Netscape */
            click = document.createEvent('MouseEvents');
            click.initEvent('click',0,0);
            refineToggle.dispatchEvent(click);
        }
        else if (document.createEventObject) { /* IE */
            click = document.createEventObject();
            refineToggle.fireEvent('onclick', click);
        }
    }

}

function expandElement(elementId) {

    var toggle = document.getElementById(elementId);
	if(toggle){
        var click;
        if (document.createEvent) {/* Firefox & Netscape */
            click = document.createEvent('MouseEvents');
            click.initEvent('click',0,0);
            toggle.dispatchEvent(click);
        }
        else if (document.createEventObject) { /* IE */
            click = document.createEventObject();
            toggle.fireEvent('onclick', click);
        }
    }

}

var wm = wm || {};

wm.onSearch = function() {
  $("input#query").focus();
}

function selectRadio(m){
 var radioButton = m.getElementsByTagName("input");
  if(radioButton.length>0){
  radioButton[0].checked=true;
  }
}

function checkBox(m){
 if(m.checked){
 m.checked=false;
 return;
 }
 m.checked=true;
}
function selectCheckBox(m){
 var radioButton = m.getElementsByTagName("input");
  if(radioButton.length>0){
  if(radioButton[0].checked){
     radioButton[0].checked=false;
     return;
     }
  
     radioButton[0].checked=true;
   
  }
}
function findPickupLocation(m){
  getLocation(m);
  var gpsText=m.getElementsByTagName("a");
  if(gpsText.length>0)
  {
    gpsText[0].innerHTML = "Finding your location"
  }
}

(function(){
    if(typeof wm == 'undefined') {
      wm = {};
    }
    if(typeof wm.mobile == 'undefined') {
      wm.mobile = {};
    }
    if(typeof wm.mobile.storeFinder == 'undefined') {
      wm.mobile.storeFinder = {
        geoLocation:{
          ERROR_CODE:{
            NOT_SUPPORTED:{code:-255,message:"Geolocation not supported."},
            /*USER_DENIED:{code:-1,message:"User denied."},*/
            PERMISSION_DENIED:{code:1,message:"Permission denied."},
            UNAVAILABLE:{code:2,message:"Position unavailable."},
            TIMEOUT:{code:3,message:"Timed out."}
          },
          getPosition:function(handler,errorHandler) {
            var error = null;

            if(typeof navigator.geolocation !== 'undefined') {
              navigator.geolocation.getCurrentPosition(handler,errorHandler,{timeout:5000,enableHighAccuracy:true});
            } else if(typeof google !== 'undefined' && typeof google.gears !== 'undefined') {
              google.gears.factory.create('beta.geolocation').getCurrentPosition(handler,errorHandler);
            } else {
              errorHandler(this.ERROR_CODE.NOT_SUPPORTED);
            }
          }
        }
      }
    }

    if(typeof wm.mobile.form == 'undefined') {
      wm.mobile.form = {
        clearInputError: function(element) {
          $(element).removeClass('input-error');
        },

        processOrderAnimation: function() {
			$("#loadingContent").show();
			$("#placeOrderContent").hide();
			$("#returnToCartContainer").hide();
			$(".returnBtn").hide();
			$(".errorMsg").hide();
        }
      }
    }

})();

if(typeof wm.mobile.search == 'undefined') {
	wm.mobile.search = {

		// how often the type ahead request query will take place 
		THROTTLE_DELAY_MILLIS: 500,

		// max times we try to locate the base URL
		BASE_URL_MAX_TRY_COUNT: 6,

		// how many times we have tried to locate the base url
		baseUrlTryCount: 0,
		
		/**
		 * Initialize search component by retrieving the CDN base search URL.
		 * Search URL format is {base url}{search term}.js
		 */
		init: function() {
			if (!wm.mobile.search.baseUrl)
				wm.mobile.search.getBaseUrl();
		},

		/**
		 * Async method for retrieving the base url and performing some action.
		 * @param func the callback 
		 */
		getBaseUrl: function(callback) {
			if (wm.mobile.search.baseUrlTryCount < wm.mobile.search.BASE_URL_MAX_TRY_COUNT) {
				wm.mobile.search.baseUrlTryCount++;

				var index = window.location.href.indexOf("/", 10);
				var url = window.location.href.substring(0, index) + "/m/j/?service=Suggestions&method=getSuggestionsBaseUrlP";
				url = url.replace("https:", "http:");

				$.getScript(url, function() {
					// the search base URL was already assigned to wm.mobile.search.baseUrl in the JSONP callback
					if (wm.mobile.search.baseUrl && callback) {
						callback(wm.mobile.search.baseUrl);
					}
				});
			}
		},

		/**
		 * JSONP callback for the getBaseUrl method.
		 */
		suggestionsBaseUrlCallback: function(obj) {
			wm.mobile.search.baseUrl = obj.baseUrl;
		},

		/**
		 * Perform the search with the provided prefix
		 */
		searchOn: function(prefix) {
			if (prefix == "") {
				wm.mobile.search.searchToken = prefix;
				wm.mobile.search.hideSuggestions();
			}
			else {
				prefix = prefix.replace(" ", "_20");
				prefix = escape(prefix);
				wm.mobile.search.searchToken = prefix;

				var milis = new Date().getTime();
				if (!wm.mobile.search.nextAccessTime || wm.mobile.search.nextAccessTime <= milis) {
					// throttle time is over - go ahead
					wm.mobile.search.doThrottledSearch();
				}
				else {
					if (!wm.mobile.search.throttling) {
						// we need to set a timer
						wm.mobile.search.throttling = true;
						var delay = wm.mobile.search.nextAccessTime - milis;
						setTimeout("wm.mobile.search.doThrottledSearch()", delay);
					}
				}
			}
		},

		/**
		 * Post throttling search which may not yet have an initialized base URL.
		 */
		doThrottledSearch: function() {
			wm.mobile.search.throttling = false;
			wm.mobile.search.nextAccessTime = new Date().getTime() + wm.mobile.search.THROTTLE_DELAY_MILLIS;
			if (wm.mobile.search.searchToken != "") {
				if (!wm.mobile.search.baseUrl) {
					wm.mobile.search.getBaseUrl(wm.mobile.search.doInitializedSearch);
				}
				else {
					wm.mobile.search.doInitializedSearch();
				}
			}
		},

		/**
		 * Using the search token (previously set as wm.mobile.search.searchToken), initiate the search
		 * @param baseUrl the base URL
		 */
		doInitializedSearch: function() {
			var searchUrl = wm.mobile.search.baseUrl + wm.mobile.search.searchToken + ".js";
			$.getScript(searchUrl, function() {
				// the search was already in the JSONP callback - see how many entries were loaded
				// var hasResults = ($("#suggestions").find("li").size() > 0);
				var input = $("#query").val();
				if (input != "") {
					wm.mobile.search.showSuggestions();							
				}
				else {
					wm.mobile.search.hideSuggestions();
				}
			});
		},

		/**
		 * Show the pre-loaded suggestion DOM structure.
		 */
		showSuggestions: function() {
            var $suggestions = $("#suggestions_overlay");
            var $globalHeader = $("#headerLogoPanel");
            var $searchHeader = $("#searchHeader");
            var $innerPage= $("#innerPage");
            /*
             * Hide the search results or underlying page content.
             * Since layout is inconsistent we can not rely on
             * a specific element id.
             */
             wm.mobile.search.slideUp([
                //$globalHeader,
                 $innerPage
            ]);
             wm.mobile.search.slideDown([
                $searchHeader,
                $suggestions
            ]);

            $suggestions.width($(window).width()-20);
            $suggestions.offset({
                left:0
            });
            $("#searchoverlay").show();
		},

		/**
		 * Hide all suggestions and show the standard page.
		 */
    	hideSuggestions: function () {
            var $suggestions = $("#suggestions_overlay");
            var $globalHeader = $("#headerLogoPanel");
            var $searchHeader = $("#searchHeader");
            var $innerPage= $("#innerPage");
            /*
             * Hide the search results or underlying page content.
             * Since layout is inconsistent we can not rely on
             * a specific element id.
             */
             wm.mobile.search.slideDown([
                //$globalHeader,
                $innerPage
            ]);
             wm.mobile.search.slideUp([
                $searchHeader,
                $suggestions
            ]);
            $("#searchoverlay").hide();
            $("#query").val("");
        },

        /**
         * Slide down action used for search transition
         */
        slideDown: function($elements) {
             for(var edx=0;edx<$elements.length;edx++) {
                if($elements[edx]) {
                    $elements[edx].slideDown("fast");
                }
             }
        },

        /**
         * Slide up action used for search transition
         */
        slideUp: function($elements) {
            for(var edx=0;edx<$elements.length;edx++) {
                if($elements[edx]) {
                    $elements[edx].slideUp("fast");
                }
            }
        }
	}
}

(function() {
    window.addEventListener('load', function() {
              var val = sessionStorage.getItem('_phoenixCache');
              if (!val) {
                setTimeout(function() {
                  sessionStorage.setItem('_phoenixCache', 'true');
                  $.ajax({
                    url: '/r/phoenix/web/base.js',
                    dataType: 'text'
                  });
                  var cssLoads = [
                    { maxRatio: 1.4, href: '/r/phoenix/web.css' },
                    { minRatio: 1.5, href: '/r/phoenix/web@2x.css' }
                  ];
                  var ratio = window.devicePixelRatio || 1;
                  for (var i = 0; i < cssLoads.length; ++i) {
                        var css = cssLoads[i];
                        if ((!css.maxRatio || ratio <+ css.maxRatio) && (!css.minRatio
|| css.minRatio <= ratio)) {
                                  $.ajax({
                                            url: css.href,
                                            dataType: 'text'
                                          });
                            }
                      }
                }, 2000);
              }
    });
})();
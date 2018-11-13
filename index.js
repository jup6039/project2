window.onload = init;
	
	function init() {
		document.querySelector("#search").onclick = getData;
	}
	
	let term = ""; // we declared `term` out here because we will need it later
	function getData(){
		// main entry point to web service
		const SERVICE_URL = "https://cors-anywhere.herokuapp.com/https://api.jikan.moe/v3/search/"; // anime/?q=";
		
		// No API Key required!
        let selection = document.querySelector("#selections").value;
        
        let limit = document.querySelector("#limit").value;
		
		let currentstatus = document.querySelector("#currentstatus").value;
		
		let maturity = document.querySelector("#maturity").value;
		
		// build up our URL string
		let url = SERVICE_URL;
		
		// parse the user entered term we wish to search
		term = document.querySelector("#searchterm").value;
		
		// get rid of any leading and trailing spaces
		term = term.trim();
		// encode spaces and special characters
		term = encodeURIComponent(term);
		
		// if there's no term to search then bail out of the function (return does this)
		if(term.length < 1){
			document.querySelector("#debug").innerHTML = "<b>Enter a search term first!</b>";
			return;
		}
        
        url += selection + "/";
		url += "?q=" + term;
        url += "&limit=" + limit;
        url += "&page=1";
		url += "?status=" + currentstatus;
		url += "&rated=" + maturity;
		url += "&genre=";
		
		// Genre Selection
		let genre = document.getElementsByName("genre[]");
		
		for (let i = 0; i<genre.length; i++) {
			if (genre[i].checked) 
			{
				url += genre[i].value + "%2C";
			}
		}
		
		// update the UI
		document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
		
		// call the web service, and prepare to download the file
		$.ajax({
		  dataType: "json",
		  url: url,
		  data: null,
		  success: jsonLoaded
		});
		
		
	}
	
	function jsonLoaded(obj){
		// if there are no results, print a message and return
		if(obj.error){
			let msg = obj.error;
			document.querySelector("#content").innerHTML = `<p><i>Problem! <b>${msg}</b></i></p>`;
			return; // Bail out
		}
		
		// if there is an array of results, loop through them
		let term2 = "results";
        let results = obj[term2];
		if(!results){
			document.querySelector("#content").innerHTML = `<p><i>Problem! <b>No results for "${term}"</b></i></p>`;
			return;
		}
        
		if (document.querySelector("#ratingCheck").checked){
            results = results.sort(function(a, b){return b.score - a.score});
        }
        
		let bigString = `<p><i>Here are <b>${results.length}</b> results!</i></p>`; // ES6 String Templating
		
		for (let i=0;i<results.length;i++){
			let result = results[i];
			let url = result.url;
			let title = result.title;
			let img = result.image_url;
			let rating = result.rated;
			let scoreRating = result.score;
			var line = `<div class='result'><a href='${url}'>${title}</a><p>${rating}</p>`;
			line += `<p>Rated: ${scoreRating}</p>`;
			line += `<img src='${img}'></div>`;
			bigString += line;
		}
		
		// display final results to user
		document.querySelector("#content").innerHTML = bigString;
	}

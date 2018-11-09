window.onload = init;
	
	function init() {
		document.querySelector("#search").onclick = getData;
	}
	
	let term = ""; // we declared `term` out here because we will need it later
	function getData(){
		// 1 - main entry point to web service
		const SERVICE_URL = "https://api.jikan.moe/v3/search/anime/?q=";
		
		// No API Key required!
		
		// 2 - build up our URL string
		let url = SERVICE_URL;
		
		// 3 - parse the user entered term we wish to search
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
		url += term;
        url += "&page=1";
		
		// 4 - update the UI
		document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
		
		// 5- call the web service, and prepare to download the file
		$.ajax({
		  dataType: "json",
		  url: url,
		  data: null,
		  success: jsonLoaded
		});
		
		
	}
	
	
	function jsonLoaded(obj){
		// 6 - if there are no results, print a message and return
		if(obj.error){
			let msg = obj.error;
			document.querySelector("#content").innerHTML = `<p><i>Problem! <b>${msg}</b></i></p>`;
			return; // Bail out
		}
		
		// 7 - if there is an array of results, loop through them
		// this is a weird API, the name of the key is the day of the week you asked for
		let term2 = "results";
        let results = obj[term2];
		if(!results){
			document.querySelector("#content").innerHTML = `<p><i>Problem! <b>No results for "${term}"</b></i></p>`;
			return;
		}
		
		
		let bigString = `<p><i>Here are <b>${results.length}</b> results!</i></p>`; // ES6 String Templating
		
		for (let i=0;i<results.length;i++){
			let result = results[i];
			let url = result.url;
			let title = result.title;
			var line = `<p class='result'><a href='${url}'>${title}</a></p>`;
			bigString += line;
		}
		
		// 8 - display final results to user
		document.querySelector("#content").innerHTML = bigString;
	}
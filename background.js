// Start event listener for DOM content
document.addEventListener('DOMContentLoaded', function() {
    
    //chrome.storage.sync.clear();
    
    // Load past lists
    showLinks();
    
    // Eventlistener for settings
    document.getElementById('header_setting_id').addEventListener('click', settings);
    
    // Eventlistener for add
    document.getElementById('header_add_id').addEventListener('click', addLinks);
});
                                                          
function addLinks() {
    /*
        1. Skab en ny kolonne og spørg efter navn
        2. få alle tabs
        3. Gem med alt ny data
    */
        
    // Initiate array to hold links
    var links = [];
        
    // Loop through all tabs - Find out how to add callback
    chrome.windows.getAll({populate:true},function(windows){
		windows.forEach(function(window){
	    	window.tabs.forEach(function(tab){
	    		// Lægger alle links ind i et array
	      		links.push(tab.url);
	    	});
	  	});
	});
    
    var linkName;
    
    // Get table id
    var table = document.getElementById('table');
    
    //Insert row
    var row = table.insertRow(0);
    
    //Insert cell
    var cell = row.insertCell(0);
    
    //Add inputbox
    cell.innerHTML = '<input id="table_element_textbox" type="text" autofocus>';
    
    // Listen after submit
    document.getElementById('table_element_textbox').addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
            // Submit form
            linkName = document.getElementById('table_element_textbox').value;
            console.log(linkName);
            
            // Delete inputbox and insert new list
            cell.innerHTML = '<div id="table_element_text"><b>' + linkName + '</b></div><i id="table_element_delete" class="material-icons" name="' + linkName + '">delete</i>';
            // Add event listener
            document.getElementById('table_element_text').addEventListener('click', openLinks);
            document.getElementById('table_element_delete').addEventListener('click', deleteLinks);
            
            // Store links i Chrome Storage
            chrome.storage.sync.set({
                [linkName]:links
            }, function() {
                console.log("Saved");
            });
        }
    });
    
    // Save links to chrome storage
	//setTimeout(function() {}, 2000);
}

function showLinks() {
    // Get all arrays from chrome storage
    chrome.storage.sync.get(null, function(items) {
        var keys = Object.keys(items);
        
        // Get table from document
        var table = document.getElementById('table');
        var row;
        var cell;
        
        // Loop through every list
        for (i = 0; i < keys.length; i++) {
            var row = table.insertRow(0);
            
            row.innerHTML = '<td id=' + keys[i] + '><div id="table_element_text"><b>' + keys[i] + '</b></div><div id="table_element_delete" class="material-icons" name="' + keys[i] + '">delete</div></td>'
            //var cell = row.insertCell(0);
            
            // Add all html to cell
            //cell.innerHTML = '<div id="table_element_text"><b>' + keys[i] + '</b></div><div id="table_element_delete" class="material-icons" name="' + keys[i] + '">delete</div>';
            
            // Add eventlisteners to buttons
            document.getElementById('table_element_text').addEventListener('click', openLinks);
            document.getElementById('table_element_delete').addEventListener('click', deleteLinks);
        }
    });
}

function openLinks() {
    chrome.storage.sync.get(this.name, function(links) {
        // Get first first element of callback
        var value = Object.values(links)[0];
        
        // Loop through every link
        for (i = 0; i < value.length; i++) {
            chrome.tabs.create({url: value[i]});
            //console.log(value[i]);
        }
    })
}

function deleteLinks() {
    var name = this.getAttribute('name');
    chrome.storage.sync.remove(name, function() {
        console.log('Deleted!');
        
        // Remove row from list
        document.getElementById('table').innerHTML = "";
        showLinks();
    })
}

function settings() {
    console.log("test");
}
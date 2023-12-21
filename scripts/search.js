function trim(s) { 
    return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
}

// build dict of nodes and their text content
function nodeText(node=document.getRootNode(), elementDict) {
    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            text = trim(child.textContent);
            if (text === "") {
                continue;
            }

            if (text in elementDict) {
                elementDict[text].push(child.parentElement.getAttribute("data-sem-search-label"));
            } else {
                elementDict[text] = [child.parentElement.getAttribute("data-sem-search-label")];
            }
        } else {
            nodeText(child, elementDict);
        }
    }
    
    return elementDict;
}

document.addEventListener('DOMContentLoaded', function() {
    let searchBar = document.getElementById("search-bar");
    searchBar.focus();
    searchBar.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            let searchText = searchBar.value;
            console.log(searchText);
            
            chrome.tabs.query({
                active: true,
                currentWindow: true
              }, tabs => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {from: 'popup', subject: 'DOMInfo'},
                ).then(response => {
                    // reconstruct html
                    let body = document.createElement("div");
                    body.innerHTML = response;
                    console.log(body);

                    console.log(body.textContent)

                    elementDict = nodeText(body, {});
                    console.log(elementDict);


                });
              });
        }
    });
});

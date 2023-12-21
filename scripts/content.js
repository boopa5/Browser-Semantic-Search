chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.from === "popup") {

        // insert ids for each text node
        let counter = 0;


        labelTextNodes(document.body, 0)
        sendResponse(document.body.innerHTML);
    }
});

function trim(s) { 
    return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
}

function labelTextNodes(node, counter) {
    for (let i = 0; i < node.childNodes.length; ++i) {
        if (node.childNodes[i].nodeType === Node.TEXT_NODE) {
            text = trim(node.childNodes[i].textContent);
            if (text === "") {
                continue;
            }
            console.log(node.childNodes[i].parentElement);
            console.log(counter);
            node.childNodes[i].parentElement.setAttribute("data-sem-search-label", counter)
            counter += 1;
        } else {
            counter = labelTextNodes(node.childNodes[i], counter);
        }
    }

    return counter;
}
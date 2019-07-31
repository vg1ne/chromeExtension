var classToAdd = 'js-autofill-marked'

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    classes = message.data.ignoreValue.replace(/\s/g, '').split(',')
    timesToRepeatText = message.data.repeatCount

    var nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT, function(node) {
        if(node.parentElement.classList.contains(classToAdd)) return NodeFilter.FILTER_SKIP

        var hasAnyOfClasses = classes.some(function(nodeClass){
            return node.parentElement.closest(`.${nodeClass}`)
        })
        return hasAnyOfClasses ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
    });

    var cnode;

    while (cnode = nodeIterator.nextNode()) {
        var textNotEmpty = cnode.textContent.replace(/\s/g, '');
        if(cnode.textContent && textNotEmpty) {
            cnode.parentElement.classList.add(classToAdd)
            cnode.textContent = cnode.textContent.concat(' ').repeat(timesToRepeatText)
        }
    }
})

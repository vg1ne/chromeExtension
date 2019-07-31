'use strict'

var classes = ['main-header', 'mat-button-toggle', 'interval-time', 'mat-card-actions', 'mat-button-wrapper']
var timesToRepeatText = 5
var autofillExtensionSettingsKey = 'autofillExtensionSettings'
var autofillScriptFile = 'edit-html.js'
var controlIds = {
    ignore: 'ignore-input',
    repeatCount: 'repeat-count',
    submit: 'submit',
    restore: 'restore',
    save: 'save',
    autofillContent: 'autofill-content',
}
document.addEventListener('DOMContentLoaded', function() {
    afterDOMLoaded()
})

function afterDOMLoaded() {
    addEventListenerForSubmit()
    addEventListenerForSave()
    addEventListenerForRestore()
    executeScript()
    handleSavedSettings()
}

function handleSavedSettings() {
    chrome.storage.local.get(autofillExtensionSettingsKey, function(settings) {
        const ignoreInput = document.getElementById(controlIds.ignore)
        const repeatInput = document.getElementById(controlIds.repeatCount)
        ignoreInput.value = settings.autofillExtensionSettings.ignoreValue || classes
        repeatInput.value = settings.autofillExtensionSettings.repeatCount || timesToRepeatText
    });
}

function executeScript() {
    let tabId

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, ([currentTab]) => {
        tabId = currentTab.id
        chrome.tabs.executeScript(tabId, { file: autofillScriptFile })
    });
}

function addEventListenerForSubmit() {
    const button = document.getElementById(controlIds.submit);
    if (button !== null) {
        button.addEventListener('click', submit);
    }
}

function addEventListenerForSave() {
    const button = document.getElementById(controlIds.save);
    if (button !== null) {
        button.addEventListener('click', saveSettings);
    }
}

function addEventListenerForRestore() {
    const button = document.getElementById(controlIds.restore);
    if (button !== null) {
        button.addEventListener('click', restoreSettings);
    }
}

function getIgnoreValue() {
    const ignoreInput = document.getElementById(controlIds.ignore)
    return ignoreInput.value
}

function getRepeatCount() {
    const repeatInput = document.getElementById(controlIds.repeatCount)
    return repeatInput.value
}

function saveSettings() {
    const ignoreValue = getIgnoreValue()
    const repeatCount = getRepeatCount()
    const settingsToSave = {
        'ignoreValue': ignoreValue,
        'repeatCount': repeatCount
    }

    chrome.storage.local.set({'autofillExtensionSettings': settingsToSave});
}

function restoreSettings() {
    const ignoreValue = classes
    const repeatCount = timesToRepeatText
    const settingsToSave = {
        'ignoreValue': ignoreValue,
        'repeatCount': repeatCount
    }

    chrome.storage.local.set({autofillExtensionSettingsKey: settingsToSave});
    handleSavedSettings()
}

function submit() {
    let tabId
    const ignoreValue = getIgnoreValue()
    const repeatCount = getRepeatCount()

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, ([currentTab]) => {
        tabId = currentTab.id
        chrome.tabs.sendMessage(tabId, {
            data: {
                ignoreValue,
                repeatCount: +repeatCount,
            }});
    });
}

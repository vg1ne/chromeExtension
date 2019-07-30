'use strict';
var classes = ['main-header', 'mat-button-toggle', 'interval-time', 'mat-card-actions','mat-button-wrapper']
var timesToRepeatText = 5

document.addEventListener('DOMContentLoaded', function () {
  addEventListenerForSubmit()
  addEventListenerForSave()
  addEventListenerForRestore()
  executeScript()
  handleSavedSettings()
});

function handleSavedSettings() {
  chrome.storage.local.get('autofillExtensionSettings', function(settings) {
    const ignoreInput = document.getElementById('ignore-input')
    const repeatInput = document.getElementById('repeat-count')
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
    chrome.tabs.executeScript(tabId, { file: 'edit-html.js' })
  });
}

function addEventListenerForSubmit() {
  const button = document.getElementById("submit");
  if (button !== null) {
    button.addEventListener('click', submit);
  }
}

function addEventListenerForSave() {
  const button = document.getElementById("save");
  if (button !== null) {
    button.addEventListener('click', saveSettings);
  }
}

function addEventListenerForRestore() {
  const button = document.getElementById("restore");
  if (button !== null) {
    button.addEventListener('click', restoreSettings);
  }
}

function getIgnoreValue() {
  const ignoreInput = document.getElementById('ignore-input')
  return ignoreInput.value
}

function getRepeatCount() {
  const repeatInput = document.getElementById('repeat-count')
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

  chrome.storage.local.set({'autofillExtensionSettings': settingsToSave});
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

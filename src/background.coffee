settings = new Store("settings",
  "enableIMDb": true,
  "enableRotten": true
)

chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
  sendResponse settings.toObject() if request == "get-settings"
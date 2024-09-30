const hostnames = ["amazon.", "steamdeck.com", "store.steampowered.com"];

let stateTabs = [];

chrome.offscreen.createDocument({
  url: chrome.runtime.getURL("audio.html"),
  reasons: ["AUDIO_PLAYBACK"],
  justification: "notification",
});

function triggerSound() {
  chrome.runtime.sendMessage({
    type: "play-sound",
    target: "offscreen-doc",
  });
}

chrome.action.onClicked.addListener(async () => {
  triggerSound();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    const hostname = new URL(changeInfo.url).hostname;

    if (hostnames.some((host) => hostname.includes(host))) {
      stateTabs.push(tabId);

      triggerSound();
    }
  }
});

// Detect when user closes the tab
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (stateTabs.includes(tabId)) {
    stateTabs = stateTabs.filter((tab) => tab !== tabId);
  }

  if (stateTabs.length === 0) {
    chrome.runtime.sendMessage({
      type: "stop-sound",
      target: "offscreen-doc",
    });
  }
});

// Receive messages from the offscreen document
chrome.runtime.onMessage.addListener(function (message) {
  switch (message.type) {
    case "sound-started":
      chrome.action.setIcon({
        path: "images/icon-128.png",
      });
      break;
    case "sound-stopped":
      chrome.action.setIcon({
        path: "images/icon-128-gray.png",
      });
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
});

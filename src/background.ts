chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) {
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    files: ['content.js'],
  });
});

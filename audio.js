const audio = document.getElementById("shop-audio");
audio.volume = 0.5;

chrome.runtime.onMessage.addListener(handleMessages);

async function handleMessages(message) {
  if (message.target !== "offscreen-doc") {
    return;
  }

  switch (message.type) {
    case "play-sound":
      if (audio.paused) {
        audio.play();

        chrome.runtime.sendMessage({
          type: "sound-started",
          target: "background",
        });
      }
      break;
    case "stop-sound":
      audio.pause();
      audio.currentTime = 0;

      chrome.runtime.sendMessage({
        type: "sound-stopped",
        target: "background",
      });

      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
}

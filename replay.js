const set = document.getElementById('set');

// When the button is clicked, inject setPageBackgroundColor into current page
set.addEventListener('click', async () => {
    let [ tab ] = await chrome.tabs.query({ active: true, currentWindow: true });

    const starMin = document.getElementById('start-min').value;
    const startSec = document.getElementById('start-sec').value;
    const endMin = document.getElementById('end-min').value;
    const endSec = document.getElementById('end-sec').value;

    const start = parseInt(starMin, 10) * 60 + parseInt(startSec);
    const end = parseInt(endMin, 10) * 60 + parseInt(endSec);

    chrome.storage.sync.set({ value: [start, end] });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPeriodReplay,
    });
});

  // The body of this function will be executed as a content script inside the
  // current page
function setPeriodReplay(start, end) {
    const videoElement = document.getElementsByClassName('html5-main-video')[0];

    chrome.storage.sync.get('value', ({ value: [start, end] }) => {

        console.log('Find element ', videoElement);
        console.log('Start from ', start, 'to ', end);

        videoElement.addEventListener('timeupdate', (event) => {
            const element = event.target;

            if (element.currentTime >= parseInt(end, 10)) {
                element.currentTime = parseInt(start, 10);
                element.play();
            }
        }, false);
    });
}
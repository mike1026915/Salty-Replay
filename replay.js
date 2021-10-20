const set = document.getElementById('set');

// When the button is clicked, inject setPageBackgroundColor into current page
set.addEventListener('click', async () => {
    let [ tab ] = await chrome.tabs.query({ active: true, currentWindow: true });

    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

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

            if (element.currentTime >= Number(end)) {
                element.currentTime = Number(start);
                element.play();
            }
        }, false);
    });
}
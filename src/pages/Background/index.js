console.log('This is the background page.');
console.log('Put the background scripts here.');

const extension = require('extensionizer');

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  console.log('background script get message 1');
  console.log('request: ', request);
  console.log('sender: ', sender);
  console.log('sendResponse: ', sendResponse);
  // console.log('url: ', chrome.runtime.getURL());

  if (request === 'notification') {
    console.log('open notification');
    // const { screenX, screenY, outerWidth } = window
    // const top = Math.max(screenY, 0)
    // const left = Math.max(screenX + (outerWidth - 360), 0)
    try {
      const options = {
        url: 'popup.html#/notification',
        type: 'popup',
        width: 360,
        height: 620,
        left: 100,
        top: 100,
      }
      await extension.windows.create(options, (newWindow) => {
      })

      // chrome.notifications.create('NOTFICATION_ID', {
      //   type: 'basic',
      //   iconUrl: 'icon-128.png',
      //   title: 'notification title',
      //   message: 'notification message',
      //   priority: 2
      // }, function (context) {
      //   console.log("Last error:", chrome.runtime.lastError);
      //   alert(JSON.stringify(chrome.runtime.lastError));
      // })
    } catch (error) {
      console.log('create notification error: ', error);
    }
  }
})
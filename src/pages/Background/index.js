const extension = require('extensionizer');
const queryString = require('query-string');

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const { notificationId } = request;
    if (request.type === 'fromPage' && request.method === 'signin') {
      const stringified = queryString.stringify(request);
      const url = `popup.html#/notification?${stringified}`;
      const options = {
        url,
        type: 'popup',
        width: 360,
        height: 620,
        left: 100,
        top: 100,
      }

      // Open the chrome extension's popup to ask user to reject or approve
      extension.windows.create(options, (newWindow) => {
        console.log('newWindow: ', newWindow);
      })
    }

    if (request.type === 'result') {
      // Set the result to chrome's extension local storage
      chrome.storage.local.set({ [`notification-result-${request.notificationId}`]: JSON.stringify(request) }, function () {
        console.log('key: ', [`notification-result-${request.notificationId}`]);
        console.log('Value is set to: ', JSON.stringify(request));
      });
    }

    sendResponse(notificationId);
  }
)

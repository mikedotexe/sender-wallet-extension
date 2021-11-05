const extension = require('extensionizer');
const queryString = require('query-string');

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const notificationId = Date.now();

    if (request.type === 'fromPage' && request.method === 'signin') {
      const stringified = queryString.stringify({ ...request, notificationId });
      const url = `popup.html#/notification?${stringified}`;
      const options = {
        url,
        type: 'popup',
        width: 360,
        height: 620,
        left: 100,
        top: 100,
      }
      extension.windows.create(options, (newWindow) => {
        console.log('newWindow: ', newWindow);
      })

      console.log('notificationId: ', notificationId);
    }

    if (request.type === 'result') {
      chrome.storage.local.set({ [`result-${request.notificationId}`]: JSON.stringify(request) }, function () {
        console.log('key: ', [`result-${request.notificationId}`]);
        console.log('Value is set to: ', JSON.stringify(request));
      });
    }

    sendResponse(notificationId);
  }
)

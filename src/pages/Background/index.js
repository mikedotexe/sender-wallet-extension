const extension = require('extensionizer');
const queryString = require('query-string');

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    try {
      const { notificationId } = request;
      request.url = sender.url;
      if (request.type === 'fromPage') {
        let url;
        const stringified = queryString.stringify({ ...request, params: JSON.stringify(request.params) });
        if (request.method === 'toHomePage') {
          url = `popup.html#/setpwd?${stringified}`;
        }
        if (request.method === 'signin') {
          url = `popup.html#/notification/signin?${stringified}`;
        }
        if (request.method === 'signAndSendTransaction') {
          url = `popup.html#/notification/signAndSendTransaction?${stringified}`;
        }
        console.log('url: ', url);
        const options = {
          url,
          type: 'popup',
          width: 375,
          height: 600,
          left: 100,
          top: 100,
        }

        // Open the chrome extension's popup to ask user to reject or approve
        extension.windows.create(options, (newWindow) => {
          console.log('newWindow: ', newWindow);
        })
      }

      console.log('background receive request: ', request);

      if (request.type === 'result') {
        // Set the result to chrome's extension local storage
        chrome.storage.local.set({ [`notification-result-${request.notificationId}`]: JSON.stringify(request) }, function () {
          console.log('Notification: ');
          console.log('key: ', [`notification-result-${request.notificationId}`]);
          console.log('Value is set to: ', JSON.stringify(request));
        });

        if (request.method === 'signin' && request.res && request.res.status && request.res.status.hasOwnProperty('SuccessValue')) {
          console.log('need to save publick key - request: ', request);

          const { accountId, contractId, accessKey } = request;
          chrome.storage.local.set({ [`${contractId}-${accountId}`]: accessKey }, function () {
            console.log('Contract access key: ');
            console.log('key: ', [`${contractId}-${accountId}`]);
            console.log('Value is set to: ', accessKey);
          })
        }
      }

      sendResponse(notificationId);
    } catch (error) {
      console.log('bg error: ', error)
    }
  }
)

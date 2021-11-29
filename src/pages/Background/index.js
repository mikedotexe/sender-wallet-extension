import _ from 'lodash';
const extension = require('extensionizer');
const queryString = require('query-string');

extension.windows.onRemoved.addListener((windowId) => {
  const key = `notification-windowId-${windowId}`;
  chrome.storage.local.get([key], function (result) {
    let notificationId = null
    if (!_.isEmpty(result) && result[key]) {
      notificationId = result[key];

      const request = { type: 'sender-wallet-result', error: 'User reject', notificationId };
      chrome.storage.local.set({ [`notification-result-${request.notificationId}`]: request }, function () {
      });
    }
  });
})

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    try {
      const { notificationId } = request;
      request.url = sender.url;
      if (request.type === 'sender-wallet-fromPage') {
        let url;
        // const stringified = queryString.stringify({ ...request, params: JSON.stringify(request.params) });
        const stringified = queryString.stringify({ notificationId, url: sender.url });
        if (request.method === 'toHomePage') {
          url = `popup.html#/?${stringified}`;
        }
        if (request.method === 'signin') {
          url = `popup.html#/notification/signin?${stringified}`;
        }
        if (request.method === 'signAndSendTransaction' || request.method === 'sendMoney' || request.method === 'requestSignTransactions') {
          url = `popup.html#/notification/signAndSendTransaction?${stringified}`;
        }

        chrome.storage.local.set({ [`notification-request-${request.notificationId}`]: request }, function () {
          chrome.windows.getLastFocused().then(lastFocused => {
            const top = lastFocused.top
            const left = lastFocused.left + (lastFocused.width - 375);
            const options = {
              url,
              type: 'popup',
              width: 375,
              height: 600,
              left,
              top,
            }

            // Open the chrome extension's popup to ask user to reject or approve
            extension.windows.create(options, (newWindow) => {
              chrome.storage.local.set({ [`notification-windowId-${newWindow.id}`]: request.notificationId }, function () { });
            })
          });
        });
      }

      if (request.type === 'sender-wallet-result') {
        // Set the result to chrome's extension local storage
        chrome.storage.local.set({ [`notification-result-${request.notificationId}`]: request }, function () {
        });

        if (request.method === 'signin' && request.res && request.res.status && request.res.status.hasOwnProperty('SuccessValue')) {

          const { accountId, contractId, accessKey } = request;
          chrome.storage.local.set({ [`${contractId}-${accountId}`]: accessKey }, function () {
          })
        }
      }

      sendResponse(notificationId);
    } catch (error) {
      console.log('bg error: ', error)
    }
  }
)

// import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

let notificationId = null;

window.addEventListener('message', function (event) {
  console.log('content message: ', event.data);

  try {
    const data = JSON.parse(event.data);
    if (data.type === 'fromPage' && data.method === 'signin') {
      chrome.runtime.sendMessage(extensionId, data, function (response) {
        notificationId = response;
      })
    }
  } catch (error) {
    console.log('error: ', error);
  }
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === `result-${notificationId}`) {
      window.postMessage(newValue);
    }
  }
});

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}
injectScript(chrome.runtime.getURL('script.bundle.js'), 'body');

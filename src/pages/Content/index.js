// import { printLine } from './modules/print';
import _ from 'lodash';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

window.addEventListener('message', function (event) {
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'fromPage' && data.method === 'signin') {
      chrome.runtime.sendMessage(extensionId, data, function (response) {
      })
    }
  } catch (error) {
    console.log('error: ', error);
  }
})

// Get the user's operation result
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (_.startsWith(key, 'notification-result-')) {
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

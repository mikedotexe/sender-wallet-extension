import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

window.addEventListener("message", function (event) {
  console.log('content script get message: ', event);
  // We only accept messages from ourselves
  chrome.runtime.sendMessage(event.data);
  // chrome.tabs.sendMessage(event.data);
  console.log('sendMessage success');
});

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}
injectScript(chrome.runtime.getURL('script.bundle.js'), 'body');

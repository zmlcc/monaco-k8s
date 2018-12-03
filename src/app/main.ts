// import {greeter} from './greeter'

// let user = "Jane User";

// document.body.innerHTML = greeter(user);


// require('monaco-editor');
// import * as monaco from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// require('monaco-editor/esm/vs/editor/editor.api');
(self as any).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}
require('./client');

// monaco.editor.create(document.getElementById('container')!, {
// 	value: [
// 		'function x() {',
// 		'\tconsole.log("Hello world!");',
// 		'}'
// 	].join('\n'),
// 	language: 'javascript'
// });
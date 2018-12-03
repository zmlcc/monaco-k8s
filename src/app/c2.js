
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import * as monaco from 'monaco-editor';

monaco.languages.register({ id: 'mySpecialLanguage' });

monaco.languages.registerHoverProvider('mySpecialLanguage', {
	provideHover: function(model, position) {
        console.log(model);
		// return xhr('../playground.html').then(function(res) {
		// 	return {
		// 		range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
		// 		contents: [
		// 			{ value: '**SOURCE**' },
		// 			{ value: '```html\n' + res.responseText.substring(0, 200) + '\n```' }
		// 		]
		// 	}
        // });
	}
});

monaco.editor.create(document.getElementById("root"), {
	value: '\n\nHover over this text',
	language: 'mySpecialLanguage'
});


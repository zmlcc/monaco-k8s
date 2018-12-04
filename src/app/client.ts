// import { getLanguageService, TextDocument } from "vscode-json-languageservice";
import { TextDocument, Position } from "vscode-languageserver-types/lib/umd/main";
import { MonacoToProtocolConverter, ProtocolToMonacoConverter } from './monaco-convert';

// import * as monaco from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import * as ys from '../languageservice/yamlLanguageService'

import { xhr, XHRResponse, configure as configureHttpRequests, getErrorStatusDescription } from 'request-light';

import * as URL from 'url';

import {parse} from '../languageservice/parser/yamlParser'

const LANGUAGE_ID = 'yaml';
const MODEL_URI = 'inmemory://model.yaml'
const MONACO_URI = monaco.Uri.parse(MODEL_URI);

// register the YAML language with Monaco
monaco.languages.register({
    id: LANGUAGE_ID,
    extensions: ['.yaml'],
    aliases: ['YAML', 'yaml'],
    mimetypes: ['application/yaml'],
});

// create the Monaco editor
const value = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.15.4
        ports:
        - containerPort: 80`;


monaco.editor.create(document.getElementById("root")!, {
    model: monaco.editor.createModel(value, LANGUAGE_ID, MONACO_URI),
    glyphMargin: true,
    lightbulb: {
        enabled: true
    }
});

// function getModel(): monaco.editor.IModel {
//     return monaco.editor.getModel(MONACO_URI);
// }

function createDocument(model: monaco.editor.IReadOnlyModel) {
    return TextDocument.create(MODEL_URI, model.getModeId(), model.getVersionId(), model.getValue());
}

// function asPosition(lineNumber: number, column: number): Position{
//     const line = lineNumber === undefined || lineNumber === null ? undefined : lineNumber - 1;
//     const character = column === undefined || column === null ? undefined : column - 1;
//     return {
//         line, character
//     };
// }

var schemaProvider = (uri: string) : monaco.Thenable<string> => {
    const schemaJson = "http://localhost:8000/schema.json"
    return Promise.resolve<string>(schemaJson)
}
// function resovleSchema(url: string): Promise<string> {
//     const promise = new Promise<string>((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.onload = () => resolve(xhr.responseText);
//         xhr.onerror = () => reject(xhr.statusText);
//         xhr.open("GET", url, true);
//         xhr.send();
//     });
//     return promise;
// }

const m2p = new MonacoToProtocolConverter();
const p2m = new ProtocolToMonacoConverter();
// const jsonService = getLanguageService({
//     schemaRequestService: resovleSchema
// });

let schemaRequestService = (uri: string): monaco.Thenable<string> => {
	//For the case when we are multi root and specify a workspace location


    let headers = { 'Accept-Encoding': 'br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
};
	return xhr({ url: uri, followRedirects: 5, headers }).then(response => {
		return response.responseText;
	}, (error: XHRResponse) => {
		return Promise.reject(error.responseText || getErrorStatusDescription(error.status) || error.toString());
	});
};

let workspaceContext = {
	resolveRelativePath: (relativePath: string, resource: string) => {
		return URL.resolve(resource, relativePath);
	}
};

// const  yamlService = ys.getLanguageService()

const yss = ys.getLanguageService(schemaRequestService, workspaceContext, []);
yss.registerCustomSchemaProvider(schemaProvider)
// const pendingValidationRequests = new Map<string, number>();

// monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
//     provideCompletionItems(model, position, token): monaco.languages.CompletionItem[] | Thenable<monaco.languages.CompletionItem[]> | monaco.languages.CompletionList | Thenable<monaco.languages.CompletionList> {
//         const document = createDocument(model);
//         const jsonDocument = jsonService.parseJSONDocument(document);
//         return jsonService.doComplete(document, m2p.asPosition(position.lineNumber, position.column), jsonDocument).then((list) => {
//             return p2m.asCompletionResult(list);
//         });
//     },

//     resolveCompletionItem(item, token): monaco.languages.CompletionItem | Thenable<monaco.languages.CompletionItem> {
//         return jsonService.doResolve(m2p.asCompletionItem(item)).then(result => p2m.asCompletionItem(result));
//     }
// });

// monaco.languages.registerDocumentRangeFormattingEditProvider(LANGUAGE_ID, {
//     provideDocumentRangeFormattingEdits(model, range, options, token): monaco.languages.TextEdit[] | Thenable<monaco.languages.TextEdit[]> {
//         const document = createDocument(model);
//         const edits = jsonService.format(document, m2p.asRange(range), m2p.asFormattingOptions(options));
//         return p2m.asTextEdits(edits);
//     }
// });

// monaco.languages.registerDocumentSymbolProvider(LANGUAGE_ID, {
//     provideDocumentSymbols(model, token): monaco.languages.DocumentSymbol[] | Thenable<monaco.languages.DocumentSymbol[]> {
//         const document = createDocument(model);
//         const jsonDocument = jsonService.parseJSONDocument(document);
//         return p2m.asSymbolInformations(jsonService.findDocumentSymbols(document, jsonDocument));
//     }
// });

monaco.languages.registerHoverProvider(LANGUAGE_ID, {
    provideHover(model, position, token): monaco.languages.Hover | monaco.Thenable<monaco.languages.Hover> | null {
        // console.log(model)
        const document = createDocument(model);
        const yamlDoc = parse(document.getText())
        const pp = m2p.asPosition(position.lineNumber, position.column)
        // const jsonDocument = jsonService.parseJSONDocument(document);
        // return jsonService.doHover(document, m2p.asPosition(position.lineNumber, position.column), jsonDocument).then((hover) => {
        //     return p2m.asHover(hover)!;
        // });
        // console.log(document)
        // console.log(yamlDoc)
        const result = yss.doHover(document, pp, yamlDoc)
        console.log(result)

        return result.then((hover) => {
            return p2m.asHover(hover)!;
        })
        
        // return null
    }
});

// getModel().onDidChangeContent((event) => {
//     validate();
// });

// function validate(): void {
//     const document = createDocument(getModel());
//     cleanPendingValidation(document);
//     pendingValidationRequests.set(document.uri, setTimeout(() => {
//         pendingValidationRequests.delete(document.uri);
//         doValidate(document);
//     }));
// }

// function cleanPendingValidation(document: TextDocument): void {
//     const request = pendingValidationRequests.get(document.uri);
//     if (request !== undefined) {
//         clearTimeout(request);
//         pendingValidationRequests.delete(document.uri);
//     }
// }

// function doValidate(document: TextDocument): void {
//     if (document.getText().length === 0) {
//         cleanDiagnostics();
//         return;
//     }
//     const jsonDocument = jsonService.parseJSONDocument(document);
//     jsonService.doValidation(document, jsonDocument).then((diagnostics) => {
//         const markers = p2m.asDiagnostics(diagnostics);
//         monaco.editor.setModelMarkers(getModel(), 'default', markers);
//     });
// }

// function cleanDiagnostics(): void {
//     monaco.editor.setModelMarkers(monaco.editor.getModel(MONACO_URI), 'default', []);
// }

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
(self as any).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}
require('./client');


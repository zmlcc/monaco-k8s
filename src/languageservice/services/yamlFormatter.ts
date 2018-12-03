/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Adam Voss. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { TextDocument, Range, Position, TextEdit } from 'vscode-languageserver-types';
import { CustomFormatterOptions } from '../yamlLanguageService';
// import * as prettier from 'prettier';

export function format(document: TextDocument, options: CustomFormatterOptions): TextEdit[] {
    const text = document.getText();

	// const formatted = prettier.format(text, Object.assign(options, { parser: "yaml" as prettier.BuiltInParserName }));

    const formatted = "F**K"
    return [TextEdit.replace(Range.create(Position.create(0, 0), document.positionAt(text.length)), formatted)];
}

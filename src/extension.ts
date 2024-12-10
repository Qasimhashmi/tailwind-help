import * as vscode from 'vscode';

// Mapping from CSS properties to Tailwind classes
const cssToTailwindMap: { [key: string]: string } = {
    'display: flex;': 'flex',
    'display: block;': 'block',
    'display: inline;': 'inline',
    'display: inline-block;': 'inline-block',
    'justify-content: center;': 'justify-center',
    'justify-content: space-between;': 'justify-between',
    'justify-content: space-around;': 'justify-around',
    'align-items: center;': 'items-center',
    'align-items: start;': 'items-start',
    'align-items: end;': 'items-end',
    'flex-direction: row;': 'flex-row',
    'flex-direction: column;': 'flex-col',
    'color: red;': 'text-red-500',
    'color: blue;': 'text-blue-500',
    'color: black;': 'text-black',
    'color: white;': 'text-white',
    'margin: 0;': 'm-0',
    'margin: 4px;': 'm-1',
    'margin: 8px;': 'm-2',
    'margin: 16px;': 'm-4',
    'margin: auto;': 'm-auto',
    'padding: 0;': 'p-0',
    'padding: 4px;': 'p-1',
    'padding: 8px;': 'p-2',
    'padding: 16px;': 'p-4',
    'font-size: 12px;': 'text-sm',
    'font-size: 16px;': 'text-base',
    'font-size: 24px;': 'text-xl',
    'font-size: 32px;': 'text-2xl',
    'font-size: 48px;': 'text-4xl',
    'font-weight: 400;': 'font-normal',
    'font-weight: 700;': 'font-bold',
    'text-align: left;': 'text-left',
    'text-align: center;': 'text-center',
    'text-align: right;': 'text-right',
    'width: 100%;': 'w-full',
    'width: auto;': 'w-auto',
    'height: 100%;': 'h-full',
    'height: auto;': 'h-auto',
    'background-color: red;': 'bg-red-500',
    'background-color: blue;': 'bg-blue-500',
    'background-color: white;': 'bg-white',
    'background-color: black;': 'bg-black',
    'border: 1px solid black;': 'border border-black',
    'border: 1px solid white;': 'border border-white',
    'border-radius: 4px;': 'rounded',
    'border-radius: 9999px;': 'rounded-full',
    'overflow: hidden;': 'overflow-hidden',
    'overflow: scroll;': 'overflow-scroll',
    'position: absolute;': 'absolute',
    'position: relative;': 'relative',
    'top: 0;': 'top-0',
    'bottom: 0;': 'bottom-0',
    'left: 0;': 'left-0',
    'right: 0;': 'right-0',
    'z-index: 10;': 'z-10',
    'z-index: 50;': 'z-50',
    'z-index: auto;': 'z-auto',
    // Add more mappings as needed
};

function convertCssToTailwind(cssString: string): string {
    return cssString
        .split(';') // Split into individual CSS rules
        .map(rule => {
            const [property, value] = rule.split(':').map(part => part.trim());
            if (!property || !value) return ''; // Skip invalid or empty rules

            // Match full CSS rule
            const cssRule = `${property}: ${value};`;
            return cssToTailwindMap[cssRule] || ''; // Return Tailwind class or skip
        })
        .filter(Boolean) // Remove empty results
        .join(' ') // Combine into a single class string
        .trim(); // Remove any trailing spaces
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.convertCssToTailwind', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('No CSS selected.');
            return;
        }

        // Convert the selected CSS to Tailwind classes
        const convertedText = convertCssToTailwind(selectedText);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, convertedText);
        });

        vscode.window.showInformationMessage('CSS converted to Tailwind successfully!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

const vscode = require('vscode');

var editor = vscode.window.activeTextEditor;

const hexMap = {
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"A": 10,
	"B": 11,
	"C": 12,
	"D": 13,
	"E": 14,
	"F": 15
}


function activate(context) {
	let disposable = vscode.commands.registerCommand('unity-color.convert-hex', function () {
		const selection = editor.selection;
		const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
		const selectedText = editor.document.getText(selectionRange);

		if (selectedText.substring(0, 1) == "#")
			selectedText = selectedText.substring(1);

		if (selectedText.length == 6) {
			const rHex = selectedText.substring(0, 2);
			const gHex = selectedText.substring(2, 4);
			const bHex = selectedText.substring(4, 6);

			var rRgb255 = hexToRgb(rHex);
			var gRgb255 = hexToRgb(gHex);
			var bRgb255 = hexToRgb(bHex);

			var rRgb1 = rgb255ToRgb1(rRgb255);
			var gRgb1 = rgb255ToRgb1(gRgb255);
			var bRgb1 = rgb255ToRgb1(bRgb255);

			var color = `new Color(${rRgb1}f, ${gRgb1}f, ${bRgb1}f, 1f)`
			editor.edit(function (editBuilder) { editBuilder.replace(selectionRange, color); });
			vscode.window.showInformationMessage(color);
		}

		function hexToRgb(hex) { return (hexMap[hex.substring(0, 1)] * 16) + hexMap[hex.substring(1, 2)]; }
		function rgb255ToRgb1(rgb255) {
			var result = rgb255 / 255;
			if (result % 1 == 0) return result;
			else return result.toFixed(8);
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}

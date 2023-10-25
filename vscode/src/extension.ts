'use strict';
import { workspace, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

var client: LanguageClient = null;

async function configureAndStartClient(context: ExtensionContext) {

	// Startup options for the language server
	let executable = 'java';
	let relativePath = "../lsp_jar/FUMSL.ide-1.0.0-SNAPSHOT-ls.jar"
	let args = ['-jar', context.asAbsolutePath(relativePath)];

	const serverOptionsStdio = {
		run: { command: executable, args: args },
		debug: { command: executable, args: args }
	}

	const serverOptions: ServerOptions = serverOptionsStdio

	let clientOptions: LanguageClientOptions = {

		documentSelector: [{ scheme: 'file', language: 'fumsl' }],
		synchronize: {
			configurationSection: 'FumslLSP',
			fileEvents: [
				workspace.createFileSystemWatcher('**/*.fumsl'),
			],
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient('FumslLSP', 'FumslLSP', serverOptions, clientOptions);
	let disposable = client.start();
	context.subscriptions.push(disposable);
	await client.onReady();
}


export async function activate(context: ExtensionContext) {
	configureAndStartClient(context);

}





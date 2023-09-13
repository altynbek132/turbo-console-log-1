import * as vscode from 'vscode';
import { JSDebugMessage } from './debug-message/js';
import { Command, ExtensionProperties } from './entities';
import { JSLineCodeProcessing } from './line-code-processing/js';
import { getAllCommands } from './commands/';
import { JSDebugMessageLine } from './debug-message/js/JSDebugMessageLine';
import { getLangId } from './utilities/helpers';
import { DartDebugMessage } from './debug-message/dart/DartDebugMessage';
import { DartDebugMessageLine } from './debug-message/dart/DartDebugMessageLine';

export function activate(): void {
  const commands: Array<Command> = getAllCommands();
  for (const { name, handler } of commands) {
    vscode.commands.registerCommand(name, (args: unknown[]) => {
      const config: vscode.WorkspaceConfiguration =
        vscode.workspace.getConfiguration('turboConsoleLog');
      const properties: ExtensionProperties = getExtensionProperties(config);
      if (getLangId() == 'dart') {
        handler(
          properties,
          new DartDebugMessage(
            new JSLineCodeProcessing(),
            new DartDebugMessageLine(new JSLineCodeProcessing()),
          ),
          args,
        );
        return;
      }
      if (
        containsAny(getLangId() ?? '', [
          'javascript',
          'typescript',
          'vue',
          'react',
          'svelte',
          'jsx',
          'tsx',
          'javascriptreact',
          'typescriptreact',
          'js',
          'ts',
        ])
      ) {
        jsHandler();
        return;
      }
      jsHandler();

      function jsHandler() {
        handler(
          properties,
          new JSDebugMessage(
            new JSLineCodeProcessing(),
            new JSDebugMessageLine(new JSLineCodeProcessing()),
          ),
          args,
        );
      }
    });
  }
}

function containsAny(str: string, needles: string[]) {
  return needles.map((needle) => str.includes(needle)).includes(true);
}

function getExtensionProperties(
  workspaceConfig: vscode.WorkspaceConfiguration,
) {
  return {
    wrapLogMessage: workspaceConfig.wrapLogMessage ?? false,
    logMessagePrefix: workspaceConfig.logMessagePrefix ?? '🚀',
    logMessageSuffix: workspaceConfig.logMessageSuffix ?? ':',
    addSemicolonInTheEnd: workspaceConfig.addSemicolonInTheEnd ?? false,
    insertEnclosingClass: workspaceConfig.insertEnclosingClass ?? true,
    insertEnclosingFunction: workspaceConfig.insertEnclosingFunction ?? true,
    insertEmptyLineBeforeLogMessage:
      workspaceConfig.insertEmptyLineBeforeLogMessage ?? false,
    insertEmptyLineAfterLogMessage:
      workspaceConfig.insertEmptyLineAfterLogMessage ?? false,
    quote: workspaceConfig.quote ?? '"',
    delimiterInsideMessage: workspaceConfig.delimiterInsideMessage ?? '~',
    includeFileNameAndLineNum:
      workspaceConfig.includeFileNameAndLineNum ?? false,
    logType: workspaceConfig.logType ?? 'log',
    logFunction: workspaceConfig.logFunction ?? 'log',
  };
}

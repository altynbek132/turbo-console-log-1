import { window } from 'vscode';

export function getLangId(): string | undefined {
  return window.activeTextEditor?.document.languageId;
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  ExtensionContext,
  window,
  commands,
  ProgressLocation
} from "vscode";
import axios from "axios";
import messages from "./messages";
import functions from "./functions";
// This method is invoked the first time any of the extensions are activated, and only once per session
export function activate(context: ExtensionContext) {
  console.log("The extension upgrade helper is active!");

  functions.forEach(func => {
    const taskUpgradeHelper = commands.registerCommand(
      func.commandName,
      () => {
        window.withProgress(
          {
            location: ProgressLocation.Notification,
            title: func.title,
          },
          async (progress: any, token: any) => {
            const interval = setInterval(() => { animation(progress); }, 1000);
            progress.report({ message: messages.STARTING_PLUGIN });
            await axios.get(func.url);
            progress.report({ message: messages.PROCESS_WAS_FINISHED });
            clearInterval(interval);
          },
        );
      }
    );
    context.subscriptions.push(taskUpgradeHelper);
  });
}

/**
 * Updates the progress report message with an animation.
 *
 * @param progress progress object that appears on screen
 */
const animation = (progress: any) => {
  const messagesArray = [messages.IN_EXECUTION, messages.SEARCHING_FILES];
  const random = Math.floor(Math.random() * 2);
  const message = messagesArray[random];
  progress.report({ message });
};

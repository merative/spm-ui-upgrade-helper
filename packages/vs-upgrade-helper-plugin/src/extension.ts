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
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("The extension upgrade helper is Active!");

  functions.forEach(func => {
    const taskUpGradeHelper = commands.registerCommand(
      func.commandName,
      () => {
        window.withProgress(
          {
            location: ProgressLocation.Notification,
            title: func.title,
          },
          async (progress, token) => {
            const interval = setInterval(function() {
              const messagesArray = [messages.IN_EXECUTION, messages.SEARCHING_FILES];
              const random = Math.floor(Math.random() * 2);
              const message = messagesArray[random];
              progress.report({ message });
            }, 5000);

            progress.report({ message: messages.STARTING_PLUGIN });
            await axios.get(func.url);
            progress.report({ message: messages.PROCESS_WAS_FINISHED });
            clearInterval(interval);
          }
        );
      }
    );
    context.subscriptions.push(taskUpGradeHelper);
  });
}

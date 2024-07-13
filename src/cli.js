// @perama: This file provides a command-line interface for administrative tasks like listing files and clearing the console.

import { listFiles, clearFiles } from '../services/adminService';

// @param args: Command-line arguments passed to the script
const args = process.argv.slice(2);

// * Highlight: Extract the first argument as the command
const command = args[0];

/**
 * Handle the command-line arguments and execute the corresponding administrative task.
 */
switch (command) {
  case 'list':
    // * Highlight: List all files in the system
    listFiles();
    break;
  case 'clear':
    // * Highlight: Clear the console
    clearFiles();
    break;
  default:
    // ! Alert: Unknown command entered
    console.log('Unknown command');
}

// TODO: Implement additional commands for more administrative tasks
// TODO: Add error handling for invalid commands or arguments

// @param listFiles: Function to list all files in the system
// @param clearFiles: Function to clear the console
// This file provides a command-line interface for administrative tasks like listing files and clearing the console.

import { listFiles, clearFiles } from '../services/adminService';

const args = process.argv.slice(2);

const command = args[0];

/**
 * Handle the command-line arguments and execute the corresponding administrative task.
 */
switch (command) {
  case 'list':
    // List all files in the system
    listFiles();
    break;
  case 'clear':
    // Clear the console
    clearFiles();
    break;
  default:
    // Unknown command
    console.log('Unknown command');
}
import { Template } from "../types";

export const TEMPLATES: Template = {
  text: `Greetings!\nThis is an automated bot service for Inquiry & Complaint Registration/Tracking regarding local issues.\n\nSelect the appropriate option:\n1: Complaint Registration\n2: Complaint Tracking\n3: Inquiry`,
  errorText: `Please select the appropriate option, reply with the given option numbers only:\n\n1: Complaint Registration\n2: Inquiry`,
  1: {
    text: `Which type of complaint do you want to register?\n\n1: Sewerage\n2: Street Light\n3: Sweeping and Cleaning`,
    errorText: `Please select the appropriate option, reply with the given option numbers only:\n\n1: Sewerage\n2: Street Light\n3: Sweeping and Cleaning`,
    1: {
      text: `Registering your complaint for sewerage issue...\nSpecify the block number:\n\nfor example:\n18`,
      errorText: `Please provide only number of the block\nfor example:\n18`,
    },
    2: {
      text: `Registering your complaint for street light issue...\nSpecify the block number:\n\nfor example:\n18`,
      errorText: `Please provide only number of the block\nfor example:\n18`,
    },
    3: {
      text: `Registering your complaint for sweeping and cleaning issue...\nSpecify the block number:\n\nfor example:\n18`,
      errorText: `Please provide only number of the block\nfor example:\n18`,
    },
  },
  2: {
    text: `Please provide your complaint number`,
    errorText: `Not a valid complaint number, please provide a correct complaint number`,
  },
  3: {
    text: `What do you want to inquire about?\n\n1: Birth Certificate\n2: Death Certificate\n3: Marriage Certificate\n4: Death Certificate`,
    errorText: `Please select the appropriate option, reply with the given option numbers only:\n\n1: Birth Certificate\n2: Death Certificate\n3: Marriage Certificate\n4: Death Certificate`,
  },
};

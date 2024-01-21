import { Template } from "../types";

export const TEMPLATES: Template = {
  text: `Greetings!\nThis is an automated bot service for Inquiry & Complaint Registration/Tracking regarding local issues.\n\nSelect the appropriate option:\n1: Complaint Registration\n2: Complaint Tracking\n3: Inquiry`,
  errorText: `Please select the appropriate option, reply with the given option numbers only:\n\n1: Complaint Registration\n2: Complaint Tracking\n3: Inquiry`,
  1: {
    text: `Which type of complaint do you want to register?\n\n1: Sewerage\n2: Street Light\n3: Sanitation (Sweeping and Cleaning)`,
    errorText: `Please select the appropriate option, reply with the given option numbers only:\n\n1: Sewerage\n2: Street Light\n3: Sanitation (Sweeping and Cleaning)`,
    1: {
      text: `Registering your complaint for sewerage issue...\n\nSpecify the block number:\n17\n18\n19\n20`,
      errorText: `Please provide only number of the block from the list below:\n17\n18\n19\n20`,
    },
    2: {
      text: `Registering your complaint for street light issue...\n\nSpecify the block number:\n17\n18\n19\n20`,
      errorText: `Please provide only number of the block from the list below:\n17\n18\n19\n20`,
    },
    3: {
      text: `Registering your complaint for sweeping and cleaning issue...\n\nSpecify the block number:\n17\n18\n19\n20`,
      errorText: `Please provide only number of the block from the list below:\n17\n18\n19\n20`,
    },
  },
  2: {
    text: `Please provide your complaint number`,
    errorText: `Not a valid complaint number, please provide a correct complaint number`,
  },
  3: {
    text: `What do you want to inquire about?\n\n1: Birth Certificate\n2: Death Certificate\n3: Marriage Certificate\n4: Death Certificate`,
    errorText: `Please select the appropriate option, reply with the given option numbers only:\n\n1: Birth Certificate\n2: Death Certificate\n3: Marriage Certificate\n4: Death Certificate`,
    1: {
      text: `For the issuance of birth certificate, your require theses documents:\n1: CNIC copy\n2: hospital certificate`,
    },
  },
};

import { createContext } from "react";

import { Contact } from "../../utils/types/contacts";

interface ContactsContextProps {
  contacts: Contact[];
  addContact: (contact: Contact) => void,
  deleteContact: (contactId: number) => void,
  updateContact: (updatedContact: Contact) => void,
  isPending: boolean;
  isError: boolean;
  hasRemoteData: boolean;
}

export const ContactsContext = createContext<ContactsContextProps>({
  contacts: [],
  addContact: () => {},
  deleteContact: () => {},
  updateContact: () => {},
  isPending: false,
  isError: false,
  hasRemoteData: true,
});
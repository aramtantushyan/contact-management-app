import { createContext, SetStateAction } from "react";

import { Contact } from "../../utils/types/contacts";

interface ContactsContextProps {
  contacts: Contact[];
  setContacts: React.Dispatch<SetStateAction<Contact[]>>;
  isPending: boolean;
  isError: boolean;
  hasRemoteData: boolean;
}

export const ContactsContext = createContext<ContactsContextProps>({
  contacts: [],
  setContacts: () => {},
  isPending: false,
  isError: false,
  hasRemoteData: true,
});
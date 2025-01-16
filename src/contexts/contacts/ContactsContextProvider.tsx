import { PropsWithChildren, useEffect, useState } from "react";

import { Contact } from "../../utils/types/contacts";
import { useContacts } from "../../hooks/useContacts";
import { ContactsContext } from "./ContactsContext";

export const ContactsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isPending, isError, data: contactsData } = useContacts();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (!isPending && !isError) {
      const contacts: Contact[] = contactsData.map(c => (
        {
          id: c.id,
          name: c.name,
          email: c.email,
          username: c.username,
          address: {
            street: c.address.street,
            city: c.address.city,
            zipcode: c.address.zipcode
          },
          company: {
            name: c.company.name
          },
          image_url: `https://placehold.co/600x400/blue/white?text=User${c.id}`
        }
      ))
      setContacts(contacts);
    }
  }, [isPending, isError]);
  
  return (
    <ContactsContext.Provider value={{
      contacts,
      setContacts,
      isPending,
      isError
    }}>
      {children}
    </ContactsContext.Provider>
  )
}
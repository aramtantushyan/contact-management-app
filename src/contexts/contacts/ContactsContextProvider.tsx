import { PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Contact } from "../../utils/types/contacts";
import { useContacts } from "../../hooks/useContacts";
import { ContactsContext } from "./ContactsContext";

export const ContactsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isPending, isError, data: contactsData } = useContacts();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !isError) {
      const contacts: Contact[] = (contactsData || []).map(c => (
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

  const addContact = (contact: Contact) => {
    setContacts([...(contacts as Contact[]), contact]);
    navigate({ to: '/contacts/$contactId', params: { contactId: `${contact.id}` } });
  }

  const deleteContact = (contactId: number) => {
    const newContactsList = (contacts as Contact[]).filter(c => c.id !== contactId);
    setContacts(newContactsList);
    if (newContactsList.length) {
      navigate({ to: '/contacts/$contactId', params: { contactId: `${newContactsList[0].id}` } });
    } else {
      navigate({ to: '/' });
    }
  }

  const updateContact = (updatedContact: Contact) => {
    const updatedContactsList = (contacts as Contact[]).map(c => {
      if (c.id !== updatedContact.id) {
        return c;
      } else {
        return updatedContact;
      }
    });
    setContacts(updatedContactsList);
    navigate({ to: '/contacts/$contactId', params: { contactId: `${updatedContact.id}` } });
  }
  
  return (
    <ContactsContext.Provider value={{
      contacts: contacts as Contact[],
      addContact,
      updateContact,
      deleteContact,
      isPending,
      isError,
      hasRemoteData: !!contactsData
    }}>
      {children}
    </ContactsContext.Provider>
  )
}
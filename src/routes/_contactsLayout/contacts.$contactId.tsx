import { useContext, useEffect, useState } from "react";
import { createFileRoute } from '@tanstack/react-router';

import { ContactsContext } from "../../contexts/contacts/ContactsContext";
import { Contact } from "../../utils/types/contacts";
import ContactDetails from "../../components/contact-details/ContactDetails";

export const Route = createFileRoute('/_contactsLayout/contacts/$contactId')({
  component: RouteComponent
})

function RouteComponent() {
  const { contactId } = Route.useParams();
  const { contacts, isPending } = useContext(ContactsContext);
  const [currentContact, setCurrentContact] = useState<Contact>();

  useEffect(() => {
    if (contactId) {
      const currentContact = contacts.find(c => c.id === +contactId);
      setCurrentContact(currentContact);
    }
  }, [contactId, contacts]);

  if (!currentContact && isPending) {
    return <span>Loading...</span>
  }

  if (!isPending && contacts.length && !currentContact) {
    return <span>Not found</span>
  }

  return (
    <ContactDetails contact={currentContact as Contact} />
  )
}

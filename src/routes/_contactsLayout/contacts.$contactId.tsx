import { createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useState } from "react";
import { ContactsContext } from "../../contexts/contacts/ContactsContext";
import { Contact } from "../../utils/types/contacts";
import ContactDetails from "../../components/contact-details/ContactDetails";

export const Route = createFileRoute('/_contactsLayout/contacts/$contactId')({
  component: RouteComponent
})

function RouteComponent() {
  const { contactId } = Route.useParams();
  const { contacts } = useContext(ContactsContext);
  const [currentContact, setCurrentContact] = useState<Contact>();

  useEffect(() => {
    if (contactId) {
      const currentContact = contacts.find(c => c.id === +contactId);
      setCurrentContact(currentContact);
    }
  }, [contactId, contacts]);

  if (!currentContact) {
    return <span>Loading...</span>
  }

  return (
    <ContactDetails contact={currentContact} />
  )
}

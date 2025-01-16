import { useContext, useEffect, useState } from "react";
import { createFileRoute } from '@tanstack/react-router';

import ContactDetailsForm from '../../components/contact-details/ContactDetailsForm';
import { ContactsContext } from "../../contexts/contacts/ContactsContext";
import { Contact } from "../../utils/types/contacts";

export const Route = createFileRoute(
  '/_contactsLayout/contacts_/$contactId/edit',
)({
  component: RouteComponent,
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
    return <span>Somethin went wrong</span>
  }

  return <ContactDetailsForm contact={currentContact} />
}

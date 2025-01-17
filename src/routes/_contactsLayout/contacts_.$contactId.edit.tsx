import { useContext, useMemo, } from "react";
import { createFileRoute, Navigate } from '@tanstack/react-router';

import ContactDetailsForm from '../../components/contact-details/ContactDetailsForm';
import { ContactsContext } from "../../contexts/contacts/ContactsContext";

export const Route = createFileRoute(
  '/_contactsLayout/contacts_/$contactId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { contactId } = Route.useParams();
  const { contacts } = useContext(ContactsContext);

  const currentContact = useMemo(() => {
    const currentContact = contacts.find(c => c.id === +contactId);
    return currentContact;
  }, [contactId, contacts]);

  if (contactId && contacts && !currentContact) {
    return <Navigate to="/" />
  }

  return <ContactDetailsForm contact={currentContact} />
}

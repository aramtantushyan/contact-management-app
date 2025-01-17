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
    return (
      <div className="flex w-full justify-center items-start p-6">
        <span className="py-4 text-center text-slate-400">Loading...</span>
      </div>
    )
  }

  if (!isPending && contacts.length && !currentContact) {
    return (
      <div className="flex w-full justify-center items-start p-6">
        <span className="py-4 text-center text-slate-400">Contact is not found</span>
      </div>
    )
  }

  return (
    <ContactDetails contact={currentContact as Contact} />
  )
}

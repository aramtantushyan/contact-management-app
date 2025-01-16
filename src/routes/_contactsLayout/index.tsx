import { useContext } from "react";
import { createFileRoute, Navigate } from '@tanstack/react-router';

import { ContactsContext } from "../../contexts/contacts/ContactsContext"

export const Route = createFileRoute('/_contactsLayout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { contacts, isPending, hasRemoteData } = useContext(ContactsContext);

  return (
    <>
      {isPending || hasRemoteData && !contacts.length ? (
        <span>Loading...</span>
      ) : !contacts.length  ? (
        <span>You don't have contacts yet</span>
      ) : (
        <Navigate to={`/contacts/$contactId`} params={{ contactId: `${contacts[0].id}` }}/>
      )}
    </>
  )
}

import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useContext, useEffect } from "react"
import { ContactsContext } from "../../contexts/contacts/ContactsContext"

export const Route = createFileRoute('/_contactsLayout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { contacts } = useContext(ContactsContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (contacts.length) {
      navigate({
        to: '/contacts/$contactId',
        params: {
          contactId: `${contacts[0].id}`
        }
      })
    }
  }, [contacts])

  return (
    <>
      {!contacts.length ? (
        <span>Loading...</span>
      ) : (
        null
      )}
    </>
  )
}

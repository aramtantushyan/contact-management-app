import { createFileRoute } from '@tanstack/react-router'
import ContactDetailsForm from "../../components/contact-details/ContactDetailsForm"

export const Route = createFileRoute('/_contactsLayout/contacts_/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactDetailsForm />
}

import { createFileRoute, Outlet } from '@tanstack/react-router';

import Sidebar from "../components/Sidebar";
import { ContactsContextProvider } from "../contexts/contacts/ContactsContextProvider";

export const Route = createFileRoute('/_contactsLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ContactsContextProvider>
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </ContactsContextProvider>
  )
}

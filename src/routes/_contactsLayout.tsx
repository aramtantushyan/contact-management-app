import { createFileRoute, Outlet } from '@tanstack/react-router';

import Sidebar from "../components/Sidebar";
import { ContactsContextProvider } from "../contexts/contacts/ContactsContextProvider";

export const Route = createFileRoute('/_contactsLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ContactsContextProvider>
      <div style={{ display: 'flex', gap: 24 }}>
        <Sidebar />
        <Outlet />
      </div>
    </ContactsContextProvider>
  )
}

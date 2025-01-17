import { createFileRoute, Outlet } from '@tanstack/react-router';

import Sidebar from "../components/Sidebar";
import { ContactsContextProvider } from "../contexts/contacts/ContactsContextProvider";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useState } from "react";

export const Route = createFileRoute('/_contactsLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  }

  return (
    <ContactsContextProvider>
      <div className="flex flex-col h-full min-h-screen">
        <div className="flex w-full h-9 items-center bg-indigo-900 px-3 md:hidden">
          <Bars3Icon className="size-8 text-white" onClick={toggleShowSidebar}/>
        </div>
        <div className="flex min-h-screen">
          <Sidebar show={showSidebar} />
          <Outlet />
        </div>
      </div>
    </ContactsContextProvider>
  )
}

import { useContext } from "react";
import { createFileRoute, Link, Navigate } from '@tanstack/react-router';

import { ContactsContext } from "../../contexts/contacts/ContactsContext"

export const Route = createFileRoute('/_contactsLayout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { contacts, isPending, isError } = useContext(ContactsContext);
  
  const getMainView = () => {
    if (isError) {
      return (
        <div className="flex flex-col w-3/4 justify-center items-center border border-dashed border-slate-600 rounded-md px-12 py-16 gap-2">
          <span className="text-center text-slate-500 text-sm">
            Something went wrong. You can try to reload the page.
          </span>
        </div>
      )
    } else if (isPending || !contacts) {
      return <span className="py-4 text-center text-slate-400">Loading...</span>
    } else if (!contacts.length) {
      return (
        <div className="flex flex-col w-3/4 justify-center items-center border border-dashed border-slate-600 rounded-md px-12 py-16 gap-2">
          <span className="text-center text-slate-500 text-sm">
            You don't have contacts yet
          </span>
          <Link to="/contacts/add" className="w-fit rounded-md bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Add new contact
          </Link>
        </div>
      )
    } else {
      return <Navigate to={`/contacts/$contactId`} params={{ contactId: `${contacts[0].id}` }}/>
    }
  }

  return (
    <div className="flex w-full justify-center items-start p-6">
      {getMainView()}
    </div>
  )
}

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import { ContactsContext } from "../contexts/contacts/ContactsContext";
import { Contact } from "../utils/types/contacts";

interface SidebarProps {
  show: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ show }) => {
  const { contacts, isPending } = useContext(ContactsContext);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (contacts) {
      setKeyword('');
      setFilteredContacts(contacts);
    }
  }, [contacts])

  const addContactHadnler = () => {
    navigate({
      to: '/contacts/add'
    })
  };

  const contactsSearchHandler = (enteredValue: string) => {
    setKeyword(enteredValue);
    const trimmedKeyword = enteredValue.trim();
    if (!trimmedKeyword && keyword.trim()) {
      setFilteredContacts(contacts);
    } else {
      const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(trimmedKeyword.toLowerCase()));
      setFilteredContacts(filteredContacts);
    }
  };

  return (
    <div className={`flex-col gap-3 w-1/4 w-72 min-w-72 min-h-full ${!show ? 'hidden' : 'flex'} transition-all duration-500 bg-gray-100 md:flex`}>
      <div className="flex gap-2 py-3 border-b border-solid border-slate-300 px-3">
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="text"
          value={keyword}
          placeholder="Search"
          onChange={(e) => contactsSearchHandler(e.target.value)}
        />
        <button className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={addContactHadnler}>Add</button>
      </div>
      {isPending || !contacts ? (
        <span className="py-4 text-center text-slate-400">Loading contacts...</span>
      ) : (
        filteredContacts.length ? filteredContacts.map(c => (
          <Link
            key={c.id}
            className="mx-3 px-3 py-1 rounded-md hover:bg-indigo-500 hover:text-white"
            activeProps={{ className: 'bg-indigo-500 text-white' }}
            to={'/contacts/$contactId'}
            params={{
              contactId: `${c.id}`
            }}
          >
            {c.name}
          </Link>
        ))
         : (
          <span className="py-4 text-center text-slate-400">There are no contacts</span>
        )
      )}
    </div>
  )
}
export default Sidebar;
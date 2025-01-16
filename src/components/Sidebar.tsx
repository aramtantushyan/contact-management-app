import { Link, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";

import { ContactsContext } from "../contexts/contacts/ContactsContext";

const Sidebar = () => {
  const { contacts, isPending } = useContext(ContactsContext);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const navigate = useNavigate();

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(contacts);
    }
  }, [contacts])

  const addContactHadnler = () => {
    navigate({
      to: '/contacts/add'
    })
  };

  const contactsSearchHandler = (keyword: string) => {
    if (!keyword) {
      setFilteredContacts(contacts);
    } else {
      const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
      setFilteredContacts(filteredContacts);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '25%', backgroundColor: '#ECECEC', height: '100vh', padding: '12px 16px' }}>
      <div style={{ display: 'flex', gap: 8, padding: '12px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.5)' }}>
        <input type="text" placeholder="Search" onChange={(e) => contactsSearchHandler(e.target.value.trim())}/>
        <button onClick={addContactHadnler}>Add</button>
      </div>
      {isPending ? (
        <span>Loading contacts...</span>
      ) : (
        filteredContacts.length ? filteredContacts.map(c => (
          <Link key={c.id} to={'/contacts/$contactId'} params={{
            contactId: `${c.id}`
          }}>{c.name}</Link>
        ))
         : (
          <span>No contacts yet</span>
        )
      )}
    </div>
  )
}
export default Sidebar;
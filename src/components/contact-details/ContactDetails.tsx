import { useContext, useState } from "react";
import { Contact } from "../../utils/types/contacts";
import DeleteContactDialog from "./DeleteContactDialog";
import { Outlet, useNavigate } from "@tanstack/react-router";
import useMutateContact, { HttpMethod } from "../../hooks/useMutateContact";
import { ContactsContext } from "../../contexts/contacts/ContactsContext";

interface ContactDetailProps {
  contact: Contact;
}

const ContactDetails: React.FC<ContactDetailProps> = ({ contact }) => {
  const { contacts, setContacts } = useContext(ContactsContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const mutation = useMutateContact(onDeleteSuccess);
  
  if (!contact) {
    return <span>No contact</span>
  }

  const toggleDeleteDialogVisibility = () => {
    setOpenDeleteDialog(!openDeleteDialog);
  }

  const editContactDetailsHandler = () => {
    console.log('clikced')
    navigate({ to: `/contacts/$contactId/edit`, params: { contactId: `${contact.id}` } });
  }

  const deleteContactHandler = () => {
    mutation.mutate({
      method: HttpMethod.DELETE,
      contactData: {
        id: contact.id
      }
    });
  }

  function onDeleteSuccess() {
    const newContacts = contacts.filter(c => c.id !== contact.id);
    setContacts(newContacts);
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 16 }}>
        <section>
          <img src={contact.image_url} alt="avatar" width={300} height={300} style={{ borderRadius: 12 }} />
        </section>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span>{contact.name}</span>
          <span style={{ color: 'blue' }}>#{contact.username}</span>
          <span>Email: {contact.email}</span>
          <span>Address: {contact.address.street}, {contact.address.zipcode}, {contact.address.city}</span>
          <span>Company: {contact.company.name}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={editContactDetailsHandler}>Edit</button>
            <button onClick={toggleDeleteDialogVisibility}>Delete</button>
          </div>
        </section>
      </div>
      <DeleteContactDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} onDelete={deleteContactHandler} />
    </>
  )
}
export default ContactDetails;
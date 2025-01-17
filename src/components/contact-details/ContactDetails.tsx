import { useContext, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Contact } from "../../utils/types/contacts";
import DeleteContactDialog from "./DeleteContactDialog";
import useMutateContact, { HttpMethod } from "../../hooks/useMutateContact";
import { ContactsContext } from "../../contexts/contacts/ContactsContext";
import { BuildingOffice2Icon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface ContactDetailProps {
  contact: Contact;
}

const ContactDetails: React.FC<ContactDetailProps> = ({ contact }) => {
  const { contacts, setContacts } = useContext(ContactsContext);
  const navigate = useNavigate();
  const mutation = useMutateContact(onDeleteSuccess);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  if (!contact) {
    return <span>No contact</span>
  }

  const toggleDeleteDialogVisibility = () => {
    setOpenDeleteDialog(!openDeleteDialog);
  }

  const editContactHandler = () => {
    navigate({ 
      to: `/contacts/$contactId/edit`,
      params: { contactId: `${contact.id}` }
    });
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
    setOpenDeleteDialog(false);
    const hasContacts = !!newContacts.length;
    console.log('hasContacts', hasContacts, newContacts)
    navigate({
      to: hasContacts ? '/contacts/$contactId' : '/',
      ...(hasContacts ? {
        params: {
          contactId: `${newContacts[0].id}`
        }
      } : {})
    })
  }

  return (
    <>
      <div className="flex flex-1 py-3 px-3 gap-6">
        <section className="w-80 flex justify-center">
          <img
            src={contact.image_url}
            alt="avatar"
            className="rounded-2xl w-56 h-56 object-cover"
          />
        </section>
        <section className="flex flex-col flex-1 gap-4">
          <div className="pb-4 border-b border-solid border-slate-300">
            <h1 className=" text-gray-800 text-2xl font-semibold">{contact.name}</h1>
            <h2 className="text-sky-500 text-lg font-medium">#{contact.username}</h2>
          </div>
          <div className="flex flex-col gap-3">
            <span className="flex gap-2">
              <EnvelopeIcon className="size-5 text-indigo-600"/>
              <span className="text-gray-600">{contact.email}</span>
            </span>
            <span className="flex gap-2">
              <MapPinIcon className="size-5 text-indigo-600"/>
              <span className="text-gray-600">
                {contact.address.street}, {`${contact.address.zipcode ? `${contact.address.zipcode}, ` : ''}`}{contact.address.city}
              </span>
            </span>
            <span className="flex gap-2 items-center">
              <BuildingOffice2Icon className="size-5 text-indigo-600"/>
              <span className="text-gray-600">{contact.company.name}</span>
            </span>
          </div>
          <div className="flex gap-2 pt-4 border-t border-solid border-slate-300">
            <button className="w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 sm:mt-0" onClick={editContactHandler}>Edit</button>
            <button className="w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-gray-200 hover:bg-red-500 hover:text-white" onClick={toggleDeleteDialogVisibility}>Delete</button>
          </div>
        </section>
      </div>
      <DeleteContactDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} onDelete={deleteContactHandler} />
    </>
  )
}
export default ContactDetails;
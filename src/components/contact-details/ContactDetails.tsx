import { useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Contact } from "../../utils/types/contacts";
import DeleteContactDialog from "./DeleteContactDialog";
import useMutateContact, { HttpMethod } from "../../hooks/useMutateContact";
import { ContactsContext } from "../../contexts/contacts/ContactsContext";
import { BuildingOffice2Icon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";
import ContactImage from "./ContactImage";
import Loader from "../Loader";

interface ContactDetailProps {
  contact: Contact;
}

const ContactDetails: React.FC<ContactDetailProps> = ({ contact }) => {
  const { deleteContact } = useContext(ContactsContext);
  const navigate = useNavigate();
  const mutation = useMutateContact(onDeleteSuccess);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (!contact) {
      navigate({ to: '/' });
    }
  }, [contact])

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
    setOpenDeleteDialog(false);
    mutation.mutate({
      method: HttpMethod.DELETE,
      contactData: {
        id: contact.id
      }
    });
  }

  function onDeleteSuccess() {
    deleteContact(contact.id);
  }

  if (!contact) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col flex-1 py-3 px-3 gap-6 lg:flex-row">
        <section className="flex justify-center lg:w-80">
          <ContactImage imageUrl={contact.image_url} onlyPreview={true} />
        </section>
        <section className="flex flex-col flex-1 gap-4 lg:pr-16">
          <div className="pb-4 border-b border-solid border-slate-300">
            <h1 className="text-gray-800 text-2xl font-semibold">{contact.name}</h1>
            <h2 className="text-sky-500 text-lg font-medium">#{contact.username}</h2>
          </div>
          <div className="flex flex-col gap-3">
            <span className="flex gap-2">
              <span>
                <EnvelopeIcon className="size-5 text-gray-600"/>
              </span>
              <span className="text-gray-600">{contact.email}</span>
            </span>
            <span className="flex gap-2">
              <span>
                <MapPinIcon className="size-5 text-gray-600"/>
              </span>
              <span className="text-gray-600">
                {contact.address.street}, {`${contact.address.zipcode ? `${contact.address.zipcode}, ` : ''}`}{contact.address.city}
              </span>
            </span>
            {contact.company.name ? (
              <span className="flex gap-2 items-center">
                <span>
                  <BuildingOffice2Icon className="size-5 text-gray-600"/>
                </span>
                <span className="text-gray-600">{contact.company.name}</span>
              </span>
            ) : null}
          </div>
          <div className="flex gap-2 pt-4 border-t border-solid border-slate-300">
            <button className="w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 sm:mt-0" onClick={editContactHandler}>Edit</button>
            <button className="w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-gray-200 hover:bg-red-500 hover:text-white" onClick={toggleDeleteDialogVisibility}>Delete</button>
          </div>
        </section>
      </div>
      <DeleteContactDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        onDelete={deleteContactHandler}
      />
      {mutation.isPending && (
        <Loader />
      )}
    </>
  )
}
export default ContactDetails;
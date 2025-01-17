import { useContext } from "react";
import { useForm } from "@tanstack/react-form";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "@tanstack/react-router";

import { Contact } from "../../utils/types/contacts";
import useMutateContact, { HttpMethod } from "../../hooks/useMutateContact";
import { ContactsContext } from "../../contexts/contacts/ContactsContext";
import { contactSchema } from "../../utils/validation/validation-schemas";

interface ContactDetailsFormProps {
  contact?: Contact;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({ contact }) => {
  const { contacts, setContacts } = useContext(ContactsContext);
  const  mutation = useMutateContact(onFormSubmissionSuccess);
  const navigate = useNavigate();

  function onFormSubmissionSuccess(contactData: Contact) {
    let newContacts;

    if (contact) {
      newContacts = contacts.map(c => {
        if (c.id === contact.id) {
          return contactData;
        } else {
          return c;
        }
      });
    } else {
      newContacts = [
        ...contacts,
        {
          ...contactData,
          image_url: `https://placehold.co/600x400/blue/white?text=User${contactData.id}, ${contactData.name}`
        }
      ];
    }
    setContacts(newContacts);
    navigate({
      to: '/contacts/$contactId',
      params: {
        contactId: `${contact?.id || contactData.id}`
      }
    })
  }

  const cancelHandler = () => {
    if (contact) {
      navigate({
        to: '/contacts/$contactId',
        params: {
          contactId: `${contact.id}`
        }
      })
    } else {
      navigate({ to: '/' });
    }
  }

  const form = useForm({
    defaultValues: {
      name:  contact?.name || '',
      username:  contact?.username || '',
      email:  contact?.email || '',
      address: {
        street: contact?.address.street || '',
        city: contact?.address.city || '',
        zipcode: contact?.address.zipcode || '',
      },
      company: {
        name: contact?.company.name || ''
      },
      image_url: contact?.image_url || '',
    },
    validators: {
      onBlur: contactSchema
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({ 
        method: contact ? HttpMethod.PUT : HttpMethod.POST,
        contactData: {
          ...value,
          ...(contact ? { id: contact.id } : {})
        }
      });
    },
  })

  return (
    <form
      className="flex flex-1 flex-col pt-3 pb-6 px-6 gap-6 items-center"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-1 flex-col gap-6 w-full max-w-2xl">
        <section className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-200">
          <span className="text-gray-800 text-xl font-semibold leading-none">
            Profile photo
          </span>
          <form.Field
            name="image_url"
            children={(field) => (
              <div className="col-span-full">
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                    <div className="mt-4 flex text-sm/6 text-gray-600 gap-">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="mt-2 text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )}
          />
        </section>
        <section className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-200">
          <span className="text-gray-800 text-xl font-semibold leading-none">Personal information</span>
          <div className="flex flex-col gap-3">
            <form.Field
              name="name"
              children={(field) => (
                <div className="col-span-full">
                  <label htmlFor="fullname" className="block text-sm/6 font-medium text-gray-900">
                    Full name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="fullname"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.errors ? (
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </div>
              )}
            />
            <form.Field
              name="username"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                    Username <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="janesmith"
                        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    {field.state.meta.errors ? (
                      <em role="alert">{field.state.meta.errors.join(', ')}</em>
                    ) : null}
                  </div>
                </div>
              )}
            />
            <form.Field
              name="email"
              children={(field) => (
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.errors ? (
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </div>
              )}
            />
          </div>
        </section>
        <section className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-200">
          <span className="text-gray-800 text-xl font-semibold leading-none">Address</span>
          <div className="flex flex-col gap-3">
            <form.Field
              name="address.street"
              children={(field) => (
                <div className="sm:col-span-3">
                  <label htmlFor="address-street" className="block text-sm/6 font-medium text-gray-900">
                    Street <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="address-street"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.errors ? (
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </div>
              )}
            />
            <div className="flex flex-col gap-4 lg:flex-row">
              <form.Field
                name="address.city"
                children={(field) => (
                  <div className="flex-1">
                    <label htmlFor="address-city" className="block text-sm/6 font-medium text-gray-900">
                      City <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="address-city"
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    {field.state.meta.errors ? (
                      <em role="alert">{field.state.meta.errors.join(', ')}</em>
                    ) : null}
                  </div>
                )}
              />
              <form.Field
                name="address.zipcode"
                children={(field) => (
                  <div className="flex-1">
                    <label htmlFor="address-zipcode" className="block text-sm/6 font-medium text-gray-900">
                      Zip code
                    </label>
                    <div className="mt-2">
                      <input
                        id="address-zipcode"
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-200">
          <span className="text-gray-800 text-xl font-semibold leading-none">Company information</span>
          <div className="flex flex-col gap-3">
            <form.Field
              name="company.name"
              children={(field) => (
                <div className="sm:col-span-3">
                  <label htmlFor="company" className="block text-sm/6 font-medium text-gray-900">
                    Company name
                  </label>
                  <div className="mt-2">
                    <input
                      id="company"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </section>
        <div className="flex w-full items-center justify-end gap-x-6">
          <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={cancelHandler}>
            Cancel
          </button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isSubmitting ? '...' : 'Save'}
              </button>
            )}
          />
        </div>
      </div>
    </form>
  )
}
export default ContactDetailsForm;
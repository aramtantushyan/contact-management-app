import { useContext } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";

import { Contact } from "../../utils/types/contacts";
import useMutateContact, { HttpMethod } from "../../hooks/useMutateContact";
import { ContactsContext } from "../../contexts/contacts/ContactsContext";
import { contactSchema } from "../../utils/validation/validation-schemas";
import ContactImage from "./ContactImage";

interface ContactDetailsFormProps {
  contact?: Contact;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({ contact }) => {
  const { contacts, updateContact, addContact } = useContext(ContactsContext);
  const  mutation = useMutateContact(onFormSubmissionSuccess);
  const navigate = useNavigate();

  function onFormSubmissionSuccess(contactData: Contact) {
    if (contact) {
      updateContact(contactData);
    } else {
      const isExistingId = contacts.find(c => c.id === contactData.id);
      const id = !isExistingId ? contactData.id : contacts.sort((a, b) => a.id - b.id).at(-1).id + 1;
      const newContact = {
        ...contactData,
        id,
        ...(contactData.image_url 
          ? { image_url: `https://placehold.co/600x400/blue/white?text=User${contactData.id}, ${contactData.name}` }
          : {}
        ),
      };
      addContact(newContact);
    }
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
      onChange: contactSchema
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({ 
        method: contact ? HttpMethod.PUT : HttpMethod.POST,
        contactData: {
          name: value.name.trim(),
          username: value.username.trim(),
          email: value.email.trim(),
          address: {
            street: value.address.street.trim(),
            city: value.address.city.trim(),
            zipcode: value.address.zipcode ? value.address.zipcode.trim() : ''
          },
          company: {
            name: value.company.name ? value.company.name.trim() : ''
          },
          image_url: value?.image_url,
          ...(contact ? { id: contact.id } : {}),
          isLocalContact: contact?.isLocalContact ?? true
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
                <ContactImage
                  imageUrl={field.state.value}
                  showActions={!!field.state.value}
                  onChange={(imageUrl => field.handleChange(imageUrl))}
                />
              </div>
            )}
          />
        </section>
        <section className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-200">
          <span className="text-gray-800 text-xl font-semibold leading-none">Personal information</span>
          <div className="flex flex-col gap-5">
            <form.Field
              name="name"
              children={(field) => (
                <div className="col-span-full">
                  <label htmlFor="fullname" className="block text-sm/6 font-medium text-gray-900">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      disabled={field.form.state.isSubmitting || mutation.isPending}
                      id="fullname"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                  {field.state.meta.errors && field.state.meta.isTouched ? (
                    <em className="absolute text-xs text-red-500" role="alert">
                      {field.state.meta.errors.join(', ')}
                    </em>
                  ) : null}
                </div>
              )}
            />
            <form.Field
              name="username"
              validators={{
                onChange: ({value}) =>
                  contacts.some(c => c.username === value && c.id !== contact?.id) ? 'Contact with this username already exists' : null,
              }}
              children={(field) => (
                <div className="sm:col-span-4">
                  <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      disabled={field.form.state.isSubmitting || mutation.isPending}
                      id="username"
                      name="username"
                      type="text"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors && field.state.meta.isTouched  ? (
                      <em className="absolute text-xs text-red-500" role="alert">
                        {field.state.meta.errors.join(', ')}
                      </em>
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
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      disabled={field.form.state.isSubmitting || mutation.isPending}
                      id="email"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                  {field.state.meta.errors && field.state.meta.isTouched  ? (
                    <em className="absolute text-xs text-red-500" role="alert">
                      {field.state.meta.errors.join(', ')}
                    </em>
                  ) : null}
                </div>
              )}
            />
          </div>
        </section>
        <section className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-200">
          <span className="text-gray-800 text-xl font-semibold leading-none">Address</span>
          <div className="flex flex-col gap-5">
            <form.Field
              name="address.street"
              children={(field) => (
                <div className="sm:col-span-3">
                  <label htmlFor="address-street" className="block text-sm/6 font-medium text-gray-900">
                    Street <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      disabled={field.form.state.isSubmitting || mutation.isPending}
                      id="address-street"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                  {field.state.meta.errors && field.state.meta.isTouched  ? (
                    <em className="absolute text-xs text-red-500" role="alert">
                      {field.state.meta.errors.join(', ')}
                    </em>
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
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        disabled={field.form.state.isSubmitting || mutation.isPending}
                        id="address-city"
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                    {field.state.meta.errors && field.state.meta.isTouched  ? (
                      <em className="absolute text-xs text-red-500" role="alert">
                        {field.state.meta.errors.join(', ')}
                      </em>
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
                    <div className="mt-1">
                      <input
                        disabled={field.form.state.isSubmitting || mutation.isPending}
                        id="address-zipcode"
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
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
          <div className="flex flex-col gap-5">
            <form.Field
              name="company.name"
              children={(field) => (
                <div>
                  <label htmlFor="company" className="block text-sm/6 font-medium text-gray-900">
                    Company name
                  </label>
                  <div className="mt-1">
                    <input
                      disabled={field.form.state.isSubmitting || mutation.isPending}
                      id="company"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </section>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="flex w-full items-center justify-end gap-x-6">
              <button
                disabled={mutation.isPending}
                type="button"
                className="text-sm/6 font-semibold text-gray-900 disabled:opacity-50"
                onClick={cancelHandler}
              >
                Cancel
              </button>
              <button
                key={`${isSubmitting}`}
                type="submit"
                disabled={!canSubmit || isSubmitting || mutation.isPending}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {(isSubmitting || mutation.isPending) && (contact ? 'Saving...' : 'Creating...')}
                {!(isSubmitting || mutation.isPending) && (contact ? 'Save' : 'Create')}
              </button>
            </div>
          )}
        />
      </div>
    </form>
  )
}
export default ContactDetailsForm;
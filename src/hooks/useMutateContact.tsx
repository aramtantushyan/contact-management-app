import { useMutation } from '@tanstack/react-query';

import { contactByIdApi, contactsApi } from "../utils/api";
import { Contact } from "../utils/types/contacts";

export enum HttpMethod {
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE'
}

const useMutateContact = (onSuccess?: (contact: Contact) => void, onError?: (error: Error) => void) => {
  const mutation = useMutation({
    mutationFn: async ({ method, contactData }: { method: HttpMethod, contactData: Partial<Contact>}) => {
      let response;
      const contactId = contactData.id;

      if (contactData.isLocalContact && method === HttpMethod.PUT) {
        return contactData;
      }

      switch (method) {
        case HttpMethod.POST:
          response = await fetch(contactsApi, {
            body: JSON.stringify(contactData),
            method: HttpMethod.POST,
            headers: {
              'Content-type': 'Application/json'
            }
          });
          break;
        case 'PUT':
          response = await fetch(contactByIdApi(contactId as number), {
            body: JSON.stringify(contactData),
            method: HttpMethod.PUT,
            headers: {
              'Content-type': 'Application/json'
            }
          });
          break;
        case 'DELETE':
          response = await fetch(contactByIdApi(contactId as number), {
            method: HttpMethod.DELETE
          });
          break;
        default:
          throw new Error('Unsupported HTTP method');
      }

      return response.json();
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return mutation;
};

export default useMutateContact;

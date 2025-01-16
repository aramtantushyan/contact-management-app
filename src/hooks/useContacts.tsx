import { useQuery } from '@tanstack/react-query';
import { contactsApi } from "../utils/api";
import { RemoteContact } from "../utils/types/contacts";

async function fetchContacts() {
  try {
    const response = await fetch(contactsApi);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
};

export const useContacts = () => {
  return useQuery<RemoteContact[]>({
    queryKey: ['contacts'],
    queryFn: fetchContacts
  });
};
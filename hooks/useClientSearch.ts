import { useState, useCallback, useRef } from 'react';
import { clientService } from '../services/clientService';
import { Alert } from 'react-native';

interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  currentBalance?: number;
}

export const useClientSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const searchClients = async (query: string) => {
    try {
      setLoading(true);
      const response = await clientService.getClients(1, 10, query);
      const mappedClients = (response.clients || []).map((client: any) => ({
        _id: client._id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        currentBalance: client.currentBalance || 0,
      }));
      setSearchResults(mappedClients);
    } catch (error) {
      console.error('Error searching clients:', error);
      Alert.alert('Erreur', 'Impossible de rechercher les clients');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length >= 2) {
      setIsTyping(true);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false);
      if (query.length >= 2) {
        await searchClients(query);
      } else {
        setSearchResults([]);
      }
    }, 500);
  }, []);

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsTyping(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  return {
    searchQuery,
    searchResults,
    loading,
    isTyping,
    updateSearchQuery,
    clearSearch,
  };
};

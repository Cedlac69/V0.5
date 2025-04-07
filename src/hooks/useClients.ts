import { useState, useEffect } from 'react';
import { clientService } from '../services/api';
import type { Client } from '../types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }

  async function createClient(client: Omit<Client, 'id' | 'dateCreation'>) {
    try {
      const newClient = await clientService.create(client);
      setClients([...clients, newClient]);
      return newClient;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function updateClient(id: string, client: Partial<Client>) {
    try {
      const updatedClient = await clientService.update(id, client);
      setClients(clients.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function deleteClient(id: string) {
    try {
      await clientService.delete(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  return {
    clients,
    loading,
    error,
    refresh: loadClients,
    createClient,
    updateClient,
    deleteClient
  };
}
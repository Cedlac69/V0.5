import { useState, useEffect } from 'react';
import { agenceService } from '../services/api';
import type { Agence } from '../types';

export function useAgences() {
  const [agences, setAgences] = useState<Agence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAgences();
  }, []);

  async function loadAgences() {
    try {
      setLoading(true);
      const data = await agenceService.getAll();
      setAgences(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }

  async function createAgence(agence: Omit<Agence, 'id' | 'dateCreation'>) {
    try {
      const newAgence = await agenceService.create(agence);
      setAgences([...agences, newAgence]);
      return newAgence;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function updateAgence(id: string, agence: Partial<Agence>) {
    try {
      const updatedAgence = await agenceService.update(id, agence);
      setAgences(agences.map(a => a.id === id ? updatedAgence : a));
      return updatedAgence;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function deleteAgence(id: string) {
    try {
      await agenceService.delete(id);
      setAgences(agences.filter(a => a.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  return {
    agences,
    loading,
    error,
    refresh: loadAgences,
    createAgence,
    updateAgence,
    deleteAgence
  };
}
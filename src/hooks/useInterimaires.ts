import { useState, useEffect } from 'react';
import { interimService } from '../services/api';
import type { Interim } from '../types';

export function useInterimaires() {
  const [interimaires, setInterimaires] = useState<Interim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadInterimaires();
  }, []);

  async function loadInterimaires() {
    try {
      setLoading(true);
      const data = await interimService.getAll();
      setInterimaires(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }

  async function createInterimaire(interim: Omit<Interim, 'id' | 'dateCreation'>) {
    try {
      const newInterim = await interimService.create(interim);
      setInterimaires([...interimaires, newInterim]);
      return newInterim;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function updateInterimaire(id: string, interim: Partial<Interim>) {
    try {
      const updatedInterim = await interimService.update(id, interim);
      setInterimaires(interimaires.map(i => i.id === id ? updatedInterim : i));
      return updatedInterim;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function updateDisponibilite(id: string, disponibilite: 'Disponible' | 'Occupé' | 'En poste') {
    try {
      const updatedInterim = await interimService.updateDisponibilite(id, disponibilite);
      setInterimaires(interimaires.map(i => i.id === id ? updatedInterim : i));
      return updatedInterim;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function deleteInterimaire(id: string) {
    try {
      await interimService.delete(id);
      setInterimaires(interimaires.filter(i => i.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  return {
    interimaires,
    loading,
    error,
    refresh: loadInterimaires,
    createInterimaire,
    updateInterimaire,
    updateDisponibilite,
    deleteInterimaire
  };
}
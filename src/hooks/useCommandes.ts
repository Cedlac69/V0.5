import { useState, useEffect } from 'react';
import { commandeService } from '../services/api';
import type { Commande } from '../types';

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCommandes();
  }, []);

  async function loadCommandes() {
    try {
      setLoading(true);
      const data = await commandeService.getAll();
      setCommandes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }

  async function createCommande(commande: Omit<Commande, 'id' | 'dateCreation'>) {
    try {
      const newCommande = await commandeService.create(commande);
      setCommandes([newCommande, ...commandes]);
      return newCommande;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function updateCommande(id: string, commande: Partial<Commande>) {
    try {
      const updatedCommande = await commandeService.update(id, commande);
      setCommandes(commandes.map(c => c.id === id ? updatedCommande : c));
      return updatedCommande;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function updateStatus(id: string, status: Commande['status'], motifAnnulation?: string) {
    try {
      const updatedCommande = await commandeService.updateStatus(id, status, motifAnnulation);
      setCommandes(commandes.map(c => c.id === id ? updatedCommande : c));
      return updatedCommande;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function deleteCommande(id: string) {
    try {
      await commandeService.delete(id);
      setCommandes(commandes.filter(c => c.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  return {
    commandes,
    loading,
    error,
    refresh: loadCommandes,
    createCommande,
    updateCommande,
    updateStatus,
    deleteCommande
  };
}
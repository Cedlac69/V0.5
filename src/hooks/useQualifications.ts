import { useState, useEffect } from 'react';
import { qualificationService } from '../services/api';
import type { Qualification } from '../types';

export function useQualifications() {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  async function loadQualifications() {
    try {
      setLoading(true);
      const data = await qualificationService.getAll();
      setQualifications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQualifications();
  }, [refreshTrigger]);

  async function createQualification(qualification: Omit<Qualification, 'id' | 'created_at'>) {
    try {
      const newQualification = await qualificationService.create(qualification);
      setRefreshTrigger(prev => prev + 1);
      return newQualification;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function updateQualification(id: string, qualification: Partial<Qualification>) {
    try {
      const updatedQualification = await qualificationService.update(id, qualification);
      setRefreshTrigger(prev => prev + 1);
      return updatedQualification;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  async function deleteQualification(id: string) {
    try {
      await qualificationService.delete(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    qualifications,
    loading,
    error,
    refresh,
    createQualification,
    updateQualification,
    deleteQualification
  };
}
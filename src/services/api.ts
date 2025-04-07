import { supabase } from '../lib/supabase';
import type { Agence, Client, Commande, Interim, Qualification, User } from '../types';

// Agences
export const agenceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('agences')
      .select('*')
      .order('nom');
    if (error) throw error;
    return data as Agence[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('agences')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Agence;
  },

  async create(agence: Omit<Agence, 'id' | 'dateCreation'>) {
    const { data, error } = await supabase
      .from('agences')
      .insert([agence])
      .select()
      .single();
    if (error) throw error;
    return data as Agence;
  },

  async update(id: string, agence: Partial<Agence>) {
    const { data, error } = await supabase
      .from('agences')
      .update(agence)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Agence;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('agences')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Intérimaires
export const interimService = {
  async getAll() {
    const { data, error } = await supabase
      .from('interimaires')
      .select(`
        *,
        qualifications (
          id,
          nom
        ),
        agences (
          id,
          nom
        )
      `)
      .order('nom');
    if (error) throw error;
    return data as Interim[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('interimaires')
      .select(`
        *,
        qualifications (
          id,
          nom
        ),
        agences (
          id,
          nom
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Interim;
  },

  async create(interim: Omit<Interim, 'id' | 'dateCreation'>) {
    const { data, error } = await supabase
      .from('interimaires')
      .insert([interim])
      .select()
      .single();
    if (error) throw error;
    return data as Interim;
  },

  async update(id: string, interim: Partial<Interim>) {
    const { data, error } = await supabase
      .from('interimaires')
      .update(interim)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Interim;
  },

  async updateDisponibilite(id: string, disponibilite: 'Disponible' | 'Occupé' | 'En poste') {
    const { data, error } = await supabase
      .from('interimaires')
      .update({ disponibilite })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Interim;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('interimaires')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Clients
export const clientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        agences (
          id,
          nom
        )
      `)
      .order('nom_etablissement');
    if (error) throw error;
    return data as Client[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        agences (
          id,
          nom
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Client;
  },

  async create(client: Omit<Client, 'id' | 'dateCreation'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  },

  async update(id: string, client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Commandes
export const commandeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        *,
        clients (
          id,
          nom_etablissement
        ),
        qualifications (
          id,
          nom
        ),
        agences (
          id,
          nom
        )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Commande[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        *,
        clients (
          id,
          nom_etablissement
        ),
        qualifications (
          id,
          nom
        ),
        agences (
          id,
          nom
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Commande;
  },

  async create(commande: Omit<Commande, 'id' | 'dateCreation'>) {
    const { data, error } = await supabase
      .from('commandes')
      .insert([commande])
      .select()
      .single();
    if (error) throw error;
    return data as Commande;
  },

  async update(id: string, commande: Partial<Commande>) {
    const { data, error } = await supabase
      .from('commandes')
      .update(commande)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Commande;
  },

  async updateStatus(id: string, status: Commande['status'], motifAnnulation?: string) {
    const { data, error } = await supabase
      .from('commandes')
      .update({ status, motif_annulation: motifAnnulation })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Commande;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('commandes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Qualifications
export const qualificationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('qualifications')
      .select('*')
      .order('nom');
    if (error) throw error;
    return data as Qualification[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('qualifications')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Qualification;
  },

  async create(qualification: Omit<Qualification, 'id' | 'dateCreation'>) {
    const { data, error } = await supabase
      .from('qualifications')
      .insert([qualification])
      .select()
      .single();
    if (error) throw error;
    return data as Qualification;
  },

  async update(id: string, qualification: Partial<Qualification>) {
    const { data, error } = await supabase
      .from('qualifications')
      .update(qualification)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Qualification;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('qualifications')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
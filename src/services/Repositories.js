import { supabase } from '../lib/supabase';

export const MealRepository = {
  async getAllByUserId(userId) {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async insert(meal) {
    const { data, error } = await supabase
      .from('meals')
      .insert([meal])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const ProfileRepository = {
  async getById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  },

  async create(profile) {
    const { error } = await supabase
      .from('profiles')
      .insert([profile]);
    
    if (error) throw error;
  }
};

export const FavoritesRepository = {
  async getAllByUserId(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('food_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async add(userId, foodId) {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, food_id: foodId }]);
    
    if (error) throw error;
  },

  async remove(userId, foodId) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('food_id', foodId);
    
    if (error) throw error;
  }
};

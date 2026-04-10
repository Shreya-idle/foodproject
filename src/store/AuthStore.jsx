import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ProfileRepository } from '../services/Repositories';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) await fetchProfile(session.user);
      else { setUser(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (sessionUser) => {
    try {
      const data = await ProfileRepository.getById(sessionUser.id);
      setUser({ ...sessionUser, ...data, joinedAt: sessionUser.created_at });
    } catch (e) {
      console.warn('Profile fallback');
      setUser({ ...sessionUser, name: sessionUser.user_metadata?.name || 'User', preferences: {}, joinedAt: sessionUser.created_at });
    } finally { setLoading(false); }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, name, initialGoal) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { name } }
    });
    if (error) throw error;
    if (data.user) {
      await ProfileRepository.create({
        id: data.user.id, name,
        preferences: { goal: initialGoal || 'balanced', calorieTarget: 2000, conditions: [] }
      });
    }
    return data;
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const updatePreferences = async (newPrefs) => {
    if (!user) return;
    const updatedPrefs = { ...user.preferences, ...newPrefs };
    await ProfileRepository.update(user.id, { preferences: updatedPrefs });
    setUser(prev => ({ ...prev, preferences: updatedPrefs }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updatePreferences }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

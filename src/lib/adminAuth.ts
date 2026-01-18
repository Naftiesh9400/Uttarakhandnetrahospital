import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Simple localStorage-based admin authentication
const ADMIN_KEY = 'netra_admin_auth';
const ADMIN_CREDENTIALS = {
  email: 'uttarakhandnetrahospitalktm@gmail.com',
  password: 'admin123'
};

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
  role?: 'master' | 'admin';
}

export const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  // Check master admin
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const user: AdminUser = { email, isAuthenticated: true, role: 'master' };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
    return { success: true };
  }

  // Check Firestore admins
  try {
    const q = query(collection(db, 'admins'), where('email', '==', email), where('password', '==', password));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const user: AdminUser = { email, isAuthenticated: true, role: 'admin' };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
      return { success: true };
    }
  } catch (error) {
    console.error("Auth error:", error);
    return { success: false, error: 'Authentication failed' };
  }

  return { success: false, error: 'Invalid email or password' };
};

export const adminLogout = (): void => {
  localStorage.removeItem(ADMIN_KEY);
};

export const getAdminUser = (): AdminUser | null => {
  const data = localStorage.getItem(ADMIN_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAdminAuthenticated = (): boolean => {
  const user = getAdminUser();
  return user?.isAuthenticated ?? false;
};

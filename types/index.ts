import { Timestamp } from 'firebase/firestore';

// Client (Müşteri) tipi
export interface Client {
  id: string;
  name: string;
  email: string;
  logoUrl?: string;
  createdAt: Timestamp;
}

// Project (Proje) tipi
export interface Project {
  id: string;
  clientId: string;
  name: string;
  status: 'active' | 'completed';
  deadline?: Timestamp;
  createdAt: Timestamp;
}

// Update (Güncelleme) tipi
export interface Update {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: 'design' | 'dev' | 'marketing';
  status?: 'pending' | 'approved' | 'needs_revision';
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  createdAt: Timestamp;
}

// User (Kullanıcı) tipi
export interface User {
  id: string; // Firebase Auth UID
  email: string;
  role: 'admin' | 'client';
  clientId?: string; // Client role için gerekli
  createdAt: Timestamp;
}

// Form için tipler (ID ve timestamp olmadan)
export type ClientInput = Omit<Client, 'id' | 'createdAt'>;
export type ProjectInput = Omit<Project, 'id' | 'createdAt'>;
export type UpdateInput = Omit<Update, 'id' | 'createdAt'>;
export type UserInput = Omit<User, 'id' | 'createdAt'>;

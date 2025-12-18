import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User, UserInput } from '@/types';

const COLLECTION_NAME = 'users';

// Kullanıcı oluştur veya güncelle
export async function createOrUpdateUser(uid: string, data: UserInput): Promise<void> {
  const userRef = doc(db, COLLECTION_NAME, uid);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

// Kullanıcı bilgilerini getir
export async function getUser(uid: string): Promise<User | null> {
  const userRef = doc(db, COLLECTION_NAME, uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return {
      id: userSnap.id,
      ...userSnap.data(),
    } as User;
  }
  return null;
}

// Kullanıcı rolünü kontrol et
export async function isAdmin(uid: string): Promise<boolean> {
  const user = await getUser(uid);
  return user?.role === 'admin';
}

// Kullanıcının client ID'sini getir
export async function getUserClientId(uid: string): Promise<string | null> {
  const user = await getUser(uid);
  return user?.clientId || null;
}

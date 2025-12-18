import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Update, UpdateInput } from '@/types';

const COLLECTION_NAME = 'updates';

// Güncelleme oluştur
export async function createUpdate(data: UpdateInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Projeye ait güncellemeleri getir
export async function getUpdatesByProject(projectId: string): Promise<Update[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Update[];
}

// Tek güncelleme getir
export async function getUpdate(id: string): Promise<Update | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Update;
  }
  return null;
}

// Güncelleme durumunu değiştir (Müşteri için)
export async function updateStatus(
  id: string,
  status: 'approved' | 'needs_revision',
  userId?: string
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status,
    reviewedAt: serverTimestamp(),
    ...(userId && { reviewedBy: userId }),
  });
}

// Güncelleme düzenle (Admin için)
export async function updateUpdate(id: string, data: Partial<UpdateInput>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
}

// Güncelleme sil
export async function deleteUpdate(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

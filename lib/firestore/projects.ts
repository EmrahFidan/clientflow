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
import type { Project, ProjectInput } from '@/types';

const COLLECTION_NAME = 'projects';

// Proje oluştur
export async function createProject(data: ProjectInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Tüm projeleri getir
export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
}

// Müşteriye ait projeleri getir
export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
}

// Tek proje getir
export async function getProject(id: string): Promise<Project | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Project;
  }
  return null;
}

// Proje güncelle
export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
}

// Proje sil
export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

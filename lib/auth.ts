import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './firebase';

// Magic Link gönder
export async function sendMagicLink(email: string): Promise<void> {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/verify`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  // E-postayı localStorage'a kaydet (verify için gerekli)
  window.localStorage.setItem('emailForSignIn', email);
}

// Email link doğrula ve giriş yap
export async function verifyEmailLink(emailLink: string): Promise<string> {
  if (!isSignInWithEmailLink(auth, emailLink)) {
    throw new Error('Geçersiz doğrulama linki');
  }

  let email = window.localStorage.getItem('emailForSignIn');

  // Eğer email localStorage'da yoksa kullanıcıdan al
  if (!email) {
    email = window.prompt('Lütfen giriş için kullandığınız e-posta adresini girin:');
  }

  if (!email) {
    throw new Error('E-posta adresi gerekli');
  }

  const result = await signInWithEmailLink(auth, email, emailLink);

  // localStorage'ı temizle
  window.localStorage.removeItem('emailForSignIn');

  return result.user.uid;
}

// Çıkış yap
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Mevcut kullanıcıyı getir
export function getCurrentUser() {
  return auth.currentUser;
}

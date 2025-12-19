/**
 * Firestore Users Fix Script
 * Admin ve Client kullanıcılarını Firestore'a ekler
 */

require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('\n🔧 Firestore Users Fix Script\n');

(async () => {
  try {
    const { initializeApp } = require('firebase/app');
    const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
    const { getFirestore, doc, setDoc, serverTimestamp, getDoc } = require('firebase/firestore');

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('🔐 Admin ile giriş yapılıyor...\n');

    // Admin ile giriş yap (böylece Firestore'a yazma izni olur)
    await signInWithEmailAndPassword(auth, 'admin@clientflow.com', 'Admin123');
    const adminUid = auth.currentUser.uid;

    console.log(`✅ Giriş başarılı! UID: ${adminUid}\n`);
    console.log('📝 Users dökümanları oluşturuluyor...\n');

    // Admin user dökümanı
    const adminRef = doc(db, 'users', adminUid);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      await setDoc(adminRef, {
        email: 'admin@clientflow.com',
        role: 'admin',
        createdAt: serverTimestamp(),
      });
      console.log('✅ Admin user dökümanı oluşturuldu!');
    } else {
      console.log('ℹ️  Admin user dökümanı zaten var');
    }

    // Client user UID'sini biliyoruz
    const clientUid = 'buybWKosrvUeREB0l5EUl5EdHP33';
    const clientRef = doc(db, 'users', clientUid);
    const clientDoc = await getDoc(clientRef);

    if (!clientDoc.exists()) {
      await setDoc(clientRef, {
        email: 'musteri@firma.com',
        role: 'client',
        clientId: null,
        createdAt: serverTimestamp(),
      });
      console.log('✅ Client user dökümanı oluşturuldu!');
    } else {
      console.log('ℹ️  Client user dökümanı zaten var');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Tamamlandı! Artık setup çalışacak!\n');
    console.log('🚀 https://clientflow-new.vercel.app/setup');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    console.error('Code:', error.code);

    if (error.code === 'permission-denied') {
      console.log('\n💡 Çözüm: Firestore Rules geçici olarak açık olmalı');
      console.log('Firebase Console > Firestore > Rules');
      console.log('Şu rule\'ı ekleyin:\n');
      console.log('allow write: if request.auth != null;');
    }

    process.exit(1);
  }
})();

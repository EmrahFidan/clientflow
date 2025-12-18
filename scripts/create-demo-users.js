// Demo kullanıcıları oluşturma script'i
// Kullanım: node scripts/create-demo-users.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdsrLgRwJbCgkDfD2tGMOR_8EZmS_sZgs",
  authDomain: "clientflow-36522.firebaseapp.com",
  projectId: "clientflow-36522",
  storageBucket: "clientflow-36522.firebasestorage.app",
  messagingSenderId: "261375564594",
  appId: "1:261375564594:web:4dba7e34eaa24a8e2f552b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createDemoUsers() {
  console.log('🚀 Demo kullanıcıları oluşturuluyor...\n');

  try {
    // 1. Admin kullanıcısı oluştur
    console.log('📝 Admin kullanıcısı oluşturuluyor...');
    const adminCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@clientflow.com',
      'Admin123'
    );
    console.log('✅ Admin Auth UID:', adminCredential.user.uid);

    // Admin'i Firestore users collection'a ekle
    await setDoc(doc(db, 'users', adminCredential.user.uid), {
      email: 'admin@clientflow.com',
      role: 'admin',
      createdAt: Timestamp.now(),
    });
    console.log('✅ Admin Firestore users collection\'a eklendi\n');

    // 2. Test Client oluştur
    console.log('📝 Test Client oluşturuluyor...');
    const clientRef = await addDoc(collection(db, 'clients'), {
      name: 'Test Müşteri A.Ş.',
      email: 'musteri@firma.com',
      createdAt: Timestamp.now(),
    });
    console.log('✅ Client ID:', clientRef.id);

    // 3. Client kullanıcısı oluştur
    console.log('📝 Client kullanıcısı oluşturuluyor...');
    const clientCredential = await createUserWithEmailAndPassword(
      auth,
      'musteri@firma.com',
      'Musteri123'
    );
    console.log('✅ Client Auth UID:', clientCredential.user.uid);

    // Client'i Firestore users collection'a ekle
    await setDoc(doc(db, 'users', clientCredential.user.uid), {
      email: 'musteri@firma.com',
      role: 'client',
      clientId: clientRef.id,
      createdAt: Timestamp.now(),
    });
    console.log('✅ Client Firestore users collection\'a eklendi\n');

    console.log('🎉 TAMAMLANDI! Demo kullanıcıları hazır:\n');
    console.log('👤 Admin:');
    console.log('   Email: admin@clientflow.com');
    console.log('   Password: Admin123\n');
    console.log('👤 Client:');
    console.log('   Email: musteri@firma.com');
    console.log('   Password: Musteri123\n');

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  Kullanıcılar zaten mevcut!');
      console.log('\n👤 Mevcut Demo Hesaplar:');
      console.log('   Admin: admin@clientflow.com / Admin123');
      console.log('   Client: musteri@firma.com / Musteri123');
    } else {
      console.error('❌ Hata:', error.message);
    }
  }
}

createDemoUsers();

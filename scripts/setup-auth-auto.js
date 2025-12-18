/**
 * Firebase Authentication Setup Script (Auto Mode)
 *
 * Otomatik çalışır, kullanıcı onayı beklemez
 */

require('dotenv').config({ path: '.env.local' });

// Firebase config from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('\n🔥 ClientFlow - Firebase Authentication Setup (Auto Mode)\n');
console.log('📁 Project ID:', firebaseConfig.projectId);
console.log('🌐 Firebase Console: https://console.firebase.google.com/project/clientflow-36522\n');

(async () => {
  try {
    console.log('🔄 Firebase bağlantısı kuruluyor...');

    // Import Firebase Client SDK
    const { initializeApp } = require('firebase/app');
    const { getAuth, createUserWithEmailAndPassword, signOut } = require('firebase/auth');
    const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('✅ Firebase bağlantısı başarılı\n');

    // Users to create
    const users = [
      {
        email: 'admin@clientflow.com',
        password: 'Admin123',
        role: 'admin',
      },
      {
        email: 'musteri@firma.com',
        password: 'Musteri123',
        role: 'client',
        clientId: null,
      }
    ];

    console.log('👥 Kullanıcılar oluşturuluyor...\n');

    for (const userData of users) {
      try {
        console.log(`📧 ${userData.email} oluşturuluyor...`);

        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        const uid = userCredential.user.uid;
        console.log(`   ✅ Authentication kullanıcısı oluşturuldu (UID: ${uid})`);

        // Create user document in Firestore
        const userDoc = {
          email: userData.email,
          role: userData.role,
          createdAt: serverTimestamp(),
        };

        if (userData.role === 'client') {
          userDoc.clientId = userData.clientId;
        }

        await setDoc(doc(db, 'users', uid), userDoc);
        console.log(`   ✅ Firestore dökümanı oluşturuldu`);
        console.log(`   📋 Role: ${userData.role}\n`);

        // Sign out to allow next user creation
        await signOut(auth);

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`   ⚠️  Kullanıcı zaten var: ${userData.email}`);
          console.log(`   ℹ️  Bu normal, devam ediyoruz...\n`);
        } else {
          console.error(`   ❌ Hata: ${error.message}`);
          console.error(`   Code: ${error.code}\n`);
        }
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Setup başarıyla tamamlandı!\n');
    console.log('📝 Test kullanıcıları:');
    console.log('   👤 Admin:  admin@clientflow.com  / Admin123');
    console.log('   👤 Client: musteri@firma.com     / Musteri123\n');
    console.log('🚀 Sonraki adımlar:');
    console.log('   1. npm run dev (Dev server\'ı başlat)');
    console.log('   2. http://localhost:3000/auth/login (Login sayfası)');
    console.log('   3. Admin ile giriş yap\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);

  } catch (error) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ Setup başarısız!\n');
    console.error('Hata:', error.message);

    if (error.code === 'auth/operation-not-allowed') {
      console.log('\n💡 Çözüm:');
      console.log('   Firebase Console\'da Authentication > Email/Password\'u aktif edin:');
      console.log('   https://console.firebase.google.com/project/clientflow-36522/authentication/providers\n');
    } else {
      console.log('\n🔍 Sorun giderme:');
      console.log('   1. Firebase Console\'da Authentication > Email/Password aktif mi?');
      console.log('   2. .env.local dosyası var mı ve doğru değerler içeriyor mu?');
      console.log('   3. İnternet bağlantınız aktif mi?');
      console.log('   4. Firebase project ID doğru mu? (' + firebaseConfig.projectId + ')');
    }

    console.log('\n📖 Detaylı kurulum: FIREBASE-SETUP.md\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(1);
  }
})();

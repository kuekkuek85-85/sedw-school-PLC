import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD0KqNTQ03ImLTFLLXlmxil49dJAWTlYMg',
  authDomain: 'sedw-school-plc.firebaseapp.com',
  projectId: 'sedw-school-plc',
  storageBucket: 'sedw-school-plc.firebasestorage.app',
  messagingSenderId: '798605986152',
  appId: '1:798605986152:web:4074882d474d7ab94deedd',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

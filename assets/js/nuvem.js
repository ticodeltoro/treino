// Sincronizacao com o Firestore - treino
// Um documento por usuario. As regras garantem que ninguem le o do outro.
import {
  getFirestore, doc, getDoc, setDoc, enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app, auth } from "./auth-gate.js";
import { APP_ID } from "./firebase-config.js";

export const db = getFirestore(app);

// Cache offline: na academia sem sinal o app continua lendo e gravando,
// e sobe sozinho quando a internet voltar.
try {
  await enableIndexedDbPersistence(db);
} catch (e) {
  // Falha se o app estiver aberto em outra aba. Nao e motivo para parar.
}

function ref() {
  const u = auth.currentUser;
  if (!u) throw new Error('sem login');
  return doc(db, 'users', u.uid, APP_ID, 'estado');
}

export async function lerEstado() {
  const s = await getDoc(ref());
  return s.exists() ? s.data() : null;
}

export async function gravarEstado(estado) {
  await setDoc(ref(), estado, { merge: false });
}

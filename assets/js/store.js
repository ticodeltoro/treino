// Persistencia no Firestore - treino
// Cada usuario grava apenas em users/<uid>/... (garantido por firestore.rules)
import {
  getFirestore, doc, setDoc, getDoc, collection, addDoc,
  query, orderBy, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app, auth } from "./auth-gate.js";
import { APP_ID } from "./firebase-config.js";

export const db = getFirestore(app);

function base() {
  const u = auth.currentUser;
  if (!u) throw new Error('Nao autenticado');
  return `users/${u.uid}/${APP_ID}`;
}

/** Salva/atualiza um documento fixo (ex.: 'estado', 'config'). */
export async function salvar(nomeDoc, dados) {
  await setDoc(doc(db, base(), nomeDoc),
               { ...dados, atualizadoEm: serverTimestamp() },
               { merge: true });
}

/** Le um documento fixo. Retorna null se nao existir. */
export async function ler(nomeDoc) {
  const s = await getDoc(doc(db, base(), nomeDoc));
  return s.exists() ? s.data() : null;
}

/** Adiciona um registro em uma colecao (ex.: historico de treinos). */
export async function registrar(colecao, dados) {
  return addDoc(collection(db, base(), colecao),
                { ...dados, criadoEm: serverTimestamp() });
}

/** Lista registros de uma colecao, mais recentes primeiro. */
export async function listar(colecao) {
  const q = query(collection(db, base(), colecao), orderBy('criadoEm', 'desc'));
  const s = await getDocs(q);
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
}

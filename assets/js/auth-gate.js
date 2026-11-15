// Portao de autenticacao - treino
// Bloqueia a interface ate o login. Os DADOS sao protegidos pelas regras
// do Firestore no servidor - este portao e apenas a camada de interface.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const TELA = `
<div id="pb-login" style="position:fixed;inset:0;z-index:99999;display:flex;
  align-items:center;justify-content:center;background:#0A0F0D;
  font-family:system-ui,-apple-system,sans-serif;padding:24px;
  padding-bottom:calc(24px + env(safe-area-inset-bottom))">
  <form id="pb-form" style="width:100%;max-width:340px;display:flex;
    flex-direction:column;gap:12px">
    <h1 style="color:#EAF2EE;font-size:22px;margin:0 0 8px;text-align:center">Treino</h1>
    <input id="pb-email" type="email" required placeholder="E-mail" autocomplete="username"
      style="padding:14px;border-radius:12px;border:1px solid #2a2f3a;background:#141821;
      color:#EAF2EE;font-size:16px">
    <input id="pb-pass" type="password" required placeholder="Senha" autocomplete="current-password"
      style="padding:14px;border-radius:12px;border:1px solid #2a2f3a;background:#141821;
      color:#EAF2EE;font-size:16px">
    <button type="submit" style="padding:14px;border-radius:12px;border:0;
      background:#16A34A;color:#fff;font-size:16px;font-weight:600">Entrar</button>
    <p id="pb-erro" style="color:#f87171;font-size:13px;min-height:18px;margin:0;
      text-align:center"></p>
  </form>
</div>`;

function mostrarLogin() {
  if (document.getElementById('pb-login')) return;
  document.body.insertAdjacentHTML('beforeend', TELA);
  document.getElementById('pb-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const erro = document.getElementById('pb-erro');
    erro.textContent = 'Entrando...';
    try {
      await signInWithEmailAndPassword(
        auth,
        document.getElementById('pb-email').value.trim(),
        document.getElementById('pb-pass').value
      );
    } catch (e) {
      erro.textContent = e.code === 'auth/invalid-credential'
        ? 'E-mail ou senha incorretos.'
        : 'Falha ao entrar: ' + e.code;
    }
  });
}

function esconderLogin() {
  document.getElementById('pb-login')?.remove();
}

export function sair() { return signOut(auth); }

onAuthStateChanged(auth, (user) => {
  if (user) {
    esconderLogin();
    window.dispatchEvent(new CustomEvent('pb:login', { detail: { uid: user.uid } }));
  } else {
    mostrarLogin();
    window.dispatchEvent(new Event('pb:logout'));
  }
});

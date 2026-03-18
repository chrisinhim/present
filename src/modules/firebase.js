import { state } from './state.js';
import { pubsub } from './pubsub.js';
import { auth, db, googleProvider } from '../firebase-config.js';

const firebase = window.firebase;

export function setupAuthListener() {
    auth.onAuthStateChanged(async (user) => {
        state.user = user;
        if (user) {
            document.getElementById('btn-login').style.display = 'none';
            document.getElementById('btn-logout').style.display = 'inline-block';
            await loadSettings();
        } else {
            document.getElementById('btn-login').style.display = 'inline-block';
            document.getElementById('btn-logout').style.display = 'none';
        }
    });
}

export async function handleLogin() {
    try {
        await auth.signInWithPopup(googleProvider);
    } catch (e) {
        alert("Login failed: " + e.message);
    }
}

export async function handleLogout() {
    try {
        await auth.signOut();
    } catch (e) {
        console.error("Logout failed:", e);
    }
}

export async function saveSettings() {
    if (!state.user) {
        localStorage.setItem('church_display_settings', JSON.stringify(state.settings));
        return;
    }
    try {
        await db.collection('users').doc(state.user.uid).set({
            settings: state.settings,
            lastActiveDept: state.activeDept,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (e) {
        console.error("Error saving settings:", e);
    }
}

export async function loadSettings() {
    if (!state.user) {
        const local = localStorage.getItem('church_display_settings');
        if (local) {
            state.settings = JSON.parse(local);
            pubsub.publish('settings-loaded', state.settings);
        }
        return;
    }
    try {
        const doc = await db.collection('users').doc(state.user.uid).get();
        if (doc.exists) {
            const data = doc.data();
            if (data.settings) state.settings = { ...state.settings, ...data.settings };
            if (data.lastActiveDept) state.activeDept = data.lastActiveDept;
            pubsub.publish('settings-loaded', state.settings);
        }
    } catch (e) {
        console.error("Error loading settings:", e);
    }
}

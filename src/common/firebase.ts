import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

import { FirebaseUser, FirebaseCustomClaims, IFakeFillerOptions, User } from "src/types";

type AuthStateChangeCallback = (user: FirebaseUser, claims: FirebaseCustomClaims) => void;
type OptionsChangeCallback = (options: IFakeFillerOptions) => void;
type SettingsSchema = {
  options: string;
  updatedAt: firebase.firestore.FieldValue;
};

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

firebase.firestore.setLogLevel("silent");

const auth = firebase.auth();
const db = firebase.firestore();

let firebaseUser: FirebaseUser | null = null;
let firebaseClaims: FirebaseCustomClaims | null = null;
let userClaimsUpdatedAt: firebase.firestore.FieldValue | null = null;
let optionsUpdatedAt: firebase.firestore.FieldValue | null = null;
let userSnapshotUnsubscribe: firebase.Unsubscribe | null = null;
let authStateChangeCallback: AuthStateChangeCallback | null = null;

let optionsSnapshotUnsubscribe: firebase.Unsubscribe | null = null;
let optionsChangeCallback: OptionsChangeCallback | null = null;

function unsubscribeAllSnapshots() {
  if (userSnapshotUnsubscribe) {
    userSnapshotUnsubscribe();
  }

  if (optionsSnapshotUnsubscribe) {
    optionsSnapshotUnsubscribe();
  }
}

function onNewSettings(snapshot: firebase.firestore.DocumentSnapshot<Partial<SettingsSchema>>) {
  const data = snapshot.data();

  if (!snapshot.metadata.hasPendingWrites && data && data.updatedAt && data.options) {
    optionsUpdatedAt = data.updatedAt;
    const options = JSON.parse(data.options) as IFakeFillerOptions;
    if (optionsChangeCallback) {
      optionsChangeCallback(options);
    }
  }
}

async function onNewClaims(snapshot: firebase.firestore.DocumentSnapshot<Partial<User>>) {
  const data = snapshot.data();

  if (firebaseUser && data && data.claimsUpdatedAt) {
    if (userClaimsUpdatedAt && !data.claimsUpdatedAt.isEqual(userClaimsUpdatedAt)) {
      await firebaseUser.getIdToken(true);
    }

    userClaimsUpdatedAt = data.claimsUpdatedAt;
  }
}

auth.onAuthStateChanged((user) => {
  firebaseUser = user;

  if (user) {
    unsubscribeAllSnapshots();

    userSnapshotUnsubscribe = db.collection("users").doc(user.uid).onSnapshot(onNewClaims);
    optionsSnapshotUnsubscribe = db.collection("settings").doc(user.uid).onSnapshot(onNewSettings);
  } else {
    unsubscribeAllSnapshots();

    if (authStateChangeCallback) {
      authStateChangeCallback(null, null);
    }
  }
});

auth.onIdTokenChanged(async (user) => {
  if (authStateChangeCallback) {
    if (user) {
      const result = await user.getIdTokenResult(false);
      firebaseClaims = result.claims as FirebaseCustomClaims;
      authStateChangeCallback(user, firebaseClaims);
    } else {
      authStateChangeCallback(null, null);
    }
  }
});

export function onAuthStateChange(callback: AuthStateChangeCallback) {
  authStateChangeCallback = callback;
}

export function onOptionsChange(callback: OptionsChangeCallback) {
  optionsChangeCallback = callback;
}

export async function login(email: string, password: string) {
  await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const result = await auth.signInWithEmailAndPassword(email, password);
  if (result && result.user && result.user.email) {
    firebaseUser = result.user;
    return firebaseUser;
  }

  return null;
}

export function logout() {
  unsubscribeAllSnapshots();
  optionsUpdatedAt = null;
  return auth.signOut();
}

export async function saveOptionsToDb(options: IFakeFillerOptions) {
  if (firebaseUser && firebaseClaims && firebaseClaims.subscribed) {
    const updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    await db
      .collection("settings")
      .doc(firebaseUser.uid)
      .set({ options: JSON.stringify(options), updatedAt }, { merge: true });

    return updatedAt;
  }

  return null;
}

export async function getOptionsLastUpdatedTimestamp() {
  if (optionsUpdatedAt) {
    return (optionsUpdatedAt as firebase.firestore.Timestamp).toDate();
  }

  if (firebaseUser) {
    const result = await db.collection("settings").doc(firebaseUser.uid).get();
    if (result.exists) {
      optionsUpdatedAt = (result.data() as SettingsSchema).updatedAt;
      return (optionsUpdatedAt as firebase.firestore.Timestamp).toDate();
    }
  }

  return undefined;
}

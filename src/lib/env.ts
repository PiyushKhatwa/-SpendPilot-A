type PublicFirebaseEnvKey =
  | "NEXT_PUBLIC_FIREBASE_API_KEY"
  | "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  | "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  | "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  | "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  | "NEXT_PUBLIC_FIREBASE_APP_ID"
  | "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID";

type ServerEnvKey =
  | "OPENAI_API_KEY"
  | "RESEND_API_KEY"
  | "FIREBASE_PROJECT_ID"
  | "FIREBASE_CLIENT_EMAIL"
  | "FIREBASE_PRIVATE_KEY";

function readEnv(name: PublicFirebaseEnvKey | ServerEnvKey) {
  return process.env[name];
}

export function getRequiredEnv(name: PublicFirebaseEnvKey | ServerEnvKey) {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getOptionalEnv(name: PublicFirebaseEnvKey | ServerEnvKey) {
  return readEnv(name);
}

export function getPublicFirebaseConfig() {
  return {
    apiKey: getRequiredEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: getRequiredEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: getRequiredEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getRequiredEnv(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    ),
    appId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: getOptionalEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"),
  };
}

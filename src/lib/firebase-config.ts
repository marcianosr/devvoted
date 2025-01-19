export const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

export const emulatorHost = "localhost";
export const authEmulatorPort = 9099;
export const firestoreEmulatorPort = 8080;

export const getEmulatorHost = (port: number) => `http://${emulatorHost}:${port}`;

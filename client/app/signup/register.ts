import { decodeCredentialsOptions, encodeAttestationPublicKeyCredential } from '@/utils/credentials';
import * as T from '@/types';
import api from '@/utils/axios';

async function beginRegister(email: string) {
  const response = await api.post('/register/begin', { email });
  return decodeCredentialsOptions(response.data);
}

async function finishRegister(payload: T.AttestationPublicKeyCredentialJSON) {
  const response = await api.post('/register/finish', payload);
  return response.data;
}

async function requestCredential(email: string) {
  const publickKeyCredentialsOptions = await beginRegister(email);

  const credential = await navigator.credentials.create({
    publicKey: publickKeyCredentialsOptions,
  });

  if (!credential) {
    throw 'Unable to fetch credential';
  }

  return credential as T.AttestationPublicKeyCredential;
}

async function verifyCredential(credential: T.AttestationPublicKeyCredential) {
  const payload = encodeAttestationPublicKeyCredential(credential);
  await finishRegister(payload);
}

export default async function createCredentials(email: string) {
  try {
    const credential = await requestCredential(email);
    await verifyCredential(credential);
    alert('Registration success.');
  } catch (err) {
    console.error('Unable to register user', err);
    alert('Failed to register user.');
    throw err;
  }
}

import { decodeCredentialsOptions, encodeAttestationPublicKeyCredential } from '@/utils/credentials';
import api from '@/utils/axios';
import * as Types from '@/credentials.types';

async function beginRegister(email: string) {
  const response = await api.post('/register/begin', { email });
  return decodeCredentialsOptions(response.data);
}

async function finishRegister(payload: Types.AttestationPublicKeyCredentialJSON) {
  const response = await api.post('/register/finish', payload);
  return response.data;
}

async function requestCredential(email: string) {
  const publicKeyCredentialsCreateOptions = await beginRegister(email);

  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialsCreateOptions,
  });

  if (!credential) {
    throw 'Unable to fetch credential';
  }

  return credential as PublicKeyCredential;
}

async function verifyCredential(credential: PublicKeyCredential) {
  const attestation = encodeAttestationPublicKeyCredential(credential);
  await finishRegister(attestation);
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

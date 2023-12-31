import { toast } from 'sonner';

import { decodePublicKeyCredentialRequestOptions, encodeAssertionPublicKeyCredential } from '@/utils/credentials';
import api from '@/utils/axios';
import * as Types from '@/credentials.types';

export async function beginLogin(email: string) {
  const response = await api.post('/login/begin', { email });
  return decodePublicKeyCredentialRequestOptions(response.data);
}

export async function finishLogin(payload: Types.PublicKeyCredentialJSON) {
  const response = await api.post('/login/finish', payload);
  return response.data;
}

async function requestCredential(username: string) {
  const publicKeyCredentialsRequestOptions = await beginLogin(username);

  const credential = await navigator.credentials.get({
    publicKey: publicKeyCredentialsRequestOptions,
  });

  if (!credential) {
    throw 'Unable to fetch credential';
  }

  return credential as PublicKeyCredential;
}

async function verifyCredential(credential: PublicKeyCredential) {
  const assertion = encodeAssertionPublicKeyCredential(credential);
  await finishLogin(assertion);
}

export default async function loginUser(email: string) {
  try {
    const credential = await requestCredential(email);
    await verifyCredential(credential);
  } catch (err) {
    console.error('Unable to login user', err);
    toast.error('Failed to login user.');
    throw err;
  }
}

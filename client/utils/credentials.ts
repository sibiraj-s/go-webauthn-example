import { base64url } from './base64-url';
import * as T from '@/types';

export function arrayBufferDecode(value: string): ArrayBuffer {
  return base64url.decode(value);
}

export function arrayBufferEncode(value: ArrayBuffer): string {
  return base64url.encode(value);
}

function decodePublicKeyCredentialDescriptor(
  descriptor: T.PublicKeyCredentialDescriptorJSON,
): PublicKeyCredentialDescriptor {
  return {
    id: arrayBufferDecode(descriptor.id),
    type: descriptor.type,
    transports: descriptor.transports,
  };
}

export function decodeCredentialsOptions(options: T.PublicKeyCredentialCreationOptionsJSON) {
  return {
    attestation: options.attestation,
    authenticatorSelection: options.authenticatorSelection,
    challenge: arrayBufferDecode(options.challenge),
    excludeCredentials: options.excludeCredentials?.map(decodePublicKeyCredentialDescriptor),
    extensions: options.extensions,
    pubKeyCredParams: options.pubKeyCredParams,
    rp: options.rp,
    timeout: options.timeout,
    user: {
      displayName: options.user.displayName,
      id: arrayBufferDecode(options.user.id),
      name: options.user.name,
    },
  };
}

export function decodePublicKeyCredentialRequestOptions(
  options: T.PublicKeyCredentialRequestOptionsJSON,
): PublicKeyCredentialRequestOptions {
  let allowCredentials: PublicKeyCredentialDescriptor[] | undefined;

  if (options.allowCredentials?.length !== 0) {
    allowCredentials = options.allowCredentials?.map(decodePublicKeyCredentialDescriptor);
  }

  return {
    allowCredentials,
    challenge: arrayBufferDecode(options.challenge),
    extensions: options.extensions,
    rpId: options.rpId,
    timeout: options.timeout,
    userVerification: options.userVerification,
  };
}

export function encodeAttestationPublicKeyCredential(
  credential: T.AttestationPublicKeyCredential,
): T.AttestationPublicKeyCredentialJSON {
  const response = credential.response as T.AuthenticatorAttestationResponseFuture;

  let transports: AuthenticatorTransport[] | undefined;

  if (response?.getTransports !== undefined && typeof response.getTransports === 'function') {
    transports = response.getTransports();
  }

  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferEncode(credential.rawId),
    clientExtensionResults: credential.getClientExtensionResults(),
    response: {
      attestationObject: arrayBufferEncode(response.attestationObject),
      clientDataJSON: arrayBufferEncode(response.clientDataJSON),
    },
    transports,
  };
}

export function encodeAssertionPublicKeyCredential(credential: PublicKeyCredential): T.PublicKeyCredentialJSON {
  const response = credential.response as AuthenticatorAssertionResponse;

  let userHandle: string;

  if (response.userHandle == null) {
    userHandle = '';
  } else {
    userHandle = arrayBufferEncode(response.userHandle);
  }

  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferEncode(credential.rawId),
    clientExtensionResults: credential.getClientExtensionResults(),
    response: {
      authenticatorData: arrayBufferEncode(response.authenticatorData),
      clientDataJSON: arrayBufferEncode(response.clientDataJSON),
      signature: arrayBufferEncode(response.signature),
      userHandle,
    },
  };
}

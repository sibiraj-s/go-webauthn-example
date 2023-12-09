import { base64url } from '@/lib/base64-url';
import * as Types from '@/credentials.types';

export function arrayBufferDecode(value: string): ArrayBuffer {
  return base64url.decode(value);
}

export function arrayBufferEncode(value: ArrayBuffer): string {
  return base64url.encode(value);
}

function decodePublicKeyCredentialDescriptor(
  descriptor: Types.PublicKeyCredentialDescriptorJSON,
): PublicKeyCredentialDescriptor {
  return {
    id: arrayBufferDecode(descriptor.id),
    type: descriptor.type,
    transports: descriptor.transports,
  };
}

export function decodeCredentialsOptions(options: Types.PublicKeyCredentialCreationOptionsJSON) {
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

function getTransports(response?: AuthenticatorAttestationResponse): AuthenticatorTransport[] {
  if (typeof response?.getTransports !== 'function') {
    return [];
  }

  return response.getTransports() as AuthenticatorTransport[];
}

export function encodeAttestationPublicKeyCredential(
  credential: PublicKeyCredential,
): Types.AttestationPublicKeyCredentialJSON {
  const response = credential.response as AuthenticatorAttestationResponse;

  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferEncode(credential.rawId),
    clientExtensionResults: credential.getClientExtensionResults(),
    authenticatorAttachment: credential.authenticatorAttachment,
    response: {
      attestationObject: arrayBufferEncode(response.attestationObject),
      clientDataJSON: arrayBufferEncode(response.clientDataJSON),
    },
    transports: getTransports(response),
  };
}

export function decodePublicKeyCredentialRequestOptions(
  options: Types.PublicKeyCredentialRequestOptionsJSON,
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

export function encodeAssertionPublicKeyCredential(credential: PublicKeyCredential): Types.PublicKeyCredentialJSON {
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
    authenticatorAttachment: credential.authenticatorAttachment,
    response: {
      authenticatorData: arrayBufferEncode(response.authenticatorData),
      clientDataJSON: arrayBufferEncode(response.clientDataJSON),
      signature: arrayBufferEncode(response.signature),
      userHandle,
    },
  };
}

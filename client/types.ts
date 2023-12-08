export interface PublicKeyCredentialDescriptorJSON extends Omit<PublicKeyCredentialDescriptor, 'id'> {
  id: string;
}

export interface PublicKeyCredentialUserEntityJSON extends Omit<PublicKeyCredentialUserEntity, 'id'> {
  id: string;
}

export interface PublicKeyCredentialCreationOptionsJSON
  extends Omit<PublicKeyCredentialCreationOptions, 'challenge' | 'excludeCredentials' | 'user'> {
  challenge: string;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  user: PublicKeyCredentialUserEntityJSON;
}

export interface AttestationPublicKeyCredential extends PublicKeyCredential {
  response: AuthenticatorAttestationResponseFuture;
}

export interface PublicKeyCredentialRequestOptionsJSON
  extends Omit<PublicKeyCredentialRequestOptions, 'allowCredentials' | 'challenge'> {
  allowCredentials?: PublicKeyCredentialDescriptorJSON[];
  challenge: string;
}

export interface AuthenticatorAttestationResponseFuture extends AuthenticatorAttestationResponse {
  getTransports(): AuthenticatorTransport[];
  getAuthenticatorData(): ArrayBuffer;
  getPublicKey(): ArrayBuffer;
  getPublicKeyAlgorithm(): COSEAlgorithmIdentifier;
}

export interface AuthenticatorAttestationResponseJSON
  extends Omit<AuthenticatorAttestationResponseFuture, 'clientDataJSON' | 'attestationObject'> {
  clientDataJSON: string;
  attestationObject: string;
}

export interface AuthenticatorAssertionResponseJSON
  extends Omit<AuthenticatorAssertionResponse, 'authenticatorData' | 'clientDataJSON' | 'signature' | 'userHandle'> {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
  userHandle: string;
}

export interface PublicKeyCredentialJSON
  extends Omit<PublicKeyCredential, 'rawId' | 'response' | 'getClientExtensionResults'> {
  rawId: string;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  response: AuthenticatorAssertionResponseJSON;
}

export interface AttestationPublicKeyCredentialJSON
  extends Omit<AttestationPublicKeyCredential, 'response' | 'rawId' | 'getClientExtensionResults'> {
  rawId: string;
  response: AuthenticatorAttestationResponseJSON;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  transports?: AuthenticatorTransport[];
}

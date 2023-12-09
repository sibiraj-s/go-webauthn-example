interface PublicKeyCredentialUserEntityJSON extends Omit<PublicKeyCredentialUserEntity, 'id'> {
  id: string;
}

export interface PublicKeyCredentialDescriptorJSON extends Omit<PublicKeyCredentialDescriptor, 'id'> {
  id: string;
}

interface AuthenticatorAttestationResponseJSON {
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

// encoded credentials options recieved from server while begin registration
export interface PublicKeyCredentialCreationOptionsJSON
  extends Omit<PublicKeyCredentialCreationOptions, 'challenge' | 'excludeCredentials' | 'user'> {
  challenge: string;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  user: PublicKeyCredentialUserEntityJSON;
}

// encoded credentions to be sent to server to finish registration
export interface AttestationPublicKeyCredentialJSON
  extends Omit<PublicKeyCredential, 'response' | 'rawId' | 'getClientExtensionResults'> {
  rawId: string;
  response: AuthenticatorAttestationResponseJSON;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  transports?: AuthenticatorTransport[];
}

// encoded credentials options recieved from server while begin login
export interface PublicKeyCredentialRequestOptionsJSON
  extends Omit<PublicKeyCredentialRequestOptions, 'allowCredentials' | 'challenge'> {
  allowCredentials?: PublicKeyCredentialDescriptorJSON[];
  challenge: string;
}

// encoded credentions to be sent to server to finish login
export interface PublicKeyCredentialJSON
  extends Omit<PublicKeyCredential, 'rawId' | 'response' | 'getClientExtensionResults'> {
  rawId: string;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  response: AuthenticatorAssertionResponseJSON;
}

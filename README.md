# go-webauthn

> A demo for webauthn using go-webauthn

Note: This is just an example, in real world you might want to think about every security aspects.

## Getting Started

Clone the repository

```bash
git clone https://github.com/sibiraj-s/go-webauthn-example
cd go-webauthn
```

## Prerequisites

- Nodejs - can be installed with [nvm](https://github.com/nvm-sh/nvm)

- Golang

Use [Homebrew](https://brew.sh/) to install golang

```bash
brew install golang
```

These are just recomended ways to install. You can use whatever tools you like.

## Directory structure

```
.
├── client (Frontend with nextjs)
└── server (Backend with golang)
```

## Starting the client dev server

Install the dependencies using npm

```bash
npm install
```

and then run

```bash
npm run dev
```

## Starting the backend dev server

Before running the dev server, you need to install some certificates to run the server over https.

Install [mkcert](https://github.com/FiloSottile/mkcert) for that

```bash
brew install mkcert
```

Then run

```bash
mkcert -install
```

This will ask for password if you are running for the first time.

After that, navigate to certs directory

```bash
cd certs
# then
mkcert passkeys.local
```

Also, you'd need to add the entry `passkeys.local` to your `/etc/host`

```
127.0.0.1 passkeys.local
```

We are creating the custom domain, to test all the features. Some only work on `https` environment or even password managers like Bitwarden and 1Password or others would pick up passkeys request only on
https environment.

Now start the server

```bash
go run .
```

Thats it 🎉. You can now visit https://passkeys.local to see the server running.

Note: The go server proxies the requests to next.js dev server running at port 3000.

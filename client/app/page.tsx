import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Powered by&nbsp;
          <Link href="https://github.com/go-webauthn/webauthn" target="_blank" className="hover:underline">
            <code className="font-mono font-bold">go-webauthn</code>
          </Link>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/sibiraj-s"
            target="_blank"
            rel="noopener noreferrer"
          >
            By <span className="text-xl">Sibiraj</span>
          </Link>
        </div>
      </div>

      <div className="flex h-36 place-items-center">
        <span className="text-center text-4xl md:text-6xl">WebAuthn Spec Demo</span>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <Link
          href="/register"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Register
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              {'->'}
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Effortless Registration, Fortified Security with WebAuthn.
          </p>
        </Link>

        <Link
          href="/login"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Login
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              {'->'}
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Unparalleled Security - Login the WebAuthn Way.</p>
        </Link>
      </div>
    </main>
  );
}

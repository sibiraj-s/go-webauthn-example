import { Suspense } from 'react';

import LoginForm from './LoginForm';

export default function Login() {
  return (
    <section className="flex h-dvh items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}

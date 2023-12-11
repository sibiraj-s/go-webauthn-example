'use client';

import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import loginUser from './login';

type LoginFormInputs = {
  email: string;
};

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, formState } = useForm<LoginFormInputs>({
    defaultValues: {
      email: searchParams.get('user') ?? 'johndoe@acme.com',
    },
  });

  const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await loginUser(data.email);
      router.push('/u/dashboard');
    } catch {}
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Your email
        </label>
        <input
          type="text"
          id="email"
          className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your email"
          required
          {...register('email')}
        />
      </div>
      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
        disabled={formState.isSubmitting}
      >
        Log in
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don&apos;t have an account yet?{' '}
        <Link href="/signup" className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

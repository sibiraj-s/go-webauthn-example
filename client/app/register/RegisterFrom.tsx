'use client';

import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import createCredentials from './register';

type RegisterFormInputs = {
  email: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<RegisterFormInputs>({
    defaultValues: {
      email: 'johndoe@acme.com',
    },
  });

  const handleFormSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await createCredentials(data.email);
      router.push(`/login?user=${data.email}`, {});
    } catch {}
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Your email
        </label>
        <input
          type="email"
          id="email"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your email"
          required
          {...register('email')}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        disabled={formState.isSubmitting}
      >
        Register
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already having an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">
          Log in
        </Link>
      </p>
    </form>
  );
}

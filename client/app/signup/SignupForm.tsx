'use client';

import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import createCredentials from './register';

type SignupFormInputs = {
  email: string;
};

export default function SignupForm() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<SignupFormInputs>({
    defaultValues: {
      email: 'johndoe@acme.com',
    },
  });

  const handleFormSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      await createCredentials(data.email);
      router.push(`/login?user=${data.email}`, {});
    } catch {}
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your email
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter your email"
          required
          {...register('email')}
        />
      </div>
      <button
        type="submit"
        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        disabled={formState.isSubmitting}
      >
        Sign up
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already having an account?{' '}
        <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
          Sign in
        </Link>
      </p>
    </form>
  );
}

'use client';

import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import createCredentials from './register';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <Card className="mx-auto w-full max-w-sm py-10">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Your email</Label>
              <Input type="email" id="email" placeholder="Enter your email" required {...register('email')} />
            </div>
            <Button type="submit" disabled={formState.isSubmitting}>
              Register
            </Button>
          </div>
          <p className="mt-8 text-sm">
            Already having an account?{' '}
            <Link href="/login" className="font-medium text-indigo-400 underline underline-offset-4">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

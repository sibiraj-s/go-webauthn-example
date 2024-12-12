'use client';

import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryState } from 'nuqs';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import loginUser from './login';

type LoginFormInputs = {
  email: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [email] = useQueryState('email', { defaultValue: '' });

  const { register, handleSubmit, formState } = useForm<LoginFormInputs>({
    defaultValues: {
      email,
    },
  });

  const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await loginUser(data.email);
      router.push('/u/dashboard');
      toast.success('Successfully logged in!');
    } catch {}
  };

  return (
    <Card className="mx-auto w-full max-w-sm py-10">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Your email</Label>
              <Input
                type="text"
                placeholder="Enter your email"
                required
                autoComplete="webauthn"
                {...register('email')}
              />
            </div>
            <Button type="submit" disabled={formState.isSubmitting}>
              Authenticate
            </Button>
          </div>
          <p className="mt-8 text-sm">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-medium text-indigo-400 underline underline-offset-4">
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

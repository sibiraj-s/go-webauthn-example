import SignupForm from './SignupForm';

export default function Signup() {
  return (
    <section className="h-full">
      <div className="mx-auto flex h-full flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <a href="#" className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
          Acme Corp.
        </a>
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-950 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Create your account
            </h1>
            <SignupForm />
          </div>
        </div>
      </div>
    </section>
  );
}

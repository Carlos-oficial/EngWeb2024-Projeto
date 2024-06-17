'use client';

import { useSearchParams, useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();

  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col space-y-3'>
        <h2 className='text-center'>Something went wrong!</h2>
        <Button
          className='w-fit m-auto'
          variant={'default'}
          onClick={
            // Attempt to recover by trying to re-render the invoices route
            () => router.push('/auth/signin')
          }
        >
          Try again
        </Button>
      </div>
    </main>
  );
}

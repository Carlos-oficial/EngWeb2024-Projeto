'use client';

import ResourceCard from '@/components/resource_card';
import Spinner from '@/components/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { listResources } from '@/lib/data';
import { ResourceDTO } from '@/lib/types';
import ResourceDialog from '@/components/resource_dialog';

export default function Resources() {
  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    listResources()
      .then((resources) => setResources(resources))
      .catch((error: Error) => setError(error.message));
  }, []);

  return resources != null ? (
    <main className='flex h-full w-full'>
      <div className='p-5 space-y-3 overflow-scroll w-full'>
        <div className='flex space-x-2'>
          <Input type='text' placeholder='Search any resource...' />
          <ResourceDialog />
        </div>
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
           {resources.map((resource) => (
            <ResourceCard resource={resource} key={resource._id} />
          ))
          } 
        </div>
      </div>
      <div className='min-w-80 border-l border-border'></div>
    </main>
  ) : (
    <main className='flex flex-col justify-center items-center h-full'>
      {error.length > 0 ? (
        <Alert variant='destructive' className='w-fit'>
          <AlertTitle className='flex items-center space-x-1'>
            <i className='ph ph-warning'></i>
            <p>Error</p>
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Spinner />
      )}
    </main>
  );
}

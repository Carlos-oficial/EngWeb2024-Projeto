'use client';

import ResourceCard from '@/components/resource_card';
import Spinner from '@/components/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback } from 'react';
import { listResources } from '@/lib/data';
import { ResourceDTO } from '@/lib/types';
import ResourceDialog from '@/components/resource_dialog';

const searchAttributes = [
  'title',
  'description',
  'documentType',
  'documentFormat',
  'userEmail',
  'userName',
  'hashtags',
  'createdAt',
  'subject.name',
  'course.name',
];

function searchResources(resources: ResourceDTO[] | null, searchQuery: string) {
  if (resources) {
    if (
      searchQuery.length > 0 &&
      !searchQuery.split('').every((c) => c === ' ')
    ) {
      return resources.filter((resource) => {
        for (const attr of searchAttributes) {
          let value;
          const fst = attr.split('.')[0] as keyof ResourceDTO;
          if (fst === 'subject') {
            const snd = attr.split('.')[1] as keyof ResourceDTO['subject'];
            value = resource[fst][snd];
          } else if (fst === 'course') {
            const snd = attr.split('.')[1] as keyof ResourceDTO['course'];
            value = resource[fst][snd];
          } else value = resource[attr as keyof ResourceDTO];

          const queryWords = searchQuery.toLowerCase().split(' ');
          if (
            queryWords.every((word) =>
              String(value).toLowerCase().includes(word),
            )
          )
            return true;
        }
        return false;
      });
    } else
      return resources.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  return null;
}

export default function Resources() {
  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [shownResources, setShownResources] = useState<ResourceDTO[] | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  function handleSearchQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  useEffect(() => {
    let newShownResources = resources;
    newShownResources = searchResources(newShownResources, searchQuery);
    // ...
    setShownResources(newShownResources);
  }, [searchQuery, resources]);

  const refreshResources = useCallback(() => {
    listResources()
      .then((resources) => setResources(resources))
      .catch((error: Error) => setError(error.message));
  }, []);

  useEffect(() => {
    refreshResources();
  }, [refreshResources]);

  return shownResources != null ? (
    <main className='flex h-full w-full'>
      <div className='p-5 space-y-3 overflow-scroll w-full'>
        <div className='flex space-x-2'>
          <Input
            type='text'
            placeholder='Search any resource...'
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <ResourceDialog refreshResources={refreshResources} />
        </div>
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {shownResources.map((resource) => (
            <ResourceCard resource={resource} key={resource._id} />
          ))}
        </div>
      </div>
      <div className='hidden xl:block min-w-72 border-l border-border'></div>
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

'use client';

import ResourceCard from '@/components/resource_card';
import Spinner from '@/components/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback } from 'react';
import { listFavoriteResources, listResources } from '@/lib/data';
import { ResourceDTO } from '@/lib/types';
import ResourceDialog from '@/components/resource_dialog';
import ResourceFilters from '@/components/resource_filters';
import { useSession } from 'next-auth/react';
import SignInCard from '@/components/signin_card';
// import { useSearchParams } from 'next/navigation';
// import {
//   Breadcrumb,
//   BreadcrumbEllipsis,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';

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
    } else return resources;
  }
  return null;
}

function filterResources(
  resources: ResourceDTO[] | null,
  documentTypeId: string,
  courseId: string,
  subjectId: string,
) {
  if (resources) {
    return resources.filter((resource) => {
      if (
        (documentTypeId === 'All' ||
          resource.documentType._id === documentTypeId) &&
        (courseId === 'All' || resource.course._id === courseId) &&
        (subjectId === 'All' || resource.subject._id === subjectId)
      )
        return true;
      return false;
    });
  }
  return null;
}

export default function Resources({ params }: { params: { view?: string[] } }) {
  const session = useSession();
  // const searchParams = useSearchParams();

  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [shownResources, setShownResources] = useState<ResourceDTO[] | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  // filters
  const [documentTypeId, setDocumentTypeId] = useState<string>('All');
  const [courseId, setCourseId] = useState<string>('All');
  const [subjectId, setSubjectId] = useState<string>('All');

  function handleSearchQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  useEffect(() => {
    let newShownResources = resources;
    newShownResources = searchResources(newShownResources, searchQuery);
    newShownResources = filterResources(
      newShownResources,
      documentTypeId,
      courseId,
      subjectId,
    );
    setShownResources(newShownResources);
  }, [searchQuery, documentTypeId, courseId, subjectId, resources]);

  // fetch resources and apply necessary treatment (filtering, sorting, etc.)
  const refreshResources = useCallback(() => {
    if (
      session.status === 'authenticated' &&
      params.view &&
      params.view[0] === 'favorites'
    ) {
      listFavoriteResources(session.data.user.email)
        .then((resources) => {
          setResources(
            resources.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
          );
        })
        .catch((error: Error) => setError(error.message));
    } else {
      listResources()
        .then((resources) => {
          if (params.view) {
            // sort by newest
            if (params.view[0] === 'newest') {
              setResources(
                resources?.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
              );
            }
          } else {
            // sort by popularity
            setResources(
              resources?.sort((a, b) =>
                a.favoritesNr < b.favoritesNr ? 1 : -1,
              ),
            );
          }
        })
        .catch((error: Error) => setError(error.message));
    }
  }, [params.view, session.status, session.data?.user.email]);

  useEffect(() => {
    refreshResources();
  }, [refreshResources]);

  if (
    params.view &&
    params.view[0] === 'favorites' &&
    session.status !== 'authenticated'
  ) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <SignInCard message='You need to be signed in to access favorites.' />
      </div>
    );
  } else {
    return error.length > 0 ? (
      <main className='flex flex-col justify-center items-center h-full'>
        {error.length > 0 && (
          <Alert variant='destructive' className='w-fit'>
            <AlertTitle className='flex items-center space-x-1'>
              <i className='ph ph-warning'></i>
              <p>Error</p>
            </AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </main>
    ) : (
      <main className='flex h-full w-full'>
        <div className='p-5 space-y-3 overflow-scroll w-full'>
          {/* {(searchParams.get('course') || searchParams.get('hashtag')) && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>Home</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )} */}
          <div className='flex space-x-2'>
            <Input
              type='text'
              placeholder='Search any resource...'
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
            <ResourceDialog refreshResources={refreshResources} />
          </div>
          {shownResources !== null ? (
            <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
              {shownResources.map((resource) => (
                <ResourceCard resource={resource} key={resource._id} />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center h-5/6'>
              <Spinner />
            </div>
          )}
        </div>
        <div className='hidden xl:block min-w-72 border-l border-border p-2'>
          <ResourceFilters
            documentTypeId={documentTypeId}
            setDocumentTypeId={setDocumentTypeId}
            courseId={courseId}
            setCourseId={setCourseId}
            subjectId={subjectId}
            setSubjectId={setSubjectId}
          />
        </div>
      </main>
    );
  }
}

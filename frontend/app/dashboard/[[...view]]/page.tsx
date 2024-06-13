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
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

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
        const queryWords = searchQuery.toLowerCase().split(' ');
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [shownResources, setShownResources] = useState<ResourceDTO[] | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [pageNr, setPageNr] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // filters
  const [documentTypeId, setDocumentTypeId] = useState<string>('All');
  const [courseId, setCourseId] = useState<string>('All');
  const [subjectId, setSubjectId] = useState<string>('All');

  function handleSearchQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function getCourseName(courseId: string) {
    return (
      resources?.find((r) => r.course._id === courseId)?.course.name || '...'
    );
  }

  function getSubjectName(subjectId: string) {
    return (
      resources?.find((r) => r.subject._id === subjectId)?.subject.name || '...'
    );
  }

  function getSearchParamsUrl() {
    let acc = 0;
    let url = '';
    if (searchParams.has('course')) {
      url += `${acc > 0 ? '&' : '?'}course=${searchParams.get('course')}`;
      acc++;
    }
    if (searchParams.has('subject')) {
      url += `${acc > 0 ? '&' : '?'}subject=${subjectId}`;
      acc++;
    }
    if (searchParams.has('tag')) {
      url += `${acc > 0 ? '&' : '?'}tag=${searchParams.get('tag')}`;
      acc++;
    }
    return url;
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
    if (searchParams.has('p')) {
      setPageNr(parseInt(searchParams.get('p') as string));
    } else {
      setPageNr(1);
    }

    if (searchParams.has('course')) {
      setCourseId(searchParams.get('course') as string);
    } else {
      setCourseId('All');
    }

    if (searchParams.has('subject')) {
      setSubjectId(searchParams.get('subject') as string);
    } else {
      setSubjectId('All');
    }

    if (searchParams.has('tag')) {
      setSearchQuery('#' + searchParams.get('tag'));
    }

    if (pageNr !== null) {
      if (
        session.status === 'authenticated' &&
        params.view &&
        params.view[0] === 'favorites'
      ) {
        listFavoriteResources(session.data.user.email, pageNr)
          .then((res) => {
            setResources(res.data);
            setTotalPages(res.pagesNr);
          })
          .catch((error: Error) => setError(error.message));
      } else if (params.view && params.view[0] === 'newest') {
        listResources('newest', pageNr)
          .then((res) => {
            setResources(res.data);
            setTotalPages(res.pagesNr);
          })
          .catch((error: Error) => setError(error.message));
      } else {
        listResources('popular', pageNr)
          .then((res) => {
            setResources(res.data);
            setTotalPages(res.pagesNr);
          })
          .catch((error: Error) => setError(error.message));
      }
    }
  }, [
    params.view,
    session.status,
    session.data?.user.email,
    pageNr,
    searchParams,
  ]);

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
        <div className='h-full flex flex-col justify-between p-5 overflow-y-scroll w-full'>
          <div className='space-y-3 w-full'>
            {(searchParams.has('course') || searchParams.has('hashtag')) && (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className='flex items-center'>
                      <Link href={pathname}>
                        {params.view && params.view[0] === 'favorites' ? (
                          <i className='ph ph-star text-lg'></i>
                        ) : params.view && params.view[0] === 'newest' ? (
                          <i className='ph ph-seal text-lg'></i>
                        ) : (
                          <i className='ph ph-fire text-lg'></i>
                        )}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      asChild
                      className='flex space-x-2 items-center'
                    >
                      <Link
                        href={`${pathname}?course=${searchParams.get('course')}`}
                      >
                        <i className='ph ph-graduation-cap text-lg'></i>
                        <span>
                          {getCourseName(searchParams.get('course') ?? '')}
                        </span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {searchParams.has('subject') && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          asChild
                          className='flex space-x-2 items-center'
                        >
                          <Link
                            href={`${pathname}?course=${searchParams.get(
                              'course',
                            )}&subject=${searchParams.get('subject')}`}
                          >
                            <i className='ph ph-chalkboard-teacher text-lg'></i>
                            <span>
                              {getSubjectName(
                                searchParams.get('subject') ?? '',
                              )}
                            </span>
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            )}
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
              <div className='flex items-center justify-center h-[calc(100vh-10rem)]'>
                <Spinner />
              </div>
            )}
          </div>
          {totalPages && pageNr && (
            <Pagination className='pt-6'>
              <PaginationContent>
                {pageNr > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`${pathname}${getSearchParamsUrl()}${getSearchParamsUrl() === '' ? '?' : '&'}p=${pageNr - 1}`}
                    />
                  </PaginationItem>
                )}
                {pageNr - 1 > 0 && (
                  <PaginationItem>
                    <PaginationLink
                      href={`${pathname}${getSearchParamsUrl()}${getSearchParamsUrl() === '' ? '?' : '&'}p=${pageNr - 1}`}
                    >
                      {pageNr - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href={`${pathname}${getSearchParamsUrl()}${getSearchParamsUrl() === '' ? '?' : '&'}p=${pageNr}`}
                    isActive
                  >
                    {pageNr}
                  </PaginationLink>
                </PaginationItem>
                {pageNr + 1 <= totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      href={`${pathname}${getSearchParamsUrl()}${getSearchParamsUrl() === '' ? '?' : '&'}p=${pageNr + 1}`}
                    >
                      {pageNr + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {totalPages > 2 && pageNr < totalPages - 1 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href={`${pathname}${getSearchParamsUrl()}${getSearchParamsUrl() === '' ? '?' : '&'}p=${totalPages}`}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                {pageNr < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={`${pathname}${getSearchParamsUrl()}${getSearchParamsUrl() === '' ? '?' : '&'}p=${pageNr + 1}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
        <div className='hidden xl:block min-w-72 max-w-72 border-l border-border p-2'>
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

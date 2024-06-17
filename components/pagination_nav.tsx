import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PaginationNav({
  pageNr,
  totalPages,
}: {
  pageNr: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function getSearchParamsUrl(pageNr: number) {
    let acc = 0;

    let params: string = '';
    searchParams.forEach((value, key) => {
      if (key !== 'p') {
        params += `${acc > 0 ? '&' : '?'}${key}=${value}`;
        acc++;
      }
    });

    return `${params}${acc > 0 ? '&' : '?'}p=${pageNr}`;
  }

  return (
    <Pagination className='pt-6'>
      <PaginationContent>
        {pageNr > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${pathname}${getSearchParamsUrl(pageNr - 1)}`}
            />
          </PaginationItem>
        )}
        {pageNr - 1 > 0 && (
          <PaginationItem>
            <PaginationLink
              href={`${pathname}${getSearchParamsUrl(pageNr - 1)}`}
            >
              {pageNr - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href={`${pathname}${getSearchParamsUrl(pageNr)}`}
            isActive
          >
            {pageNr}
          </PaginationLink>
        </PaginationItem>
        {pageNr + 1 <= totalPages && (
          <PaginationItem>
            <PaginationLink
              href={`${pathname}${getSearchParamsUrl(pageNr + 1)}`}
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
                href={`${pathname}${getSearchParamsUrl(totalPages)}`}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {pageNr < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={`${pathname}${getSearchParamsUrl(pageNr + 1)}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

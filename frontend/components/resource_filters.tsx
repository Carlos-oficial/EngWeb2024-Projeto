import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from './ui/label';
import { CourseDB, SubjectDB, DocumentTypeDB } from '@/lib/types';
import { listSubjects, listCourses, listDocumentTypes } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResourceFilters({
  documentTypeId,
  setDocumentTypeId,
  courseId,
  setCourseId,
  subjectId,
  setSubjectId,
}: {
  documentTypeId: string;
  setDocumentTypeId: (documentTypeId: string) => void;
  courseId: string;
  setCourseId: (courseId: string) => void;
  subjectId: string;
  setSubjectId: (subjectId: string) => void;
}) {
  const searchParams = useSearchParams();

  // filters
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeDB[]>([]);
  const [courses, setCourses] = useState<CourseDB[]>([]);
  const [subjects, setSubjects] = useState<SubjectDB[]>([]);
  const [shownSubjects, setShownSubjects] = useState<SubjectDB[]>([]);

  const [open1, setOpen1] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);

  useEffect(() => {
    setShownSubjects(
      subjects
        .filter((subject) => subject.courseId === courseId)
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    );
  }, [subjects, courseId]);

  function minutesAgo(a: Date, b: Date, minutes: number) {
    return a.getTime() - b.getTime() < minutes * 60 * 1000;
  }

  useEffect(() => {
    const dt_date = localStorage.getItem('documentTypesUpdatedAt');
    const c_date = localStorage.getItem('coursesUpdatedAt');
    const s_date = localStorage.getItem('subjectsUpdatedAt');
    const dt = localStorage.getItem('documentTypes');
    const c = localStorage.getItem('courses');
    const s = localStorage.getItem('subjects');

    if (!dt || !dt_date || minutesAgo(new Date(), new Date(dt_date), 5))
      listDocumentTypes()
        .then((data) => {
          setDocumentTypes(data.sort((a, b) => (a.name < b.name ? -1 : 1)));
          localStorage.setItem('documentTypes', JSON.stringify(data));
          localStorage.setItem('documentTypesUpdatedAt', Date.now().toString());
        })
        .catch((error: Error) => console.error(error.message));
    else
      setDocumentTypes(
        (JSON.parse(dt) as DocumentTypeDB[]).sort((a, b) =>
          a.name < b.name ? -1 : 1,
        ),
      );
    if (!c || !c_date || minutesAgo(new Date(), new Date(c_date), 5))
      listCourses()
        .then((data) => {
          setCourses(data.sort((a, b) => (a.name < b.name ? -1 : 1)));
          localStorage.setItem('courses', JSON.stringify(data));
          localStorage.setItem('coursesUpdatedAt', Date.now().toString());
        })
        .catch((error: Error) => console.error(error.message));
    else
      setCourses(
        (JSON.parse(c) as CourseDB[]).sort((a, b) =>
          a.name < b.name ? -1 : 1,
        ),
      );
    if (!s || !s_date || minutesAgo(new Date(), new Date(s_date), 5))
      listSubjects()
        .then((data) => {
          setSubjects(data.sort((a, b) => (a.name < b.name ? -1 : 1)));
          localStorage.setItem('subjects', JSON.stringify(data));
          localStorage.setItem('subjectsUpdatedAt', Date.now().toString());
        })
        .catch((error: Error) => console.error(error.message));
    else
      setSubjects(
        (JSON.parse(s) as SubjectDB[]).sort((a, b) =>
          a.name < b.name ? -1 : 1,
        ),
      );
  }, []);

  return (
    <div className='flex flex-col items-center space-y-2'>
      <div className='w-full space-y-2'>
        <Label htmlFor='types'>Resource Type</Label>
        <Select defaultValue={documentTypeId} onValueChange={setDocumentTypeId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='w-[271px]'>
            <SelectItem value='All'>All</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type._id.toString()} value={type._id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!searchParams.has('course') && (
        <div className='w-full space-y-2'>
          <Label htmlFor='courses'>Course</Label>
          <Popover open={open1} onOpenChange={setOpen1}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                role='combobox'
                aria-expanded={open1}
                className='w-full justify-between overflow-x-hidden font-normal'
              >
                {courseId !== 'All'
                  ? courses.find((course) => course._id === courseId)?.name
                  : 'All'}
                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[271px] p-0'>
              <Command
                filter={(value, search) => {
                  if (
                    courses
                      .find((course) => course._id === value)
                      ?.name.toLowerCase()
                      .includes(search.toLowerCase())
                  )
                    return 1;
                  return 0;
                }}
              >
                <CommandInput placeholder='Search course...' className='h-9' />
                <CommandList>
                  <CommandEmpty>No course found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                      value='All'
                      onSelect={(currentValue) => {
                        currentValue !== courseId && setCourseId(currentValue);
                        setSubjectId('All');
                        setOpen1(false);
                      }}
                    >
                      All
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 min-w-4',
                          courseId === 'All' ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                    {courses.map((course) => (
                      <CommandItem
                        className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                        key={course._id.toString()}
                        value={course._id.toString()}
                        onSelect={(currentValue) => {
                          currentValue !== courseId &&
                            setCourseId(currentValue);
                          setOpen1(false);
                        }}
                      >
                        {course.name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 min-w-4',
                            courseId === course._id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
      {!searchParams.has('subject') && (
        <div className='w-full space-y-2'>
          <Label htmlFor='subjects'>Subject</Label>
          <Popover open={open2} onOpenChange={setOpen2}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                role='combobox'
                aria-expanded={open2}
                className='w-full justify-between overflow-x-hidden font-normal'
                disabled={courseId === 'All'}
              >
                {subjectId !== 'All'
                  ? shownSubjects.find((subject) => subject._id === subjectId)
                      ?.name ?? 'All'
                  : 'All'}
                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[271px] p-0'>
              <Command
                filter={(value, search) => {
                  if (
                    shownSubjects
                      .find((subject) => subject._id === value)
                      ?.name.toLowerCase()
                      .includes(search.toLowerCase())
                  )
                    return 1;
                  return 0;
                }}
              >
                <CommandInput placeholder='Search subject...' className='h-9' />
                <CommandList>
                  <CommandEmpty>No subject found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                      value='All'
                      onSelect={(currentValue) => {
                        currentValue !== subjectId &&
                          setSubjectId(currentValue);
                        setOpen2(false);
                      }}
                    >
                      All
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 min-w-4',
                          subjectId === 'All' ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                    {shownSubjects.map((subject) => (
                      <CommandItem
                        className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                        key={subject._id.toString()}
                        value={subject._id.toString()}
                        onSelect={(currentValue) => {
                          currentValue !== subjectId &&
                            setSubjectId(currentValue);
                          setOpen2(false);
                        }}
                      >
                        {subject.name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 min-w-4',
                            subjectId === subject._id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}

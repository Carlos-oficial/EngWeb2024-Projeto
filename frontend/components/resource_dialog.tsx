'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  addCourse,
  addDocumentType,
  addSubject,
  submitResource,
} from '@/lib/data';
import { CourseDB, SubjectDB, DocumentTypeDB } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import SignInCard from '@/components/signin_card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/spinner';
import AddForm from '@/components/add_form';

import { listSubjects, listCourses, listDocumentTypes } from '@/lib/data';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(50, { message: 'Title must be at most 50 characters' }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(100, { message: 'Description must be at most 100 characters' }),
  documentTypeId: z.string({ required_error: 'Resource type is required' }), // é um ID
  hashtags: z.string().regex(new RegExp('^(#\\w+)?( #\\w+)*$'), {
    message: 'Hashtags must be separated by spaces and start with #',
  }),
  subjectId: z.string({ required_error: 'Subject is required' }), // é um ID
  courseId: z.string({ required_error: 'Course is required' }), // é um ID
  file: z.instanceof(FileList),
});

export default function ResourceDialog({
  refreshResources,
}: {
  refreshResources: () => void;
}) {
  const session = useSession();
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeDB[]>([]);
  const [courses, setCourses] = useState<CourseDB[]>([]);
  const [subjects, setSubjects] = useState<SubjectDB[]>([]);
  const [shownSubjects, setShownSubjects] = useState<SubjectDB[]>([]);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      documentTypeId: '',
      hashtags: '',
      subjectId: '',
      courseId: '',
      file: undefined,
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    const formData = new FormData();

    // insert all received values into form data
    for (const [key, value] of Object.entries(values)) {
      if (value instanceof FileList) formData.append(key, value[0]);
      else formData.append(key, value);
    }

    // insert extra values into form data
    formData.append(
      'documentFormat',
      values.file[0].name.split('.').pop()?.toUpperCase() ?? '',
    );
    formData.append('createdAt', new Date().toISOString());
    formData.append('userEmail', (session.data?.user?.email as string) ?? '');

    submitResource(formData)
      .then(() => {
        // TODO: Post to feed
        setOpen(false);
        setTimeout(() => {
          toast({
            title: 'Resource submitted successfully!',
            description: 'Thank you for your contribution.',
          });
          refreshResources();
        }, 300);
      })
      .catch((error: Error) => {
        setError(error.message);
      });
  };

  const handleAddSubject = (subject: string) => {
    addSubject(subject, form.getValues('courseId'))
      .then(() => {
        listSubjects()
          .then((data) => {
            setSubjects(data.sort((a, b) => (a.name < b.name ? -1 : 1)));
            updateShownSubjects();
          })
          .catch((error: Error) => setError(error.message));
      })
      .catch((error: Error) => setError(error.message));
  };

  const handleAddCourse = (course: string) => {
    addCourse(course)
      .then(() => {
        listCourses()
          .then((data) =>
            setCourses(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
          )
          .catch((error: Error) => setError(error.message));
      })
      .catch((error: Error) => setError(error.message));
  };

  const handleAddDocumentType = (documentType: string) => {
    addDocumentType(documentType)
      .then(() => {
        listDocumentTypes()
          .then((data) =>
            setDocumentTypes(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
          )
          .catch((error: Error) => setError(error.message));
      })
      .catch((error: Error) => setError(error.message));
  };

  const handleCourseValueChange = (courseId: string) => {
    form.setValue('courseId', courseId);
    updateShownSubjects();
  };

  const updateShownSubjects = useCallback(() => {
    setShownSubjects(
      subjects
        .filter((subject) => subject.courseId === form.getValues('courseId'))
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    );
  }, [form, subjects]);

  useEffect(() => {
    listDocumentTypes()
      .then((data) =>
        setDocumentTypes(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
      )
      .catch((error: Error) => setError(error.message));
    listCourses()
      .then((data) =>
        setCourses(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
      )
      .catch((error: Error) => setError(error.message));
    listSubjects()
      .then((data) =>
        setSubjects(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
      )
      .catch((error: Error) => setError(error.message));
  }, []);

  useEffect(() => {
    updateShownSubjects();
  }, [subjects, updateShownSubjects]);

  const fileRef = form.register('file');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='flex space-x-1'>
          <i className='ph ph-file-plus'></i>
          <p>Add Resource</p>
        </Button>
      </DialogTrigger>
      <DialogContent className='h-full md:max-h-[calc(70vh)] overflow-y-scroll'>
        {session.status === 'loading' ? (
          <Spinner />
        ) : session.status === 'authenticated' ? (
          <>
            <DialogHeader>
              <DialogTitle>Add Resource</DialogTitle>
              <DialogDescription>
                Submit a new resource to the platform here. Click submit when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-3'
                encType='multipart/form-data'
              >
                <FormField
                  control={form.control}
                  name='file'
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel>Resource File</FormLabel>
                        <FormControl>
                          <Input
                            type='file'
                            placeholder='Upload your file here.'
                            {...fileRef}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload the file you want to share.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Short title that identifies the resource.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Short description of the resource content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='documentTypeId'
                  render={({ field }) => (
                    <FormItem className='max-w-[calc(32rem-3rem-2px)]'>
                      <FormLabel>Resource Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-40'>
                          {documentTypes.map((type) => (
                            <SelectItem
                              key={type._id.toString()}
                              value={type._id.toString()}
                              className='max-w-[calc(32rem-3rem-2px)]'
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                          {session.data.user.isAdmin && (
                            <AddForm
                              action={handleAddDocumentType}
                              fieldId='documentType'
                              placeholder='Type a new resource type name...'
                            />
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='hashtags'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hashtags</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        List of hashtags that describe the resource, separated
                        by spaces.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='courseId'
                  render={({ field }) => (
                    <FormItem className='max-w-[calc(32rem-3rem-2px)]'>
                      <FormLabel>Course</FormLabel>
                      <Popover open={open1} onOpenChange={setOpen1}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              role='combobox'
                              aria-expanded={open1}
                              className={`w-full justify-between overflow-x-hidden font-normal ${field.value === '' && 'text-muted-foreground hover:text-muted-foreground'}`}
                            >
                              {field.value !== ''
                                ? courses.find(
                                    (course) => course._id === field.value,
                                  )?.name
                                : 'Please select a course...'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[calc(32rem-3rem-2px)] p-0'>
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
                            <CommandInput
                              placeholder='Search course...'
                              className='h-9'
                            />
                            <CommandList>
                              <CommandEmpty>No course found.</CommandEmpty>
                              <CommandGroup>
                                {courses.map((course) => (
                                  <CommandItem
                                    className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                                    key={course._id.toString()}
                                    value={course._id.toString()}
                                    onSelect={(currentValue) => {
                                      currentValue !== field.value &&
                                        handleCourseValueChange(currentValue);
                                      setOpen1(false);
                                    }}
                                  >
                                    {course.name}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 min-w-4',
                                        field.value === course._id
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              {session.data.user.isAdmin && (
                                <AddForm
                                  action={handleAddCourse}
                                  fieldId='course'
                                  placeholder='Type a new course name...'
                                />
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='subjectId'
                  render={({ field }) => (
                    <FormItem className='max-w-[calc(32rem-3rem-2px)]'>
                      <FormLabel>Subject</FormLabel>
                      <Popover open={open2} onOpenChange={setOpen2}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              role='combobox'
                              aria-expanded={open2}
                              className={`w-full justify-between overflow-x-hidden font-normal ${(field.value === '' || !shownSubjects.find((subject) => subject._id === field.value)) && 'text-muted-foreground hover:text-muted-foreground'}`}
                              disabled={form.getValues('courseId') === ''}
                            >
                              {field.value !== ''
                                ? shownSubjects.find(
                                    (subject) => subject._id === field.value,
                                  )?.name ?? 'Please select a subject...'
                                : 'Please select a subject...'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[calc(32rem-3rem-2px)] p-0'>
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
                            <CommandInput
                              placeholder='Search subject...'
                              className='h-9'
                            />
                            <CommandList>
                              <CommandEmpty>No subject found.</CommandEmpty>
                              <CommandGroup>
                                {shownSubjects.map((subject) => (
                                  <CommandItem
                                    className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                                    key={subject._id.toString()}
                                    value={subject._id.toString()}
                                    onSelect={(currentValue) => {
                                      currentValue !== field.value &&
                                        field.onChange(currentValue);
                                      setOpen2(false);
                                    }}
                                  >
                                    {subject.name}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 min-w-4',
                                        field.value === subject._id
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              {session.data.user.isAdmin && (
                                <AddForm
                                  action={handleAddSubject}
                                  fieldId='subject'
                                  placeholder='Type a new subject name...'
                                />
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error.length > 0 && (
                  <Alert variant='destructive' className='pt-4'>
                    <AlertTitle className='flex items-center space-x-1'>
                      <i className='ph ph-warning'></i>
                      <p>Error</p>
                    </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter className='pt-3'>
                  <Button type='submit' className='flex space-x-1'>
                    <i className='ph ph-file-arrow-up'></i>
                    <p>Submit</p>
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <SignInCard message='You need to be signed in to submit a resource.' />
        )}
      </DialogContent>
    </Dialog>
  );
}

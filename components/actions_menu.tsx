import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardHeader, CardContent } from './ui/card';
import { Badge } from '@/components/ui/badge';
import { ResourceDB, ResourceDTO } from '@/lib/types';
import { CourseDB, SubjectDB, DocumentTypeDB } from '@/lib/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  listSubjects,
  listCourses,
  listDocumentTypes,
  editResource,
  addSubject,
  addCourse,
  addDocumentType,
  deleteResource,
  makeInvisible,
  makeVisible,
  lock,
  unlock,
} from '@/lib/data';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Spinner from './spinner';
import AddForm from './add_form';
import SignInCard from './signin_card';
import { useToast } from './ui/use-toast';

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
  hashtags: z.string().regex(new RegExp('^(#\\w+)?( #\\w+)*$'), {
    message: 'Hashtags must be separated by spaces and start with #',
  }),
  documentTypeId: z
    .string({ required_error: 'Resource type is required' })
    .min(1, { message: 'Resource type is required' }),
  subjectId: z
    .string({ required_error: 'Subject is required' })
    .min(1, { message: 'Subject is required' }),
  courseId: z
    .string({ required_error: 'Course is required' })
    .min(1, { message: 'Course is required' }),
});

export default function ActionsMenu({
  resource,
  refreshResources,
}: {
  resource: ResourceDTO;
  refreshResources: () => void;
}) {
  const { toast } = useToast();

  const [visible, setVisible] = useState<boolean>(resource.isVisible);
  const [locked, setLocked] = useState<boolean>(resource.isLocked);

  const hanldleUnlist = () => {
    setVisible(false);
    makeInvisible(resource._id)
      .then(() => setVisible(false))
      .catch((error: Error) => {
        setVisible(true);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        });
      });
  };
  const hanldleMakeVisible = () => {
    setVisible(true);
    makeVisible(resource._id)
      .then(() => setVisible(true))
      .catch((error: Error) => {
        setVisible(false);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        });
      });
  };
  const hanldleUnlock = () => {
    setLocked(false);
    unlock(resource._id)
      .then(() => setLocked(false))
      .catch(() => setLocked(true));
  };
  const hanldleLock = () => {
    setLocked(true);
    lock(resource._id)
      .then(() => setLocked(true))
      .catch(() => setLocked(false));
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: resource.title,
      description: resource.description,
      hashtags: resource.hashtags.join(' '),
      documentTypeId: resource.documentType._id,
      subjectId: resource.subject._id,
      courseId: resource.course._id,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    const resourceInfo = {
      title: values.title,
      description: values.description,
      subjectId: values.subjectId,
      courseId: values.courseId,
      documentTypeId: values.documentTypeId,
      hashtags: values.hashtags,
      userEmail: resource.userEmail,
      edited: new Date(),
    } as Partial<ResourceDB>;

    editResource(resource._id, resourceInfo)
      .then(() => {
        setOpen(false);
        setTimeout(() => {
          toast({
            description: 'Resource edited.',
          });
          refreshResources();
        }, 300);
      })
      .catch((error: Error) => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        });
      });
  };

  const session = useSession();
  const [error, setError] = useState<string>('');

  const [documentTypes, setDocumentTypes] = useState<DocumentTypeDB[] | null>(
    [],
  );
  const [courses, setCourses] = useState<CourseDB[] | null>([]);
  const [subjects, setSubjects] = useState<SubjectDB[] | null>([]);
  const [shownSubjects, setShownSubjects] = useState<SubjectDB[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  useEffect(() => {
    if (open) {
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
    } else {
      setTimeout(() => {
        form.setValue('title', resource.title);
        form.setValue('description', resource.description);
        form.setValue('hashtags', resource.hashtags.join(' '));
        form.setValue('documentTypeId', resource.documentType._id);
        form.setValue('subjectId', resource.subject._id);
        form.setValue('courseId', resource.course._id);
      }, 300);
    }
  }, [
    open,
    form,
    resource.title,
    resource.description,
    resource.hashtags,
    resource.documentType._id,
    resource.subject._id,
    resource.course._id,
  ]);

  const updateShownSubjects = useCallback(() => {
    if (subjects) {
      setShownSubjects(
        subjects
          .filter((subject) => subject.courseId === form.getValues('courseId'))
          .sort((a, b) => (a.name < b.name ? -1 : 1)),
      );
    }
  }, [form, subjects]);

  const handleCourseValueChange = (courseId: string) => {
    form.setValue('courseId', courseId);
    updateShownSubjects();
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

  useEffect(() => {
    updateShownSubjects();
  }, [subjects, updateShownSubjects]);

  const handleDeleteResource = () => {
    deleteResource(resource._id)
      .then(() => {
        toast({
          description: 'Resource deleted.',
        });
      })
      .catch(() => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'Resource could not be deleted.',
        });
      });
    refreshResources();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <i className='ph-bold ph-dots-three text-lg text-muted-foreground hover:text-primary transition-colors'></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <DialogTrigger asChild>
                <button className='flex justify-between w-full items-center'>
                  <span>Edit</span>
                  <i className='ph ph-pencil-simple'></i>
                </button>
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {visible ? (
                <button
                  onClick={hanldleUnlist}
                  className='flex justify-between w-full items-center'
                >
                  <span>Unlist</span>
                  <i className='ph ph-eye-slash'></i>
                </button>
              ) : (
                <button
                  onClick={hanldleMakeVisible}
                  className='flex justify-between w-full items-center'
                >
                  <span>List</span>
                  <i className='ph ph-eye'></i>
                </button>
              )}
            </DropdownMenuItem>
            {session.data?.user.isAdmin && (
              <DropdownMenuItem>
                {locked ? (
                  <button
                    onClick={hanldleUnlock}
                    className='flex justify-between w-full items-center'
                  >
                    <span>Unlock</span>
                    <i className='ph ph-lock-open'></i>
                  </button>
                ) : (
                  <button
                    onClick={hanldleLock}
                    className='flex justify-between w-full items-center'
                  >
                    <span>Lock</span>
                    <i className='ph ph-lock'></i>
                  </button>
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <button className='flex justify-between w-full items-center'>
                  <span>Delete</span>
                  <i className='ph ph-trash'></i>
                </button>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resource and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogContent className='max-w-[420px]'>
        {session.status === 'loading' ? (
          <Spinner />
        ) : session.status === 'authenticated' ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='w-full border-border border rounded-lg space-y-2'>
                  <CardHeader>
                    <div className='flex justify-between pb-2'>
                      <div className='flex space-x-2 items-center'>
                        {documentTypes !== null ? (
                          <FormField
                            control={form.control}
                            name='documentTypeId'
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className={`p-0 h-5 border-none items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 ${form.getValues('documentTypeId') === '' && 'bg-primary/60'}`}
                                    >
                                      <SelectValue placeholder='Type...' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className='max-h-40'>
                                    {documentTypes.map((type) => (
                                      <SelectItem
                                        key={type._id.toString()}
                                        value={type._id.toString()}
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
                        ) : (
                          <Spinner />
                        )}
                        <Badge variant={'secondary'} className='h-5'>
                          {resource.documentFormat}
                        </Badge>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <input
                              {...field}
                              className='font-semibold leading-none tracking-tight focus-visible:outline-none w-full bg-background'
                              placeholder='Title...'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {resource.description &&
                      resource.description.length > 0 && (
                        <FormField
                          control={form.control}
                          name='description'
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  {...field}
                                  className='text-sm text-muted-foreground focus-visible:outline-none w-full bg-background'
                                  placeholder='Description...'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    {resource.hashtags && resource.hashtags.length > 0 && (
                      <FormField
                        control={form.control}
                        name='hashtags'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <input
                                {...field}
                                className='text-sm text-muted-foreground focus-visible:outline-none w-full bg-background'
                                placeholder='Hashtags...'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardHeader>
                  <CardContent>
                    {subjects !== null && courses !== null ? (
                      <ul className='space-y-1 text-sm overflow-hidden'>
                        <li className='flex space-x-2'>
                          <i className='ph ph-chalkboard-teacher text-lg'></i>
                          <FormField
                            control={form.control}
                            name='subjectId'
                            render={({ field }) => (
                              <FormItem>
                                <Popover open={open1} onOpenChange={setOpen1}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        role='combobox'
                                        aria-expanded={open1}
                                        variant={'ghost'}
                                        className={`hover:bg-none px-0 py-0 focus-visible:ring-0 h-fit flex space-x-3 items-center whitespace-normal text-start font-semibold ${(field.value === '' || !shownSubjects.find((subject) => subject._id === field.value)) && 'text-muted-foreground hover:text-muted-foreground'}`}
                                        disabled={
                                          form.getValues('courseId') === ''
                                        }
                                      >
                                        <span>
                                          {field.value !== ''
                                            ? shownSubjects.find(
                                                (subject) =>
                                                  subject._id === field.value,
                                              )?.name ??
                                              'Please select a subject...'
                                            : 'Please select a subject...'}
                                        </span>
                                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent align='start' className='p-0'>
                                    <Command
                                      filter={(value, search) => {
                                        if (
                                          shownSubjects
                                            .find(
                                              (subject) =>
                                                subject._id === value,
                                            )
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
                                        <CommandEmpty>
                                          No subject found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {shownSubjects.map((subject) => (
                                            <CommandItem
                                              className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                                              key={subject._id.toString()}
                                              value={subject._id.toString()}
                                              onSelect={(currentValue) => {
                                                currentValue !== field.value &&
                                                  field.onChange(currentValue);
                                                setOpen1(false);
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
                        </li>
                        <li className='flex space-x-2 max-w-full text-muted-foreground'>
                          <i className='ph ph-graduation-cap text-lg'></i>
                          <FormField
                            control={form.control}
                            name='courseId'
                            render={({ field }) => (
                              <FormItem>
                                <Popover open={open2} onOpenChange={setOpen2}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        role='combobox'
                                        aria-expanded={open2}
                                        variant={'ghost'}
                                        className={`hover:bg-none px-0 py-0 focus-visible:ring-0 h-fit flex space-x-3 items-center whitespace-normal text-start font-normal ${field.value === '' && 'text-muted-foreground hover:text-muted-foreground'}`}
                                      >
                                        <span>
                                          {field.value !== ''
                                            ? courses.find(
                                                (course) =>
                                                  course._id === field.value,
                                              )?.name
                                            : 'Please select a course...'}
                                        </span>
                                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent align='start' className='p-0'>
                                    <Command
                                      filter={(value, search) => {
                                        if (
                                          courses
                                            .find(
                                              (course) => course._id === value,
                                            )
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
                                        <CommandEmpty>
                                          No course found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {courses.map((course) => (
                                            <CommandItem
                                              className='data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                                              key={course._id.toString()}
                                              value={course._id.toString()}
                                              onSelect={(currentValue) => {
                                                currentValue !== field.value &&
                                                  handleCourseValueChange(
                                                    currentValue,
                                                  );
                                                setOpen2(false);
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
                        </li>
                      </ul>
                    ) : (
                      <Spinner />
                    )}
                  </CardContent>
                </div>
                {error.length > 0 && (
                  <Alert variant='destructive' className='pt-4'>
                    <AlertTitle className='flex items-center space-x-1'>
                      <i className='ph ph-warning'></i>
                      <p>Error</p>
                    </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter className='flex flex-col pt-4 space-y-2 sm:space-y-0'>
                  <DialogClose asChild>
                    <Button variant={'secondary'}>Cancel</Button>
                  </DialogClose>
                  <Button type='submit' className='flex space-x-1'>
                    <i className='ph ph-pencil-simple'></i>
                    <span>Edit</span>
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <SignInCard message='You are not authorized to perform this action.' />
        )}
      </DialogContent>
    </Dialog>
  );
}

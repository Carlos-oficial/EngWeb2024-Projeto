'use client';

import { useState } from 'react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { submitResource } from '@/lib/data';
import { ResourceForm } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(15, { message: 'Title must be at least 15 characters' })
    .max(50, { message: 'Title must be at most 50 characters' }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(30, { message: 'Description must be at least 30 characters' })
    .max(100, { message: 'Description must be at most 100 characters' }),
  documentType: z.string({ required_error: 'Resource type is required' }), // é um ID
  hashtags: z.string().regex(new RegExp('^(#\\w+)?( #\\w+)*$'), {
    message: 'Hashtags must be separated by spaces and start with #',
  }),
  subjectId: z.string({ required_error: 'Subject is required' }), // é um ID
  courseId: z.string({ required_error: 'Course is required' }), // é um ID
  file: z.instanceof(FileList),
});

// TODO: Fetch courses, subjects and document types from the API

export default function ResourceDialog() {
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState<false | undefined>(undefined);
  const [documentTypes, setDocumentTypes] = useState<string[]>([
    'Teste',
    'Exame',
    'Ficha',
    'Apontamento',
    'Resolução',
  ]);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Licenciatura em Engenharia Informática' },
  ]);
  const [subjects, setSubjects] = useState<
    { id: string; courseId: string; name: string }[]
  >([{ id: '1', courseId: '1', name: 'Computação Gráfica' }]);
  const [postToFeed, setPostToFeed] = useState<boolean | 'indeterminate'>(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      documentType: '',
      hashtags: '',
      subjectId: '',
      courseId: '',
      file: undefined,
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    const data: ResourceForm = {
      ...values,
      documentFormat: values.file[0].name.split('.').pop()?.toUpperCase() ?? '',
      createdAt: new Date(),
      username: 'diogogmatos', // TODO: Get username from session
    };

    submitResource(data).catch((error: Error) => {
      setError(error.message);
      return;
    });

    // TODO: Post to feed

    setOpen(false);

    setTimeout(
      () =>
        toast({
          title: 'Resource submitted successfully!',
          description: 'Thank you for your contribution <3',
        }),
      500,
    );
  };

  const fileRef = form.register('file');

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button className='flex space-x-1'>
          <i className='ph ph-file-plus'></i>
          <p>Add Resource</p>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[calc(70vh)] overflow-y-scroll'>
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
              name='documentType'
              render={({ field }) => (
                <FormItem>
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
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
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
                    List of hashtags that describe the resource, separated by
                    spaces.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='courseId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
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
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subjectId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.getValues('courseId') === ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='max-h-40'>
                      {subjects.map((subject) => {
                        if (subject.courseId === form.getValues('courseId'))
                          return (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center space-x-2 pt-3'>
              <Checkbox
                id='post'
                onCheckedChange={setPostToFeed}
                checked={postToFeed}
              />
              <Label htmlFor='post'>Post on Feed</Label>
            </div>
            {error.length > 0 && (
              <Alert variant='destructive' className='pt-3'>
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
      </DialogContent>
    </Dialog>
  );
}

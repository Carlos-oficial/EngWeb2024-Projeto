import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Label } from './ui/label';

import { CourseDB, SubjectDB, DocumentTypeDB } from '@/lib/types';

import { listSubjects, listCourses, listDocumentTypes } from '@/lib/data';
import { useEffect, useState } from 'react';

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
  // filters
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeDB[]>([]);
  const [courses, setCourses] = useState<CourseDB[]>([]);
  const [subjects, setSubjects] = useState<SubjectDB[]>([]);
  const [shownSubjects, setShownSubjects] = useState<SubjectDB[]>([]);

  useEffect(() => {
    setShownSubjects(
      subjects
        .filter((subject) => subject.courseId === courseId)
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    );
  }, [subjects, courseId]);

  useEffect(() => {
    listDocumentTypes()
      .then((data) =>
        setDocumentTypes(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
      )
      .catch((error: Error) => console.error(error.message));
    listCourses()
      .then((data) =>
        setCourses(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
      )
      .catch((error: Error) => console.error(error.message));
    listSubjects()
      .then((data) =>
        setSubjects(data.sort((a, b) => (a.name < b.name ? -1 : 1))),
      )
      .catch((error: Error) => console.error(error.message));
  }, []);

  return (
    <div className='flex flex-col items-center space-y-2'>
      <h1 className='text-xl font-bold h-11 flex items-center'>Filters</h1>
      <div className='w-full space-y-2'>
        <Label htmlFor='types'>Resource Type</Label>
        <Select
          defaultValue={documentTypeId}
          onValueChange={setDocumentTypeId}
          id='types'
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type._id.toString()} value={type._id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='w-full space-y-2'>
        <Label htmlFor='courses'>Course</Label>
        <Select
          defaultValue={courseId}
          onValueChange={setCourseId}
          id='courses'
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            {courses.map((course) => (
              <SelectItem
                key={course._id.toString()}
                value={course._id.toString()}
              >
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='w-full space-y-2'>
        <Label htmlFor='subjects'>Subject</Label>
        <Select
          defaultValue={subjectId}
          onValueChange={setSubjectId}
          id='subjects'
          disabled={courseId === 'All'}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            {shownSubjects.map((subject) => (
              <SelectItem
                key={subject._id.toString()}
                value={subject._id.toString()}
              >
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

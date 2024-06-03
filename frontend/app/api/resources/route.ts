import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import * as SubjectController from '@/controllers/Subject';
import * as CourseController from '@/controllers/Course';
import { CourseDB, ResourceDB, ResourceDTO, ResourceForm, SubjectDB } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFile } from 'fs';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(req: NextApiRequest) {
  try {
    await connectMongo();
    const resources_db =
      ((await ResourceController.list({ ...req.query })) as ResourceDB[]) ?? [];

    // const subject_ids = Array.from(
    //   new Set(resources_db.map((resource) => resource.subjectId)),
    // ).sort();
    // const course_ids = Array.from(
    //   new Set(resources_db.map((resource) => resource.courseId)),
    // ).sort();
    // const subjects =
    //   ((await SubjectController.listIds(subject_ids)) as SubjectDB[]) ?? [];
    // console.log(subjects);
    // const courses =
    //   ((await CourseController.listIds(course_ids)) as CourseDB[]) ?? [];
    // console.log(courses);

    const resources: ResourceDTO[] = resources_db.map((resource) => {
      // const subject_name =
      //   subjects.find(
      //     (subject) => subject._id.toString() === resource.subjectId,
      //   )?.name ?? '';
      // const course_name =
      //   courses.find((course) => course._id.toString() === resource.courseId)
      //     ?.name ?? '';
      return {
        _id: resource._id.toString(),
        title: resource.title,
        description: resource.description,
        documentType: resource.documentType,
        documentFormat: resource.documentFormat,
        username: 'GAJO', // PLACEHOLDER
        hashtags: resource.hashtags.split(' '),
        subject: {
          _id: resource.subjectId,
          courseId: resource.courseId,
          name: 'subject_name',
        },
        course: {
          _id: resource.courseId,
          name: 'course_name',
        },
        createdAt: resource.createdAt,
      };
    });

    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

//make me a function to write to a local folder
//make me a function to write to a local folder
//make me a function to write to a local folder


export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    console.log(req);
    const form = (await req.json()) as ResourceForm;
    const resource: Partial<ResourceDB> = {
      title: form.title,
      description: form.description,
      documentType: form.documentType,
      documentFormat: form.documentFormat,
      hashtags: form.hashtags,
      subjectId: form.subjectId,
      courseId: form.courseId,
      createdAt: form.createdAt,
      file: form.file[0].name,
      userId: form.userId,
    };

    const fileBuffer = Buffer.from(await form.file[0].arrayBuffer());

    writeFile(`./public/resources/${form.file[0].name}`, fileBuffer , (err) => {
      if (err) {
        console.log(err);
      }
    })

    await ResourceController.create(resource);





    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

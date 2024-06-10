import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import * as SubjectController from '@/controllers/Subject';
import * as CourseController from '@/controllers/Course';
import * as UserController from '@/controllers/User';
import * as DocumentTypeController from '@/controllers/DocumentType';
import {
  CourseDB,
  DocumentTypeDB,
  ResourceDB,
  ResourceDTO,
  SubjectDB,
  UserDB,
} from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import fs from 'node:fs/promises';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const ids_sp = (req.nextUrl.searchParams.get('ids') as string) ?? '';
    const ids = ids_sp === '' ? null : ids_sp.split(',');

    const userEmail = req.nextUrl.searchParams.get('userEmail') ?? '';

    let resources_db: ResourceDB[] = [];
    if (ids) {
      resources_db =
        ((await ResourceController.listByIds(ids)) as ResourceDB[]) ?? [];
    } else if (userEmail) {
      resources_db =
        ((await ResourceController.listbyUser(userEmail)) as ResourceDB[]) ??
        [];
    } else {
      resources_db =
        ((await ResourceController.list({
          ...req.nextUrl.searchParams,
        })) as ResourceDB[]) ?? [];
    }

    // get unique subject, course ids, document type ids and user emails
    const subject_ids = Array.from(
      new Set(resources_db.map((resource) => resource.subjectId)),
    );
    const course_ids = Array.from(
      new Set(resources_db.map((resource) => resource.courseId)),
    );
    const user_emails = Array.from(
      new Set(resources_db.map((resource) => resource.userEmail)),
    );
    const document_type_ids = Array.from(
      new Set(resources_db.map((resource) => resource.documentTypeId)),
    );

    // get subjects, courses, document types and users
    const subjects =
      ((await SubjectController.listByIds(subject_ids)) as SubjectDB[]) ?? [];
    const courses =
      ((await CourseController.listByIds(course_ids)) as CourseDB[]) ?? [];
    const users =
      ((await UserController.listByEmails(user_emails)) as UserDB[]) ?? [];
    const document_types =
      ((await DocumentTypeController.listByIds(
        document_type_ids,
      )) as DocumentTypeDB[]) ?? [];

    const resources: ResourceDTO[] = resources_db.map((resource) => {
      const subject_name =
        subjects.find(
          (subject) =>
            new ObjectId(subject._id).toString() ===
            new ObjectId(resource.subjectId).toString(),
        )?.name ?? '';
      const course_name =
        courses.find(
          (course) =>
            new ObjectId(course._id).toString() ===
            new ObjectId(resource.courseId).toString(),
        )?.name ?? '';
      const user_name =
        users.find((user) => user.email === resource.userEmail)?.name ?? '';
      const document_type_name =
        document_types.find(
          (document_type) =>
            new ObjectId(document_type._id).toString() ===
            new ObjectId(resource.documentTypeId).toString(),
        )?.name ?? '';

      return {
        _id: resource._id.toString(),
        title: resource.title,
        description: resource.description,
        documentType: {
          _id: resource.documentTypeId,
          name: document_type_name,
        },
        documentFormat: resource.documentFormat,
        userEmail: resource.userEmail,
        userName: user_name,
        hashtags: resource.hashtags.split(' '),
        subject: {
          _id: resource.subjectId,
          courseId: resource.courseId,
          name: subject_name,
        },
        course: {
          _id: resource.courseId,
          name: course_name,
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

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const formData = await req.formData();

    // pop file from form data
    const file = formData.get('file') as File;
    formData.delete('file');

    // convert form data to object and save to db
    const resourceInfo = Object.fromEntries(
      formData.entries(),
    ) as Partial<ResourceDB>;
    const response = (await ResourceController.create(
      resourceInfo,
    )) as ResourceDB;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    // create directory if not exists
    await fs.mkdir(`./public/uploads/${response.userEmail}`, {
      recursive: true,
    });
    // write file to storage
    await fs.writeFile(
      `./public/uploads/${response.userEmail}/${response._id}.${file.name.split('.').pop()}`,
      buffer,
    );

    return NextResponse.json(resourceInfo);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

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
import type { NextApiRequest } from 'next';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(req: NextApiRequest) {
  try {
    await connectMongo();
    const resources_db =
      ((await ResourceController.list({ ...req.query })) as ResourceDB[]) ?? [];

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
    console.log('DOCUMENT TYPES', document_types);

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
        documentType: document_type_name,
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

    const body = (await req.json()) as Partial<ResourceDB>;

    await ResourceController.create(body);

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

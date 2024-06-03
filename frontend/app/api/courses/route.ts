import connectMongo from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import * as CourseController from '@/controllers/Course';
import { CourseDB } from '@/lib/types';
import { HttpStatusCode } from 'axios';

export async function GET() {
  try {
    await connectMongo();

    const courses = ((await CourseController.list()) as CourseDB[]) ?? [];

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

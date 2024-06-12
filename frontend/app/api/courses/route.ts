import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const body = (await req.json()) as Partial<CourseDB>;

    const response = (await CourseController.create(body)) as string;

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

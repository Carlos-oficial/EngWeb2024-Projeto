import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import * as SubjectController from '@/controllers/Subject';
import { SubjectDB } from '@/lib/types';
import { HttpStatusCode } from 'axios';

export async function GET() {
  try {
    await connectMongo();

    const subjects = ((await SubjectController.list()) as SubjectDB[]) ?? [];

    return NextResponse.json(subjects);
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

    const body = (await req.json()) as Partial<SubjectDB>;

    const response = (await SubjectController.create(body)) as string;

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

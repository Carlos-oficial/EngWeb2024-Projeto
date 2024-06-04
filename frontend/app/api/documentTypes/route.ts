import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import * as DocumentTypeController from '@/controllers/DocumentType';
import { DocumentTypeDB } from '@/lib/types';
import { HttpStatusCode } from 'axios';

export async function GET() {
  try {
    await connectMongo();

    const document_types =
      ((await DocumentTypeController.list()) as DocumentTypeDB[]) ?? [];

    return NextResponse.json(document_types);
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

    const body = (await req.json()) as Partial<DocumentTypeDB>;

    await DocumentTypeController.create(body);

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

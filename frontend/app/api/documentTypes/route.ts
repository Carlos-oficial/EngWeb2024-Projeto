import connectMongo from '@/lib/mongoose';
import { NextResponse } from 'next/server';
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

import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import * as CommentController from '@/controllers/Comment';
import { CommentDB } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { uemail: string } },
) {
  try {
    if (!params.uemail) {
      return NextResponse.json(
        { message: 'No user email provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    await connectMongo();

    const comment = (await CommentController.getUserComments(
      params.uemail,
    )) as CommentDB[];

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

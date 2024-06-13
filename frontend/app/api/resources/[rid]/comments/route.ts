import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import * as CommentController from '@/controllers/Comment';
import { CommentDB } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    if (!params.rid) {
      return NextResponse.json(
        { message: 'No resource id provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    await connectMongo();

    const comments = (await CommentController.getResourceComments(
      params.rid,
    )) as CommentDB[];

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

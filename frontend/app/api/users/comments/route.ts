import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import * as CommentController from '@/controllers/Comment';
import { CommentDB } from '@/lib/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ status: HttpStatusCode.Unauthorized });
    }

    await connectMongo();

    const body = (await req.json()) as Partial<CommentDB>;

    await CommentController.create(body);

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ status: HttpStatusCode.Unauthorized });
    }

    await connectMongo();

    const body = (await req.json()) as { commentId: string; message: string };
    const comment = (await CommentController.get(body.commentId)) as CommentDB;

    if (!comment) {
      return NextResponse.json(
        { message: 'Comment does not exist' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    // verify user is owner of comment
    if (session.user.email !== comment.userEmail) {
      return NextResponse.json({ status: HttpStatusCode.Unauthorized });
    }

    await CommentController.update(body.commentId, {
      message: body.message,
    } as Partial<CommentDB>);

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ status: HttpStatusCode.Unauthorized });
    }

    await connectMongo();

    const body = (await req.json()) as { commentId: string };
    const comment = (await CommentController.get(body.commentId)) as CommentDB;

    if (!comment) {
      return NextResponse.json(
        { message: 'Comment does not exist' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    // verify user is owner of comment
    if (session.user.email !== comment.userEmail) {
      return NextResponse.json({ status: HttpStatusCode.Unauthorized });
    }

    await CommentController.remove(body.commentId);

    return NextResponse.json(
      { message: 'Comment removed' },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

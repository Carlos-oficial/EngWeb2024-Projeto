import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import * as CommentController from '@/controllers/Comment';
import * as UserController from '@/controllers/User';
import { CommentDB, CommentDTO, UserDB } from '@/lib/types';

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

    const user_emails = Array.from(
      new Set(comments.map((comment) => comment.userEmail)),
    );
    const users =
      ((await UserController.listByEmails(user_emails)) as UserDB[]) ?? [];

    const commentsDTO = comments.map((comment) => {
      const user =
        (users.find((u) => u.email === comment.userEmail) as UserDB) ?? {};
      return {
        _id: comment._id,
        resourceId: comment.resourceId,
        userName: user.name,
        userEmail: comment.userEmail,
        userImage: user.image,
        message: comment.message,
        createdAt: comment.createdAt,
      } as CommentDTO;
    });

    return NextResponse.json(commentsDTO);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

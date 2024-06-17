import { authOptions } from '@/lib/authOptions';
import * as ResourceController from '@/controllers/Resource';
import connectMongo from '@/lib/mongoose';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { ResourceDB } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );

    const resource = (await ResourceController.get(params.rid)) as ResourceDB;

    if (!resource) {
      return NextResponse.json(
        { message: 'Resource not found.' },
        { status: HttpStatusCode.NotFound },
      );
    }

    if (resource.isLocked && !session?.user.isAdmin) {
      return NextResponse.json(
        {
          message:
            "You're not authorized to change this resource's visibility.",
        },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    if (session?.user.email === resource.userEmail || session?.user.isAdmin) {
      await ResourceController.setIsVisible(params.rid, false);
    } else {
      return NextResponse.json(
        { message: 'You must be an owner or admin to perform this task.' },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    return NextResponse.json({
      message: 'Resource visibility changed successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

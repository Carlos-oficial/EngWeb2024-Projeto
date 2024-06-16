import { setIsLocked } from '@/controllers/Resource';
import { authOptions } from '@/lib/authOptions';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );

    if (session?.user.isAdmin) {
      await setIsLocked(params.rid, true);
    } else {
      return NextResponse.json(
        { message: 'You must be an admin to perform this task.' },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    return NextResponse.json({
      message: 'Resource locked successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

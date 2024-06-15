import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { UserDB } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const ids_sp = (req.nextUrl.searchParams.get('ids') as string) ?? '';
    const ids = ids_sp === '' ? [] : ids_sp.split(',');

    const session = await getServerSession(authOptions);

    const user: Pick<UserDB, 'email' | 'isAdmin'> = {
      email: '',
      isAdmin: false,
    };
    if (session) {
      user.email = session.user.email;
      user.isAdmin = session.user.isAdmin;
    }

    const count = await ResourceController.countByIds(user, ids);

    return NextResponse.json(count);
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: HttpStatusCode.BadRequest,
      },
    );
  }
}

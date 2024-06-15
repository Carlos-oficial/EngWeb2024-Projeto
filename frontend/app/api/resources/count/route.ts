import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { UserDB } from '@/lib/types';

export async function GET() {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);

    const user: Pick<UserDB, 'email' | 'isAdmin'> = {
      email: '',
      isAdmin: false,
    };
    if (session) {
      user.email = session.user.email;
      user.isAdmin = session.user.isAdmin;
    }

    const count = await ResourceController.countAll(user);

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

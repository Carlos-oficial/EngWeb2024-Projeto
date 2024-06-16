import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { HttpStatusCode } from 'axios';
import { compare, hash } from 'bcrypt';
import * as UserController from '@/controllers/User';
import { UserDB } from '@/lib/types';
import connectMongo from '@/lib/mongoose';

export async function PUT(
  req: NextRequest,
  { params }: { params: { uemail: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    await connectMongo();

    const user = (await UserController.get(params.uemail)) as UserDB;

    if (!user) {
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.NotFound },
      );
    }

    if (session.user.email !== params.uemail) {
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    const body = (await req.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    console.log(body.currentPassword, body.newPassword);

    const isPasswordValid = await compare(body.currentPassword, user.password);

    console.log(isPasswordValid);

    if (!isPasswordValid) {
      console.log('Unauthorized');
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    const hashedPassword = await hash(body.newPassword, 10);

    await UserController.update(params.uemail, { password: hashedPassword });

    return NextResponse.json({ message: 'Password changed successfully.' });
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

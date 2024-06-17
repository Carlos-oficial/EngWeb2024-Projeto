import connectMongo from '@/lib/mongoose';
import * as UserController from '@/controllers/User';
import * as ResourceController from '@/controllers/Resource';
import { UserDB } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  req: NextRequest,
  { params }: { params: { uemail: string } },
) {
  try {
    await connectMongo();

    const user = (await UserController.get(params.uemail)) as UserDB;

    const safeUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      hasPassword: user.password !== '' && user.password !== undefined,
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

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

    const body = (await req.json()) as Partial<UserDB>;

    if (session.user.email !== params.uemail) {
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    const checkEmail = (await UserController.get(body.email ?? '')) as UserDB;

    if (checkEmail) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: HttpStatusCode.Conflict },
      );
    }

    await connectMongo();

    await UserController.update(params.uemail, body);

    if (body.email && body.email !== '' && params.uemail !== body.email) {
      await ResourceController.updateUserEmail(params.uemail, body.email);
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

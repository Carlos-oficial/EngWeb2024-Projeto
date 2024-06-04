import connectMongo from '@/lib/mongoose';
import { UserDB, UserSignUp } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import * as UserController from '@/controllers/User';
import { HttpStatusCode } from 'axios';
import { hash } from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const userInfo = (await req.json()) as UserSignUp;

    const possibleUser = (await UserController.get(userInfo.email)) as
      | UserDB
      | null
      | undefined;

    if (possibleUser)
      return NextResponse.json(
        { message: 'User already exists' },
        { status: HttpStatusCode.BadRequest },
      );

    const hashedPassword = await hash(userInfo.password, 10);

    await UserController.create({
      name: userInfo.firstName + ' ' + userInfo.lastName,
      email: userInfo.email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: 'Sign up successful',
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

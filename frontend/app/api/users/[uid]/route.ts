import connectMongo from '@/lib/mongoose';
import * as UserController from '@/controllers/User';
import { UserDB } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(req: NextApiRequest) {
  try {
    await connectMongo();
    const uid = req.url?.split('users/')[1]; // TODO: FITA COLAAAA
    const user = (await UserController.get(String(uid))) as UserDB;
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

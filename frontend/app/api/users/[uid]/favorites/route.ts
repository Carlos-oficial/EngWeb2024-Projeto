import connectMongo from '@/lib/mongoose';
import * as UserController from '@/controllers/User';
import { UserDB } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import Favorites from '@/models/Favorites';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(req: NextApiRequest) {
  try {
    await connectMongo();
    const  uid  = req.url?.split("users/")[1].split("/")[0] // TODO: FITA COLAAAA
    console.log({UID:uid});
    const favorites = (await UserController.getFavorites(uid ?? "SOME_GUY")) as Favorites;
    console.log({favorites:favorites});

    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

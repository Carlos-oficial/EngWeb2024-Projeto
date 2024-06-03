import connectMongo from '@/lib/mongoose';
import * as UserController from '@/controllers/User';
import * as ResourceController from '@/controllers/Resource';
import { UserDB } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from "next-auth/next"
import FavoritesPerResource from '@/models/FavoritesPerResource';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(req: NextApiRequest) {
  try {
    await connectMongo();
    const rid = req.url?.split('resources/')[1].split('/')[0]; // TODO: FITA COLAAAA
    if (!rid){
      return NextResponse.json(
        { message: "no user id provided" },
        { status: HttpStatusCode.BadRequest },
      );  
    }
    const favorites = (await ResourceController.getFavorites(
      rid,
    )) as FavoritesPerResource;
    
    return NextResponse.json(favorites?.users ?? []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

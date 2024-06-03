import connectMongo from '@/lib/mongoose';
import * as UserController from '@/controllers/User';
import * as ResourceController from '@/controllers/Resource';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import FavoritesPerUser from '@/models/FavoritesPerUser';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(req: NextApiRequest) {
  try {
    await connectMongo();
    const uemail = req.url?.split('users/')[1].split('/')[0]; // TODO: FITA COLAAAA
    if (!uemail) {
      return NextResponse.json(
        { message: 'no user id provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }
    const favorites = (await UserController.getFavorites(
      uemail,
    )) as FavoritesPerUser;
    return NextResponse.json(favorites?.resources ?? []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

type FavoriteDTO = {
  favorite: string;
  add: boolean;
};

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {
    await connectMongo();
    // const session = await getServerSession(req, res, authOptions)
    // console.log({session:JSON.stringify(session)})

    const uid = req.url?.split('users/')[1].split('/')[0]; // TODO: FITA COLAAAA
    if (!uid) {
      return NextResponse.json(
        { message: 'no user id provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const body = (await req.json()) as FavoriteDTO;
    console.log({ body: body });
    const favorite: string = body.favorite;
    const add: boolean = body.add;

    if (!ResourceController.get(favorite)) {
      return NextResponse.json(
        { message: 'favorite does not exist' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    if (add) {
      await UserController.addFavorite(uid, favorite);
    } else {
      await UserController.rmFavorite(uid, favorite);
    }

    const favorites = (await UserController.getFavorites(
      uemail,
    )) as FavoritesPerUser;
    return NextResponse.json(favorites?.resources ?? []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

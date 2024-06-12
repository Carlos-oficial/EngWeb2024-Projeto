import connectMongo from '@/lib/mongoose';
import * as UserController from '@/controllers/User';
import * as ResourceController from '@/controllers/Resource';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { FavoritePerUserDB } from '@/lib/types';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(
  req: NextRequest,
  { params }: { params: { uemail: string } },
) {
  try {
    await connectMongo();

    if (!params.uemail) {
      return NextResponse.json(
        { message: 'No user email provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const favorites = (await UserController.getFavorites(
      params.uemail,
    )) as FavoritePerUserDB;

    return NextResponse.json(favorites?.resourceIds ?? []);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { uemail: string } },
) {
  try {
    await connectMongo();

    if (!params.uemail) {
      return NextResponse.json(
        { message: 'No user email provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const body = (await req.json()) as { resourceId: string };
    const res: unknown = await ResourceController.get(body.resourceId);

    if (!res) {
      return NextResponse.json(
        { message: 'Resource does not exist' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    await UserController.addFavorite(params.uemail, body.resourceId);

    return NextResponse.json(
      { message: 'Favorite added' },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { uemail: string } },
) {
  try {
    await connectMongo();

    if (!params.uemail) {
      return NextResponse.json(
        { message: 'No user email provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const body = (await req.json()) as { resourceId: string };
    const res: unknown = await ResourceController.get(body.resourceId);

    if (!res) {
      return NextResponse.json(
        { message: 'Resource does not exist' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    await UserController.removeFavorite(params.uemail, body.resourceId);

    return NextResponse.json(
      { message: 'Favorite removed' },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

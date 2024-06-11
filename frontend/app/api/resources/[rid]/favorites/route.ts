import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { FavoritePerResourceDB } from '@/lib/types';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    await connectMongo();

    if (!params.rid) {
      return NextResponse.json(
        { message: 'No resource id provided' },
        { status: HttpStatusCode.BadRequest },
      );
    }
    const favorites = (await ResourceController.getFavorites(
      params.rid,
    )) as FavoritePerResourceDB;

    return NextResponse.json(favorites?.userEmails ?? []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

import connectMongo from '@/lib/connect_db';
import * as ResourceController from '@/controllers/Resource';
import { ResourceDB } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(params: { rid: string }) {
  try {
    await connectMongo();

    const resource = (await ResourceController.get(params.rid)) as ResourceDB;

    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function PUT(req: NextRequest, params: { rid: string }) {
  try {
    await connectMongo();

    const body = (await req.json()) as Partial<ResourceDB>;
    await ResourceController.update(params.rid, body);

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

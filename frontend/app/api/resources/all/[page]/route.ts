import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { ResourceDB } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';
import { dbsToDtos } from '@/lib/api_utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { page: number } },
) {
  try {
    await connectMongo();

    const resources =
      ((await ResourceController.listAll(params.page)) as ResourceDB[]) ?? [];

    const resourcesDTO = await dbsToDtos(resources);

    return NextResponse.json(resourcesDTO);
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: HttpStatusCode.BadRequest,
      },
    );
  }
}

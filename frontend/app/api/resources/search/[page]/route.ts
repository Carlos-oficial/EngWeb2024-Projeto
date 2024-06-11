import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { ResourceDTO } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { page: number } },
) {
  try {
    await connectMongo();

    const query = (req.nextUrl.searchParams.get('q') as string) ?? '';

    const resources =
      ((await ResourceController.search(
        query,
        params.page,
      )) as ResourceDTO[]) ?? [];

    return NextResponse.json(resources);
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

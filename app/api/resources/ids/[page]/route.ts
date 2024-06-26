import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { ResourceDB } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';
import { dbsToDtos } from '@/lib/api_utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  req: NextRequest,
  { params }: { params: { page: number } },
) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);

    const ids_sp = (req.nextUrl.searchParams.get('ids') as string) ?? '';
    const ids = ids_sp === '' ? [] : ids_sp.split(',');

    const resources =
      ((await ResourceController.listByIds(
        session?.user ?? { email: '', isAdmin: false },
        ids,
        params.page,
      )) as ResourceDB[]) ?? [];

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

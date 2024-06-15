import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextRequest, NextResponse } from 'next/server';
import { ResourceDB } from '@/lib/types';
import { HttpStatusCode } from 'axios';
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
    const resources = (await ResourceController.listPopular(
      session?.user ?? { email: "", isAdmin: false },
      params.page,
    )) as ResourceDB[];

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

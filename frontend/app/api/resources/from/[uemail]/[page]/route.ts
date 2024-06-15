import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextRequest, NextResponse } from 'next/server';
import { ResourceDB } from '@/lib/types';
import { HttpStatusCode } from 'axios';
import { dbsToDtos } from '@/lib/api_utils';
import { useSession } from 'next-auth/react';

export async function GET(
  req: NextRequest,
  { params }: { params: { uemail: string; page: number } },
) {
  try {
    await connectMongo();
    const session = useSession()
    const resources = (await ResourceController.listbyUser(
      session.data?.user ?? { email: "", isAdmin: false },
      params.uemail,
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

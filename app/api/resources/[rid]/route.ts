import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { ResourceDB } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import fs from 'node:fs/promises';
import { dbToDto } from '@/lib/api_utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    await connectMongo();

    const resource = (await ResourceController.get(params.rid)) as ResourceDB;

    const resourceDTO = await dbToDto(resource);

    return NextResponse.json(resourceDTO);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );

    const resource = (await ResourceController.get(params.rid)) as ResourceDB;

    if (!resource) {
      return NextResponse.json(
        { message: 'Resource not found.' },
        { status: HttpStatusCode.NotFound },
      );
    }

    const body = (await req.json()) as Partial<ResourceDB>;

    // verify user is owner of file
    if (
      session &&
      (session.user.email === body.userEmail || session.user.isAdmin)
    ) {
      await connectMongo();

      await ResourceController.update(params.rid, body);

      return NextResponse.json(body);
    } else {
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );

    await connectMongo();

    const resource = (await ResourceController.get(params.rid)) as ResourceDB;

    if (!resource) {
      return NextResponse.json(
        { message: 'Resource not found.' },
        { status: HttpStatusCode.NotFound },
      );
    }

    // verify user is owner of file
    if (
      session &&
      (session.user.email === resource.userEmail || session.user.isAdmin)
    ) {
      await ResourceController.remove(params.rid);

      const fileName = `${params.rid}.${resource.documentFormat.toLowerCase()}`;
      const filePath = `./public/uploads/${resource.userEmail}/${fileName}`;
      await fs.rm(filePath);

      return NextResponse.json(
        { message: 'Resource deleted' },
        { status: HttpStatusCode.Ok },
      );
    } else {
      return NextResponse.json(
        { message: '' },
        { status: HttpStatusCode.Unauthorized },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

import connectMongo from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { ResourceDB } from '@/lib/types';
import * as ResourceController from '@/controllers/Resource';
import { HttpStatusCode } from 'axios';
import fs from 'node:fs/promises';

export async function GET(
  req: NextRequest,
  { params }: { params: { rid: string } },
) {
  try {
    await connectMongo();

    const resource = (await ResourceController.get(params.rid)) as ResourceDB;
    const fileName = `${params.rid}.${resource.documentFormat.toLowerCase()}`;
    const filePath = `./public/uploads/${resource.userEmail}/${fileName}`;
    const file = await fs.readFile(filePath);
    await ResourceController.addDownload(params.rid);

    const response = new NextResponse(file);
    response.headers.set(
      'Content-Disposition',
      `attachment; filename=${fileName}`,
    );
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

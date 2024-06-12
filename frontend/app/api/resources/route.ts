import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { ResourceDB } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';
import fs from 'node:fs/promises';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const formData = await req.formData();

    // pop file from form data
    const file = formData.get('file') as File;
    formData.delete('file');

    // convert form data to object and save to db
    const resourceInfo = Object.fromEntries(
      formData.entries(),
    ) as Partial<ResourceDB>;
    const response = (await ResourceController.create(
      resourceInfo,
    )) as ResourceDB;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    // create directory if not exists
    await fs.mkdir(`./public/uploads/${response.userEmail}`, {
      recursive: true,
    });
    // write file to storage
    await fs.writeFile(
      `./public/uploads/${response.userEmail}/${response._id}.${file.name.split('.').pop()}`,
      buffer,
    );

    return NextResponse.json(resourceInfo);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

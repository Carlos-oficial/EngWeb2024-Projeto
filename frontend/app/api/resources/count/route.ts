import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

export async function GET() {
  try {
    await connectMongo();

    const count = await ResourceController.countAll();

    return NextResponse.json(count);
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

import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

export async function GET(
  req: NextRequest,
  { params }: { params: { uemail: string } },
) {
  try {
    await connectMongo();

    const count = await ResourceController.countByUser(params.uemail);

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

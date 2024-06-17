import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const query = (req.nextUrl.searchParams.get('q') as string) ?? '';

    const count = await ResourceController.countSearch(query);

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

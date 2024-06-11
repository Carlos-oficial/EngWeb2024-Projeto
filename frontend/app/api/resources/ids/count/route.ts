import { HttpStatusCode } from 'axios';
import connectMongo from '@/lib/mongoose';
import * as ResourceController from '@/controllers/Resource';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const ids_sp = (req.nextUrl.searchParams.get('ids') as string) ?? '';
    const ids = ids_sp === '' ? [] : ids_sp.split(',');

    const count = await ResourceController.countByIds(ids);

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

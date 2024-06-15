import { setIsLocked } from '@/controllers/Resource';
import { authOptions } from '@/lib/authOptions';
import { HttpStatusCode } from 'axios';
import { Http2ServerRequest } from 'http2';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest,
    { params }: { params: { rid: string } },
) {
    try {

        const session = await getServerSession(authOptions);
        if (session?.user.isAdmin) {
            setIsLocked(params.rid, true)    
    } else {
            return NextResponse.json(
                { message: "Not an admin user" },
                { status: HttpStatusCode.BadRequest })
        }
    } catch (error) {
        return NextResponse.json(
            { message: error as Error },
            { status: HttpStatusCode.BadRequest })
    } finally {
    return NextResponse.json(
      {message: "OK"},
      {status: HttpStatusCode.Ok}
    )
  }

} 

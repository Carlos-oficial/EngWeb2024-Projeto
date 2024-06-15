import { setIsLocked, setIsVisible } from '@/controllers/Resource';
import { authOptions } from '@/lib/authOptions';
import { getResource } from '@/lib/data';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest,
    { params }: { params: { rid: string } },
) {
    try {
        const session = await getServerSession(authOptions);
        const resource = await getResource(params.rid)
        if (resource.isLocked && !session?.user.isAdmin){
            return NextResponse.json(
                { message: "Can't change this resources visibility" },
                { status: HttpStatusCode.BadRequest })
        } 
        if (session?.user.email == resource.userEmail || session?.user.isAdmin) {
            setIsVisible(params.rid, false)
        } else {
            return NextResponse.json(
                { message: "Not the owner or an admin" },
                { status: HttpStatusCode.BadRequest })
        }
    } catch (error) {
        return NextResponse.json(
            { message: error as Error },
            { status: HttpStatusCode.BadRequest })
    }
} 

import connectMongo from '@/lib/mongoose';
import * as UserController from '@/controllers/User';
import { UserDB } from '@/lib/types';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { NextApiRequest } from 'next';
// import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextApiRequest) {
  try {
    await connectMongo();

    const uemail = req.url?.split('users/')[1] ?? ''; // TODO: FITA COLAAAA

    const user = (await UserController.get(uemail)) as UserDB;

    const safeUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json(
      { message: error as Error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

// export async function PUT(req: NextRequest) {
//   try {
//     await connectMongo();

//     const formData = await req.formData();

//     const body = (await req.json()) as { name: string; email: string };

//     const user = (await UserController.get(body.email)) as UserDB;
    
//     if (!user) {
//       return NextResponse.json(
//         { message: 'User does not exist' },
//         { status: HttpStatusCode.BadRequest },
//       );
//     }

//     await UserController.updateName(body.email, body.name);

//     return NextResponse.json(
//       { message: 'Name updated' },
//       { status: HttpStatusCode.Ok },
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: error as Error },
//       { status: HttpStatusCode.BadRequest },
//     );
//   }
// }

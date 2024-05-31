import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET({ params }: { params: { rid: string } }) {
  const resource = await fetch(`localhost:5000/resource/${params.rid}/file`);

  if (!resource.ok) {
    return NextResponse.json(
      { message: 'Resource not found!' },
      { status: 404 },
    );
  }

  return new NextResponse(resource.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${params.rid}.zip"`,
    },
  });
}

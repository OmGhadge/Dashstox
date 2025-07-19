import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';

const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n');

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: privateKey,
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function GET() {
  try {
    const ideas = await prisma.tradeIdea.findMany({
      orderBy: { createdAt: 'desc' },
      include: { comments: true },
    });

    const ideasWithCounts = ideas.map((idea) => ({
      ...idea,
      comments: idea.comments.length,
    }));

    return NextResponse.json(ideasWithCounts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trade ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.email || !session.user?.name) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tag = formData.get('tag') as string | undefined;
    const image = formData.get('image') as File | null;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = path.extname(image.name);
      const filename = `${uuidv4()}${ext}`;
      const file = bucket.file(filename);

      console.log(` Starting upload: ${filename}`);

      const stream = file.createWriteStream({
        resumable: false,
        contentType: image.type || 'application/octet-stream',
        metadata: {
          contentType: image.type,
        },
      });

      await new Promise<void>((resolve, reject) => {
        stream.on('error', (err) => {
          console.error(' Upload stream error:', err);
          reject(err);
        });

        stream.on('finish', () => {
          console.log('Upload finished');
          resolve();
        });

        stream.end(buffer);
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }

    const idea = await prisma.tradeIdea.create({
      data: {
        title,
        description,
        tag,
        imageUrl,
        author: session.user.name,
        authorImage: session.user.image ?? null,
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error(' Error creating trade idea:', error);
    return NextResponse.json({ error: 'Failed to create trade idea' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  const action = searchParams.get('action');

  if (!id || action !== 'like') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const existing = await prisma.tradeIdeaLike.findUnique({
      where: {
        userId_tradeIdeaId: {
          userId: session.user.email,
          tradeIdeaId: id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    await prisma.tradeIdeaLike.create({
      data: {
        userId: session.user.email,
        tradeIdeaId: id,
      },
    });

    const updated = await prisma.tradeIdea.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(' Error liking idea:', error);
    return NextResponse.json({ error: 'Failed to like idea' }, { status: 500 });
  }
}

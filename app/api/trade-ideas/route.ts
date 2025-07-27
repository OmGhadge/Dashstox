import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';


let storage: Storage | null = null;

try {

  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    console.log('Using GOOGLE_CREDENTIALS_JSON for authentication');
          try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
        
        console.log('Original private key length:', credentials.private_key?.length);
        console.log('Private key starts with:', credentials.private_key?.substring(0, 50));
        
        if (credentials.private_key) {
     
          credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
          console.log('Fixed private key length:', credentials.private_key.length);
          console.log('Fixed private key starts with:', credentials.private_key.substring(0, 50));
          
    
          if (!credentials.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
            console.error('Private key format is invalid');
            throw new Error('Invalid private key format');
          }
        }
      
      storage = new Storage({
        projectId: credentials.project_id,
        credentials: credentials,
      });
      console.log('Storage initialized with GOOGLE_CREDENTIALS_JSON');
    } catch (credentialError) {
      console.error('Error parsing GOOGLE_CREDENTIALS_JSON:', credentialError);
      throw credentialError;
    }
  } 
  
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('Using GOOGLE_APPLICATION_CREDENTIALS for authentication');
    storage = new Storage();
    console.log('Storage initialized with GOOGLE_APPLICATION_CREDENTIALS');
  }
  else {
    throw new Error('No Google Cloud credentials configured');
  }
} catch (error) {
  console.error('Error initializing Google Cloud Storage:', error);
  storage = null;
}

const bucket = storage ? storage.bucket(process.env.GCS_BUCKET_NAME!) : null;
if (bucket) {
  console.log('Bucket initialized:', process.env.GCS_BUCKET_NAME);
} else {
  console.error('Failed to initialize bucket. Storage:', !!storage, 'Bucket name:', process.env.GCS_BUCKET_NAME);
}

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
      if (!storage || !bucket) {
        console.error('Storage or bucket not configured');
        return NextResponse.json(
          { error: 'File upload service not configured' },
          { status: 500 }
        );
      }

      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const ext = path.extname(image.name);
        const filename = `${uuidv4()}${ext}`;
        const file = bucket.file(filename);

        console.log(`Starting upload: ${filename}, size: ${buffer.length} bytes`);

       
        await file.save(buffer, {
          contentType: image.type || 'application/octet-stream',
          metadata: {
            contentType: image.type,
          },
        });

        console.log('Upload finished successfully');

        imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        console.log('Image URL generated:', imageUrl);
      } catch (uploadError) {
        console.error('Error during file upload:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
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

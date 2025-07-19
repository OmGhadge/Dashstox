import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// ✅ GET /api/trade-ideas/[id]
export async function GET(
  request: NextRequest,
context: { params: Promise<{ id: string }>} // No need to await context.params – the error is misleading
) {
  try {
    const params=await context.params;
    const id = Number(await params.id);

    const idea = await prisma.tradeIdea.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json({ error: 'Failed to fetch trade idea' }, { status: 500 });
  }
}

// ✅ POST /api/trade-ideas/[id]
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }>} 
) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const params=await context.params;
    const id = Number(await params.id);
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        author: session.user.name || 'Anonymous',
        authorImage: session.user.image || '',
        tradeIdeaId: id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}

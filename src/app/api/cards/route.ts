import { NextRequest, NextResponse } from 'next/server';
import { Container } from '@/infrastructure/di/container';
import { DomainError, ValidationError } from '@/core/errors/domain.error';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 500;

    const cards = await Container.getCardsUseCase.execute(limit);
    const stats = Container.calculateStatsUseCase.execute(cards);
    const videos = Container.filterCardsUseCase.getDistinctVideos(cards);

    return NextResponse.json({
      success: true,
      data: {
        cards,
        stats,
        videos,
      },
    });
  } catch (error) {
    console.error('API [GET /api/cards] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi khi tải danh sách thẻ học',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await Container.createCardUseCase.execute(body);

    return NextResponse.json(
      {
        success: true,
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API [POST /api/cards] Error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    if (error instanceof DomainError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 422 });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Không thể tạo thẻ mới',
      },
      { status: 500 }
    );
  }
}

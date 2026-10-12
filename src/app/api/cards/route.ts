import { NextRequest, NextResponse } from 'next/server';
import { cardService } from '@/lib/services/card-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 500;

    const cards = await cardService.getAllCards(limit);
    const stats = cardService.calculateStats(cards);
    const videos = cardService.getDistinctVideos(cards);

    return NextResponse.json({
      success: true,
      data: {
        cards,
        stats,
        videos,
      },
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
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
    const created = await cardService.createCard(body);

    return NextResponse.json(
      {
        success: true,
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Không thể tạo thẻ mới',
      },
      { status: 400 }
    );
  }
}

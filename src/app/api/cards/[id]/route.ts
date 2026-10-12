import { NextRequest, NextResponse } from 'next/server';
import { cardService } from '@/lib/services/card-service';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const card = await cardService.getCardById(id);

    if (!card) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy thẻ' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await cardService.updateCard(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy thẻ để cập nhật' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi khi cập nhật thẻ' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await cardService.deleteCard(id);

    return NextResponse.json({ success: true, message: 'Đã xóa thẻ thành công' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi khi xóa thẻ' },
      { status: 500 }
    );
  }
}

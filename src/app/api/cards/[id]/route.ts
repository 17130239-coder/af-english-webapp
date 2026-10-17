import { NextRequest, NextResponse } from 'next/server';
import { Container } from '@/infrastructure/di/container';
import { CardNotFoundError, ValidationError, DomainError } from '@/core/errors/domain.error';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const card = await Container.getCardByIdUseCase.execute(id);

    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    if (error instanceof CardNotFoundError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu JSON yêu cầu không hợp lệ' },
        { status: 400 }
      );
    }

    // Check if it's a toggle favorite request or general update
    if (body.isFavorite !== undefined && Object.keys(body).length === 1) {
      const updated = await Container.toggleFavoriteUseCase.execute(id, Boolean(body.isFavorite));
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = await Container.updateCardUseCase.execute(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof CardNotFoundError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 422 });
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi khi cập nhật thẻ' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await Container.deleteCardUseCase.execute(id);

    return NextResponse.json({ success: true, message: 'Đã xóa thẻ thành công' });
  } catch (error) {
    if (error instanceof CardNotFoundError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi khi xóa thẻ' },
      { status: 500 }
    );
  }
}

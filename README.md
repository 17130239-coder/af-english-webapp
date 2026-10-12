# 📚 AF English WebApp

Trang web ứng dụng Next.js trực quan hóa, tra cứu và luyện tập flashcard từ vựng tiếng Anh được thu thập thông minh từ tiện ích **AF English Extension** (`af-english`) qua phụ đề YouTube.

Dự án đã được tái cấu trúc hoàn chỉnh theo các nguyên lý **Clean Architecture**, **SOLID principles**, và **Clean Code**.

---

## 🏛️ Kiến Trúc Mã Nguồn (Clean Architecture)

Hệ thống được tổ chức thành 4 phân tầng độc lập theo chuẩn Clean Architecture:

```
src/
├── core/                                   # [Domain & Application Core Layer]
│   ├── entities/                           # Domain Entities & Value Objects (Hoàn toàn độc lập với UI/DB)
│   │   ├── card.entity.ts                  # SubtitleCard, CardExample, CardStats, CardStatus
│   │   └── filter.entity.ts                # CardFilterState, LayoutMode, ThemeMode
│   ├── dtos/                               # Data Transfer Objects
│   │   └── card.dto.ts                     # CreateCardDTO, UpdateCardDTO
│   ├── errors/                             # Domain Errors
│   │   └── domain.error.ts                 # DomainError, ValidationError, CardNotFoundError, DatabaseError
│   ├── repositories/                       # Port Interfaces (Inversion of Control)
│   │   └── card.repository.interface.ts    # ICardRepository
│   └── use-cases/                          # Application Business Rules (Single Responsibility Use Cases)
│       ├── get-cards.use-case.ts           # GetCardsUseCase
│       ├── get-card-by-id.use-case.ts      # GetCardByIdUseCase
│       ├── create-card.use-case.ts         # CreateCardUseCase
│       ├── update-card.use-case.ts         # UpdateCardUseCase
│       ├── delete-card.use-case.ts         # DeleteCardUseCase
│       ├── toggle-favorite.use-case.ts     # ToggleFavoriteUseCase
│       ├── calculate-stats.use-case.ts     # CalculateStatsUseCase (Pure calculation)
│       └── filter-cards.use-case.ts        # FilterCardsUseCase (Pure filtering & sorting)
│
├── infrastructure/                         # [Infrastructure / Data Layer]
│   ├── config/                             # Cấu hình môi trường
│   │   └── env.config.ts                   # Validated environment config & fallbacks
│   ├── database/                           # Kết nối & Chuyển đổi dữ liệu
│   │   ├── neon.client.ts                  # Neon Serverless Postgres Client
│   │   └── card.mapper.ts                  # CardMapper (Chuyển đổi Raw DB Row <-> Domain Entity)
│   ├── repositories/                       # Implementation của ICardRepository
│   │   └── neon-card.repository.ts         # NeonCardRepository
│   ├── services/                           # Adapters cho dịch vụ bên ngoài
│   │   └── speech-synthesis.service.ts     # SpeechSynthesisService (Web Speech API)
│   └── di/                                 # Dependency Injection Composition Root
│       └── container.ts                    # Container nối Use Cases với Repositories
│
├── presentation/                           # [Presentation Layer]
│   ├── hooks/                              # Custom React Hooks tách biệt hoàn toàn state & logic
│   │   ├── useCards.ts                     # Quản lý dữ liệu thẻ, mutations, optimistic updates
│   │   ├── useCardFilters.ts               # Quản lý bộ lọc, tìm kiếm, lưu layoutMode vào storage
│   │   ├── useFlashcards.ts                # Quản lý học flashcard, lật thẻ, phím tắt
│   │   └── useSpeech.ts                    # Quản lý phát âm giọng nói Web Speech API
│   ├── components/                         # UI Components
│   │   ├── ui/                             # Button, Input, Modal, Badge, Toast
│   │   ├── layout/                         # Header (Theme switch, actions), Footer
│   │   ├── stats/                          # StatsSummary (5 metrics thẻ học)
│   │   ├── filters/                        # FilterBar (Tìm kiếm, video selector, tabs, sort, layout switch)
│   │   ├── cards/                          # CardItem (Grid / Tape / Compact), CardGrid, Skeletons, Modals
│   │   └── study/                          # FlashcardModal (Active recall & Spaced Repetition)
│   └── utils/
│       └── formatters.ts                   # Parse timestamp YouTube, highlight từ vựng, format thời gian
│
└── app/                                    # [Transport / Next.js App Router]
    ├── api/cards/
    │   ├── route.ts                        # GET (list & stats), POST (create)
    │   └── [id]/route.ts                   # GET (detail), PATCH (update & favorite), DELETE
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

---

## ✨ Điểm Nổi Bật Về Coding Standard & Clean Code

1. **Tuân thủ Clean Architecture**:
   - Tầng Core Domain không phụ thuộc vào Next.js, React hay Database.
   - Các Use Case tuân theo nguyên lý **Single Responsibility Principle (SRP)**.
   - Dependency Inversion Principle: `ICardRepository` làm cổng giao tiếp, `NeonCardRepository` là adapter cụ thể được inject qua `Container`.
2. **Quản lý State tinh gọn**:
   - Toàn bộ logic thao tác dữ liệu được gói gọn trong hook `useCards` và `useCardFilters`.
   - `page.tsx` chỉ đóng vai trò trình diễn giao diện, cực kỳ ngắn gọn, dễ đọc và dễ bảo trì.
3. **Giao diện người dùng tối giản & hiện đại (Simple & Clean UI)**:
   - Hỗ trợ 3 chế độ xem: **Lưới (Grid)**, **Danh sách (Tape)**, và **Thu gọn (Compact)**.
   - Hỗ trợ đầy đủ **Dark / Light mode** mượt mà.
   - Thao tác nhanh với phím tắt: `⌘K` tìm kiếm, `Space` lật thẻ Flashcard, `A/D` hoặc mũi tên để chuyển thẻ.
4. **Đồng bộ trực tiếp Cloud**:
   - Kết nối tới Neon Postgres Cloud của AF Extension qua kết nối serverless bảo mật.

---

## 🚀 Khởi Chạy Cục Bộ

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Tạo file `.env.local`:
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_yXc2iSbMx1IK@ep-super-cake-az82uvk1-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

3. Khởi chạy dev server:
   ```bash
   npm run dev
   ```

4. Kiểm tra lint & build:
   ```bash
   npm run lint
   npm run build
   ```

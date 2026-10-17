# 📚 AF English WebApp

> Ứng dụng web học từ vựng tiếng Anh thông minh qua phụ đề YouTube, đồng bộ dữ liệu thời gian thực với **Neon Serverless Postgres** từ tiện ích mở rộng **AF Extension**.
> 
> Được xây dựng với **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** và thiết kế theo nguyên lý **Clean Architecture**, **SOLID** và phong cách giao diện **Editorial Reader** tinh tế.

[![Production Deployment](https://img.shields.io/badge/Production-Live-success?style=flat&logo=vercel)](https://af-english-webapp.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![Neon Database](https://img.shields.io/badge/Neon-Serverless_Postgres-00E599?style=flat&logo=postgresql)](https://neon.tech)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌐 Đường Dẫn Trực Tiếp & Mã Nguồn

- **Website Production**: [https://af-english-webapp.vercel.app](https://af-english-webapp.vercel.app)
- **GitHub Repository**: [https://github.com/17130239-coder/af-english-webapp](https://github.com/17130239-coder/af-english-webapp)

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

```mermaid
mindmap
  root((AF English WebApp))
    Frontend Framework
      Next.js 16 App Router
      React 19 Server & Client Components
      TypeScript 5
    Giao diện & Trải nghiệm
      Tailwind CSS v4
      Vanilla CSS Custom Properties Design Tokens
      Dark / Light Mode useSyncExternalStore
      Lucide React Icons
    Cơ sở dữ liệu & Backend
      Neon Serverless Postgres
      HTTPS /sql Serverless REST API
      Next.js API Route Handlers
    Audio & Học tập
      Web Speech Synthesis API
      Chế độ Flashcard Active Recall
      Spaced Repetition System
      YouTube Timestamp Parsing
    Kiến trúc & Tiêu chuẩn
      Clean Architecture 4 Layers
      SOLID Principles
      Dependency Injection Container
      Repository Pattern
```

| Phân tầng | Công nghệ | Mục đích sử dụng |
|---|---|---|
| **Core Framework** | **Next.js 16 (Turbopack)** | Fullstack App Router, Route Handlers, tối ưu hóa prerendering static/dynamic |
| **UI Library** | **React 19** | Client components tương tác mượt mà, hooks quản lý vòng đời dữ liệu |
| **Ngôn ngữ** | **TypeScript 5** | Định kiểu tĩnh chặt chẽ cho toàn bộ Domain Entities, DTOs và Repositories |
| **Styling** | **Tailwind CSS v4** + CSS Variables | Hệ thống Design Tokens tối giản, hỗ trợ Dark / Light mode tự nhiên |
| **Cơ sở dữ liệu** | **Neon Serverless Postgres** | Lưu trữ đám mây, kết nối HTTP serverless không cần TCP connection pooler |
| **Database Client** | `@neondatabase/serverless` | Truy vấn cơ sở dữ liệu tốc độ cao qua HTTPS connection string |
| **Phát âm chuẩn** | **Browser Web Speech API** | Tổng hợp giọng đọc tiếng Anh bản xứ ở 2 tốc độ (`1.0x` chuẩn và `0.75x` chậm) |
| **Biểu tượng** | **Lucide React** | Bộ icon thanh mảnh, hiện đại, tối ưu dung lượng bundle |
| **Triển khai & CI/CD** | **Vercel** + **GitHub** | Tự động hóa build, deploy production toàn cầu trên mạng Edge CDN |

---

## 🏛️ Sơ Đồ Kiến Trúc Tổng Thể Hệ Thống (System Architecture)

Sơ đồ mô tả luồng tương tác giữa **AF Extension**, cơ sở dữ liệu **Neon Cloud**, và ứng dụng **Next.js WebApp**:

```mermaid
flowchart TB
    subgraph ClientSources["1. Nguồn Dữ Liệu Học Tập"]
        YT["YouTube Video (Phụ đề phát sóng)"]
        EXT["AF English Extension (Manifest V3)"]
        WEB_ADD["Thêm thủ công trên WebApp"]
    end

    subgraph DatabaseLayer["2. Neon Serverless Postgres Cloud"]
        NEON[("Neon Postgres DB\n(subtitles table)")]
    end

    subgraph NextServer["3. Next.js Server Layer"]
        API_GET["GET /api/cards\n(Danh sách thẻ & thống kê)"]
        API_POST["POST /api/cards\n(Thêm câu mới)"]
        API_PATCH["PATCH /api/cards/:id\n(Cập nhật & Yêu thích)"]
        API_DEL["DELETE /api/cards/:id\n(Xóa câu)"]
    end

    subgraph WebAppUI["4. AF English WebApp (Presentation Layer)"]
        UI_MAIN["Trang chủ (Reader / Notebook Mode)"]
        UI_MODES["3 Chế độ: Grid / List / Compact"]
        UI_STUDY["Chế độ học Flashcard (Phím Space / Arrow)"]
        UI_AUDIO["Audio TTS 1.0x & 0.75x (Web Speech API)"]
    end

    YT -->|"Click copy phụ đề & AI dịch"| EXT
    EXT -->|"Lưu trực tiếp qua HTTPS /sql"| NEON
    WEB_ADD -->|"Gọi POST API"| API_POST
    API_POST --> NEON

    NEON -->|"Truy vấn SQL"| API_GET
    API_PATCH --> NEON
    API_DEL --> NEON

    API_GET --> UI_MAIN
    UI_MAIN --> UI_MODES
    UI_MAIN --> UI_STUDY
    UI_MAIN --> UI_AUDIO
```

---

## 📐 Sơ Đồ Chi Tiết Clean Architecture (4-Layer Pattern)

Dự án áp dụng chặt chẽ mô hình **Clean Architecture**, phân chia ranh giới rõ ràng giữa logic nghiệp vụ (Core Domain) và các công nghệ bên ngoài (Infrastructure / UI).

```mermaid
graph TD
    subgraph Layer4["Layer 4: External / Transport & Framework"]
        APP_ROUTER["Next.js App Router (app/page.tsx, layout.tsx)"]
        API_ROUTES["Route Handlers (app/api/cards/...)"]
        NEON_API["Neon Cloud Postgres HTTPS API"]
        BROWSER_SPEECH["Browser SpeechSynthesis Engine"]
    end

    subgraph Layer3["Layer 3: Presentation Layer"]
        CUSTOM_HOOKS["Custom Hooks:\n• useCards (state & mutation)\n• useCardFilters (tìm kiếm & lọc)\n• useFlashcards (học từ vựng)\n• useSpeech (phát âm bản xứ)"]
        COMPONENTS["Components:\n• Header & Footer\n• FilterBar & StatsSummary\n• CardGrid & CardItem\n• FlashcardModal\n• AddCardModal & CardDetailModal"]
    end

    subgraph Layer2["Layer 2: Infrastructure Layer"]
        DI["Dependency Injection Container (container.ts)"]
        REPO_IMPL["NeonCardRepository (neon-card.repository.ts)"]
        MAPPER["CardMapper (card.mapper.ts)"]
        SPEECH_SVC["SpeechSynthesisService"]
        DB_CLIENT["Neon Client (neon.client.ts)"]
    end

    subgraph Layer1["Layer 1: Core Domain & Use Cases (Hoàn toàn độc lập)"]
        USE_CASES["Use Cases (Single Responsibility):\n• GetCardsUseCase\n• GetCardByIdUseCase\n• CreateCardUseCase\n• UpdateCardUseCase\n• DeleteCardUseCase\n• ToggleFavoriteUseCase\n• CalculateStatsUseCase\n• FilterCardsUseCase"]
        INTERFACES["Repository Interfaces (Ports):\n• ICardRepository"]
        ENTITIES["Domain Entities & Value Objects:\n• SubtitleCard\n• CardExample\n• CardStats\n• CardFilterState\n• Domain Errors (ValidationError, etc.)"]
    end

    %% Dependency flow follows inward direction
    APP_ROUTER --> CUSTOM_HOOKS
    CUSTOM_HOOKS --> COMPONENTS
    API_ROUTES --> DI
    DI --> USE_CASES
    DI --> REPO_IMPL
    REPO_IMPL --> INTERFACES
    REPO_IMPL --> MAPPER
    REPO_IMPL --> DB_CLIENT
    DB_CLIENT --> NEON_API
    SPEECH_SVC --> BROWSER_SPEECH

    USE_CASES --> INTERFACES
    USE_CASES --> ENTITIES
```

### Chi tiết các phân tầng trong mã nguồn:

```
src/
├── core/                                   # [TẦNG 1: CORE DOMAIN]
│   ├── entities/                           # Chứa Entities thuần túy, không phụ thuộc thư viện ngoài
│   │   ├── card.entity.ts                  # SubtitleCard, CardExample, CardStats, CardStatus
│   │   └── filter.entity.ts                # CardFilterState, LayoutMode, ThemeMode
│   ├── dtos/                               # Data Transfer Objects xác thực dữ liệu đầu vào/ra
│   │   └── card.dto.ts                     # CreateCardDTO, UpdateCardDTO
│   ├── errors/                             # Lỗi nghiệp vụ có định danh rõ ràng
│   │   └── domain.error.ts                 # DomainError, ValidationError, CardNotFoundError, DatabaseError
│   ├── repositories/                       # Cổng giao tiếp (Port Interface) đảo ngược phụ thuộc
│   │   └── card.repository.interface.ts    # ICardRepository
│   └── use-cases/                          # Các ca sử dụng nghiệp vụ (Mỗi Use Case làm 1 việc duy nhất)
│       ├── get-cards.use-case.ts           # Lấy danh sách thẻ
│       ├── get-card-by-id.use-case.ts      # Lấy chi tiết thẻ theo ID
│       ├── create-card.use-case.ts         # Kiểm tra tính hợp lệ & tạo thẻ mới
│       ├── update-card.use-case.ts         # Cập nhật nội dung thẻ
│       ├── delete-card.use-case.ts         # Xóa thẻ khỏi hệ thống
│       ├── toggle-favorite.use-case.ts     # Đánh dấu / Bỏ yêu thích
│       ├── calculate-stats.use-case.ts     # Tính toán tổng số, đã dịch, chờ dịch, số video
│       └── filter-cards.use-case.ts        # Lọc theo từ khóa, video, trạng thái & sắp xếp
│
├── infrastructure/                         # [TẦNG 2: INFRASTRUCTURE & ADAPTERS]
│   ├── config/                             # Đọc biến môi trường an toàn
│   │   └── env.config.ts                   # DATABASE_URL fallback & config
│   ├── database/                           # Kết nối và ánh xạ thực thể
│   │   ├── neon.client.ts                  # Neon Serverless Postgres Client
│   │   └── card.mapper.ts                  # Chuyển đổi Raw DB Row <-> SubtitleCard Entity
│   ├── repositories/                       # Cài đặt cụ thể của ICardRepository
│   │   └── neon-card.repository.ts         # NeonCardRepository
│   ├── services/                           # Adapters cho Web API bên ngoài
│   │   └── speech-synthesis.service.ts     # SpeechSynthesisService (Web Speech API)
│   └── di/                                 # Dependency Injection Composition Root
│       └── container.ts                    # Container đóng gói Use Cases và Repositories
│
├── presentation/                           # [TẦNG 3: PRESENTATION & STATE LOGIC]
│   ├── hooks/                              # Custom React Hooks đóng gói trạng thái
│   │   ├── useCards.ts                     # Fetching, optimistic update, mutation, xuất JSON
│   │   ├── useCardFilters.ts               # Quản lý tìm kiếm, lọc video, sort, lưu layout vào localStorage
│   │   ├── useFlashcards.ts                # Quản lý vòng lặp thẻ học Flashcard, phím tắt
│   │   └── useSpeech.ts                    # Trạng thái phát âm âm thanh (đang đọc, tốc độ)
│   ├── components/                         # UI Components cấu trúc mô-đun
│   │   ├── ui/                             # Button, Input, Modal, Badge, Toast
│   │   ├── layout/                         # Header, Footer
│   │   ├── stats/                          # StatsSummary (4 metrics số liệu)
│   │   ├── filters/                        # FilterBar (Tìm kiếm, dropdown video, sort, layout switches)
│   │   ├── cards/                          # CardItem, CardGrid, CardSkeleton, AddCardModal, CardDetailModal
│   │   └── study/                          # FlashcardModal (Active Recall)
│   └── utils/                              # Tiện ích định dạng hiển thị
│       └── formatters.ts                   # Parse YouTube timestamp (&t=...s), highlight từ vựng
│
└── app/                                    # [TẦNG 4: TRANSPORT / NEXT.JS APP ROUTER]
    ├── api/cards/                          # RESTful API Endpoints
    │   ├── route.ts                        # GET (danh sách + stats), POST (tạo mới)
    │   └── [id]/route.ts                   # GET (chi tiết), PATCH (cập nhật), DELETE (xóa)
    ├── layout.tsx                          # Layout gốc, thiết lập Theme và Font chữ
    ├── page.tsx                            # Page View cực kỳ ngắn gọn, sạch sẽ
    └── globals.css                         # Design tokens và theme variables
```

---

## 🔄 Sơ Đồ Luồng Hoạt Động (Data Flow Sequences)

### 1. Luồng Tải Dữ Liệu & Tìm Kiếm / Lọc (Read & Filter Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as Page & FilterBar
    participant Hooks as useCards & useCardFilters
    participant API as Route Handler (/api/cards)
    participant Core as GetCardsUseCase & FilterUseCase
    participant DB as Neon Postgres

    User->>UI: Truy cập ứng dụng
    UI->>Hooks: Khởi tạo dữ liệu
    Hooks->>API: GET /api/cards
    API->>Core: getCardsUseCase.execute()
    Core->>DB: SELECT * FROM subtitles ORDER BY timestamp DESC
    DB-->>Core: Trả về danh sách rows
    Core-->>API: SubtitleCard[] entities
    API-->>Hooks: JSON response { cards, stats, videos }
    Hooks-->>UI: Cập nhật State & Render CardGrid

    User->>UI: Nhập từ khóa tìm kiếm hoặc đổi Filter
    UI->>Hooks: updateFilters({ searchQuery: 'coffee' })
    Hooks->>Core: filterCardsUseCase.execute(cards, filters)
    Core-->>Hooks: Trả về filteredCards (thuần túy không cần gọi lại DB)
    Hooks-->>UI: Cập nhật danh sách hiển thị tức thì (<1ms)
```

### 2. Luồng Đánh Dấu Yêu Thích Với Optimistic UI (Fast Mutation Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Card as CardItem UI
    participant Hook as useCards Hook
    participant API as Route Handler (/api/cards/:id)
    participant Core as ToggleFavoriteUseCase
    participant DB as Neon Postgres

    User->>Card: Nhấp nút Star (⭐)
    Card->>Hook: toggleFavorite(id, true)
    Hook->>Card: [Optimistic UI] Cập nhật ngay icon vàng sáng
    Hook->>API: PATCH /api/cards/:id { isFavorite: true }
    API->>Core: toggleFavoriteUseCase.execute(id, true)
    Core->>DB: UPDATE subtitles SET is_favorite = true WHERE id = id
    
    alt Cập nhật thành công
        DB-->>Core: Row updated
        Core-->>API: SubtitleCard entity
        API-->>Hook: 200 OK
        Hook->>User: Hiện thông báo Toast "Đã thêm vào yêu thích"
    else Lỗi kết nối
        DB-->>Core: Error
        Core-->>API: 500 Error
        API-->>Hook: Error Response
        Hook->>Card: [Rollback] Trả lại trạng thái cũ
        Hook->>User: Hiện Toast "Lỗi khi cập nhật trạng thái"
    end
```

### 3. Luồng Luyện Tập Flashcard (Active Recall Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Modal as FlashcardModal
    participant Hook as useFlashcards
    participant Audio as SpeechSynthesisService

    User->>Modal: Nhấn "Luyện Flashcard"
    Modal->>Hook: Nạp danh sách thẻ
    Hook-->>Modal: Hiển thị Mặt Trước (Câu tiếng Anh + Cụm từ)

    User->>Modal: Bấm nút "Phát âm" (hoặc tự động)
    Modal->>Audio: speak(card.text, rate: 1.0)
    Audio-->>User: Phát giọng đọc bản xứ qua loa

    User->>Modal: Bấm phím cách (Space) hoặc nhấp vào thẻ
    Modal->>Hook: toggleFlip()
    Hook-->>Modal: Lật thẻ sang Mặt Sau (Bản dịch, Giải thích ngữ pháp, Ví dụ)

    User->>Modal: Bấm phím mũi tên phải (→)
    Modal->>Hook: nextCard()
    Hook-->>Modal: Chuyển sang thẻ tiếp theo & cập nhật thanh tiến độ (Progress bar)
```

---

## 🗄️ Cấu Trúc Bảng Cơ Sở Dữ Liệu (Database Schema)

Cơ sở dữ liệu được lưu trữ trên **Neon Serverless Postgres** với cấu trúc bảng `subtitles`:

```mermaid
erDiagram
    SUBTITLES {
        VARCHAR_100 id PK "Mã định danh duy nhất (sub_...)"
        TEXT text "Nội dung câu tiếng Anh gốc"
        TEXT video_title "Tiêu đề video YouTube nguồn"
        TEXT url "Đường link video kèm timestamp (?t=...s)"
        BIGINT timestamp "Thời điểm lưu trữ (epoch millisecond)"
        TEXT key_phrase "Cụm từ hoặc thành ngữ trọng tâm"
        TEXT phrase_translation "Bản dịch nghĩa của cụm từ"
        TEXT translation "Bản dịch toàn bộ câu sang tiếng Việt"
        TEXT explanation "Giải thích cấu trúc ngữ pháp và ngữ cảnh"
        TEXT synonyms "Mảng từ đồng nghĩa lưu dạng JSON / CSV"
        JSONB examples "Mảng ví dụ đa ngữ cảnh (Giao tiếp, Đời sống...)"
        TEXT example_sentence "Câu ví dụ thực tế chính"
        TEXT example_translation "Bản dịch câu ví dụ chính"
        BOOLEAN is_favorite "Đánh dấu câu yêu thích"
        VARCHAR_50 status "Trạng thái (translated / pending)"
        TIMESTAMPTZ created_at "Thời gian tạo bản ghi"
        TIMESTAMPTZ updated_at "Thời gian cập nhật gần nhất"
    }
```

```sql
-- DDL tạo bảng subtitles trên Neon Postgres
CREATE TABLE IF NOT EXISTS subtitles (
  id VARCHAR(100) PRIMARY KEY,
  text TEXT NOT NULL,
  video_title TEXT,
  url TEXT,
  timestamp BIGINT,
  key_phrase TEXT,
  phrase_translation TEXT,
  translation TEXT,
  explanation TEXT,
  synonyms TEXT,
  examples JSONB,
  example_sentence TEXT,
  example_translation TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục tối ưu tốc độ truy vấn
CREATE INDEX IF NOT EXISTS idx_subtitles_timestamp ON subtitles (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_subtitles_favorite ON subtitles (is_favorite);
```

---

## ✨ Điểm Nổi Bật Về Giao Diện & Trải Nghiệm (Non-AI Editorial UI)

Khác với các giao diện dạng AI template thông thường (nhiều màu neon, bảng điều khiển dày đặc widget, badge sặc sỡ), **AF English WebApp** được chế tác thủ công theo phong cách **Editorial Notebook**:

1. **Kiểu chữ & Nghệ thuật đọc (Typography First)**:
   - Font chữ chuẩn hiển thị văn bản học thuật **Plus Jakarta Sans** kết hợp font mã nguồn **JetBrains Mono**.
   - Cụm từ trọng tâm (*Key Phrase*) được tô sáng tinh tế theo hiệu ứng bút dạ nhớ dòng trên giấy (`Paper Highlighter`), không gây chói mắt.
   - Bản dịch tiếng Việt xuất hiện tự nhiên bên dưới câu tiếng Anh như một dòng chú thích nhẹ nhàng.
2. **3 Chế độ xem linh hoạt**:
   - **Lưới (Grid Mode)**: Hiển thị dạng thẻ ghi chép độc lập, đầy đủ ví dụ và ghi chú khi cần mở rộng.
   - **Danh sách đọc (List / Tape Mode)**: Cuộn đọc liên tục mượt mà, tối ưu khi ôn luyện lướt qua hàng chục câu.
   - **Bảng thu gọn (Compact Mode)**: Định dạng hàng siêu gọn, thích hợp cho việc kiểm tra nhanh và tra cứu.
3. **Phát âm chuẩn xác (Native Audio TTS)**:
   - Tích hợp công cụ phát âm Web Speech API cho từng câu, từng cụm từ và từng ví dụ minh họa.
   - Hỗ trợ 2 chế độ tốc độ: **1.0x** (tốc độ tự nhiên) và **0.75x** (tốc độ chậm để luyện nghe từng âm).
4. **Nhảy trực tiếp đến vị trí video trên YouTube**:
   - Tự động nhận diện tham số thời gian (`?t=728s`), hiển thị nhãn thời gian nổi bật (ví dụ: `▶ 12:08`).
   - Nhấp vào là video YouTube tự động phát đúng giây nhân vật trong video nói câu đó.
5. **Hệ thống phím tắt nhanh**:
   - `⌘K` hoặc `Ctrl+K`: Tiêu điểm nhanh vào thanh tìm kiếm.
   - `Space`: Lật mặt thẻ trong chế độ Flashcard.
   - `←` / `→`: Chuyển lùi / tiến câu trong phiên học Flashcard.
   - `Esc`: Đóng nhanh các cửa sổ Modal.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Getting Started)

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản `18.18+` hoặc `20.x+`
- **npm** hoặc **pnpm** / **yarn**

### 2. Cài đặt các gói phụ thuộc
```bash
cd af-english-webapp
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` tại thư mục gốc của dự án:
```env
# Kết nối Neon Postgres (Lấy từ project Neon Cloud của bạn)
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-your-database.neon.tech/neondb?sslmode=require
```

### 4. Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt tại địa chỉ: [http://localhost:3000](http://localhost:3000)

### 5. Kiểm tra chất lượng mã nguồn & Kiểm thử (Testing)
```bash
# Chạy bộ kiểm thử tự động Unit Tests (Vitest - 33 tests)
npm test

# Kiểm tra linting tiêu chuẩn
npm run lint

# Tạo bản build tối ưu hóa cho môi trường production
npm run build

# Khởi chạy bản production build cục bộ
npm run start
```

---

## 🚢 Hướng Dẫn Triển Khai (Deployment)

Dự án được cấu hình sẵn sàng triển khai 1-click lên nền tảng **Vercel**:

```bash
# Đăng nhập Vercel CLI (nếu chưa đăng nhập)
npx vercel login

# Triển khai trực tiếp lên môi trường Production
npx vercel deploy --prod --yes
```

> **Lưu ý trên Vercel Dashboard**:
> Thêm biến môi trường `DATABASE_URL` trong phần **Project Settings > Environment Variables** để đảm bảo ứng dụng kết nối thông suốt tới Neon Postgres Cloud.

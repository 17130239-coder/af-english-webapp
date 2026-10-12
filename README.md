# 📚 AF English WebApp

Trang web ứng dụng Next.js trực quan hóa, tra cứu và luyện tập flashcard từ vựng tiếng Anh được thu thập thông minh từ tiện ích **AF English Extension** (`af-english`) qua phụ đề YouTube.

---

## ✨ Điểm Nổi Bật

- **Đồng bộ thời gian thực với Neon Postgres Cloud**: Kết nối trực tiếp tới cơ sở dữ liệu serverless Neon, tải toàn bộ thẻ từ vựng đã lưu trên YouTube.
- **Thiết kế tối giản & Hiện đại (Clean & Simple UI)**:
  - Giao diện trực quan, nhẹ nhàng, tối ưu khả năng đọc.
  - Phân loại rõ ràng: Câu tiếng Anh gốc, cụm từ trọng tâm (*Key Phrase*), bản dịch tiếng Việt, từ đồng nghĩa (*Synonyms*), giải thích ngữ pháp, và các ví dụ minh họa theo ngữ cảnh (*Giao tiếp, Công việc, Đời sống*).
- **Phát âm chuẩn bản xứ (Audio TTS)**:
  - Tích hợp Web Speech API chất lượng cao để nghe phát âm ngay tức thì cho từng câu, từng cụm từ và ví dụ.
- **Nhảy trực tiếp đến vị trí video trên YouTube**:
  - Tự động nhận diện và phân tích tham số thời gian (`&t=...s`), hiển thị nhãn thời gian nổi bật (ví dụ: `12:27`) giúp mở ngay video YouTube tại đúng giây nói câu đó.
- **Chế độ học Flashcard (Spaced Repetition & Active Recall)**:
  - Luyện tập ghi nhớ từ vựng với giao diện thẻ lật tập trung, hỗ trợ phím tắt `Space` để lật mặt sau, mũi tên `Trái/Phải` để chuyển thẻ, tính năng xáo trộn (shuffle) và đánh dấu sao.
- **Tìm kiếm & Bộ lọc nhanh**:
  - Tìm kiếm toàn văn (cả tiếng Anh, tiếng Việt, cụm từ và tên video).
  - Lọc theo trạng thái: *Tất cả*, *Yêu thích ⭐*, *Đã dịch AI*, *Chưa dịch*.
  - Lọc theo từng Video nguồn.
  - Sắp xếp: *Mới nhất*, *Cũ nhất*, *A → Z*.
- **Xuất & Sao lưu dữ liệu**:
  - Hỗ trợ xuất toàn bộ dữ liệu ra định dạng chuẩn JSON để lưu trữ hoặc nhập vào các công cụ học tập như Anki, Notion.

---

## 🏛️ Kiến Trúc Mã Nguồn (Clean Architecture)

Dự án tuân theo tiêu chuẩn **Clean Architecture** và nguyên lý phân tách trách nhiệm (Separation of Concerns):

```
af-english-webapp/
├── src/
│   ├── types/                     # [Domain Layer] Entity & Value Objects
│   │   ├── card.ts                # SubtitleCard, CardExample, DTOs
│   │   └── filter.ts              # CardFilterState, SortOrder
│   ├── lib/
│   │   ├── config.ts              # Cấu hình môi trường & hằng số hệ thống
│   │   ├── db/
│   │   │   └── neon.ts            # Kết nối Neon Serverless Database Client
│   │   ├── repositories/          # [Data Layer] Trừu tượng hóa truy cập dữ liệu
│   │   │   ├── card-repository.interface.ts # Interface ICardRepository
│   │   │   └── neon-card-repository.ts     # Triển khai repository truy vấn Neon Postgres
│   │   ├── services/              # [Application / Use Case Layer]
│   │   │   └── card-service.ts    # Logic lọc, thống kê, phân loại và thao tác thẻ
│   │   └── utils/                 # Tiện ích chung
│   │       ├── formatters.ts      # Parse timestamp YouTube, highlight từ vựng
│   │       └── speech.ts          # Web Speech Synthesis API
│   ├── components/                # [Presentation Layer] UI Components
│   │   ├── ui/                    # Base components: Button, Input, Modal, Badge, Toast
│   │   ├── layout/                # Header, Footer
│   │   ├── stats/                 # Thống kê tổng quan số liệu
│   │   ├── filters/               # Thanh tìm kiếm & bộ lọc
│   │   ├── cards/                 # CardItem, CardGrid, Skeletons, Add & Edit Modals
│   │   └── study/                 # Flashcard Study Mode
│   └── app/                       # Next.js App Router
│       ├── api/cards/             # RESTful API endpoints
│       │   ├── route.ts           # GET all cards, POST create card
│       │   └── [id]/route.ts      # PATCH update/favorite, DELETE card
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
```

---

## 🚀 Khởi Chạy Cục Bộ

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Tạo file `.env.local` (nếu chưa có):
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_yXc2iSbMx1IK@ep-super-cake-az82uvk1-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

3. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   ```

4. Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

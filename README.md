# 🎵 Discord Lyric Status

Hiển thị **lời bài hát đang phát trên Spotify theo thời gian thực** làm Custom Status Discord của bạn.

- Không cần Spotify API, không cần Premium: đọc bài hát đang phát qua **Windows System Media Transport Controls (SMTC)**.
- Lời bài hát đồng bộ (synced lyrics) lấy từ [LRCLIB](https://lrclib.net) – miễn phí, không cần API key.
- Có thể đóng gói thành một file `.exe` duy nhất, người dùng chỉ cần bấm đúp để chạy (không cần cài Node.js).
- Giao diện thiết lập lần đầu chạy ngay trên trình duyệt.

> ⚠️ **Cảnh báo quan trọng:** Dự án dùng **User Token** của tài khoản Discord để đổi status. Việc dùng user token cho tự động hoá bị coi là *self-botting* và **vi phạm Điều khoản Dịch vụ của Discord**, tài khoản có thể bị khoá. Bạn tự chịu rủi ro khi sử dụng. Xem phần [Bảo mật & lưu ý](#-bảo-mật--lưu-ý).

---

## ✨ Tính năng

- Cập nhật status theo từng dòng lyric đúng thời điểm (dùng `setTimeout`, mỗi dòng chỉ cập nhật một lần).
- Tự phát hiện **tua bài (seek)**, **đổi bài**, **tạm dừng / dừng phát** và đồng bộ lại.
- Không có lyric đồng bộ → hiển thị `🎵 Tên bài — Nghệ sĩ`.
- Hàng đợi request có xử lý **rate limit (429)**: không bỏ sót dòng lyric nào.
- Tự mở lại trang thiết lập khi token hết hạn.
- Cache lyric trong bộ nhớ để không gọi LRCLIB lặp lại.

## 📋 Yêu cầu

- **Windows 10/11** (SMTC và PowerShell chỉ có trên Windows).
- Spotify Desktop (hoặc bất kỳ trình phát nào hỗ trợ SMTC; ưu tiên phiên Spotify).
- [Node.js](https://nodejs.org) **18+** (chỉ cần nếu chạy từ mã nguồn hoặc tự build).

## 🚀 Cài đặt & chạy

### Cách 1: Dùng file `.exe` (khuyên dùng)

1. Tải `discord-lyrics-status.exe` ở mục **Releases**.
2. Bấm đúp để chạy.
3. Lần đầu, trình duyệt sẽ mở trang thiết lập → dán Discord User Token → **Lưu và khởi động**.
4. Mở Spotify và phát nhạc. Xong!

### Cách 2: Chạy từ mã nguồn

```bash
git clone https://github.com/Izaelzx/discord-lyric-status.git
cd discord-lyric-status
npm install
npm start
```

Chế độ dev (tự khởi động lại khi sửa code):

```bash
npm run dev
```

## 🔑 Lấy Discord User Token

1. Mở `discord.com/app` trên trình duyệt và đăng nhập.
2. Nhấn `F12` → tab **Network**.
3. Thực hiện một thao tác bất kỳ (ví dụ đổi server).
4. Chọn một request bất kỳ → **Request Headers** → copy giá trị của `Authorization`.

Token có thể được cung cấp bằng một trong hai cách (theo thứ tự ưu tiên):

| Cách | Mô tả |
|------|-------|
| Biến môi trường | `DISCORD_USER_TOKEN` (hỗ trợ file `.env` qua `dotenv`) |
| File cấu hình | `%APPDATA%\discord-lyrics-status\config.json` (do trang thiết lập tự tạo) |

Ví dụ `.env`:

```env
DISCORD_USER_TOKEN=your_token_here
```

## 🛠️ Tham số dòng lệnh

| Cờ | Tác dụng |
|----|----------|
| `--reset` | Xoá token đã lưu và mở lại trang thiết lập |

```bash
npm start -- --reset
# hoặc với bản exe
discord-lyrics-status.exe --reset
```

## 📦 Build file `.exe`

```bash
npm install
npm run build
```

Quy trình: **esbuild** (ESM → CJS bundle) → **@yao-pkg/pkg** (đóng gói thành exe, target `node18-win-x64`).

Kết quả: `dist/discord-lyrics-status.exe`

## 🗂️ Cấu trúc dự án

```
├── build.mjs          # Script build: esbuild + pkg
├── package.json
├── package-lock.json
├── LICENSE
├── .gitignore
└── src/
    ├── index.js       # Entry point, vòng lặp poll, xử lý đổi bài / seek
    ├── spotify.js     # Đọc bài đang phát qua Windows SMTC (PowerShell)
    ├── lyrics.js      # Lấy & parse lyric LRC từ LRCLIB (+ cache)
    ├── scheduler.js   # Lên lịch đổi dòng lyric bằng setTimeout
    ├── status.js      # Hàng đợi cập nhật Discord Custom Status, xử lý 429/401
    ├── config.js      # Lưu/đọc token trong %APPDATA%
    └── setup.js       # Server cục bộ + trang web nhập token
```

## ⚙️ Cách hoạt động

1. Mỗi **1 giây**, app chạy PowerShell để đọc phiên media hiện tại (tên bài, nghệ sĩ, vị trí phát).
2. Khi đổi bài, app tìm lyric đồng bộ trên LRCLIB theo tên bài + nghệ sĩ + album + thời lượng.
3. `LyricScheduler` đặt hẹn giờ cho từng dòng; tới giờ thì gọi `setCustomStatus`.
4. Nếu vị trí phát lệch quá 3 giây so với dự kiến → coi là tua bài và lên lịch lại.
5. Khi tạm dừng/dừng, status được xoá.

## 🔒 Bảo mật & lưu ý

- Token được lưu **dạng văn bản thường** trong `%APPDATA%\discord-lyrics-status\config.json`. **Không bao giờ** chia sẻ file này hay commit token lên Git.
- Trang thiết lập chỉ chạy trên `127.0.0.1` với cổng ngẫu nhiên; token chỉ được gửi tới Discord để xác thực.
- Dùng user token tự động hoá **có thể dẫn đến khoá tài khoản**. Dự án mang tính học tập/cá nhân, hãy cân nhắc trước khi dùng cho tài khoản quan trọng.
- Dự án không liên kết với Discord, Spotify hay LRCLIB.

## ❓ Xử lý sự cố

| Vấn đề | Cách xử lý |
|--------|------------|
| Status không đổi | Kiểm tra Spotify đang phát và bài có lyric đồng bộ trên LRCLIB |
| Báo token hết hạn | Chạy lại với `--reset` hoặc nhập token mới trên trang thiết lập |
| Không đọc được bài hát | Đảm bảo đang dùng Windows và Spotify Desktop (không phải trình duyệt bị chặn media session) |
| Status trễ vài giây | Do giới hạn tốc độ (rate limit) của Discord; app sẽ tự xếp hàng và thử lại |

## 📄 Giấy phép

[MIT](./LICENSE) © Iza

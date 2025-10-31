# Setup Guide สำหรับ Wedding RSVP API

## วิธีการ Setup API กับ Vercel และ Supabase

### 1. สร้าง Database Table ใน Supabase

1. ไปที่ [Supabase Dashboard](https://app.supabase.com)
2. เลือกโปรเจกต์ของคุณ
3. ไปที่ **SQL Editor**
4. สร้าง table ด้วย SQL นี้:

```sql
CREATE TABLE rsvp (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guests INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- สร้าง index สำหรับการค้นหา
CREATE INDEX idx_rsvp_submitted_at ON rsvp(submitted_at DESC);
CREATE INDEX idx_rsvp_attending ON rsvp(attending);
```

### 2. ตั้งค่า Environment Variables ใน Vercel

1. ไปที่ [Vercel Dashboard](https://vercel.com)
2. เลือกโปรเจกต์ของคุณ
3. ไปที่ **Settings** > **Environment Variables**
4. เพิ่ม environment variables ต่อไปนี้:

**⚠️ สำคัญ:** ตรวจสอบให้แน่ใจว่า:
- ไม่มี space หรือ newline ตอนท้าย URL/Key
- URL ต้องเริ่มด้วย `https://` (ไม่ใช่ `http://`)
- คัดลอก value โดยไม่ให้มี space หรือ newline

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**วิธีหา Supabase Credentials:**
- ไปที่ Supabase Dashboard > Settings > API
- **SUPABASE_URL**: คัดลอก `Project URL` (ตัวอย่าง: `https://wvypmxbcxgmgmykacycp.supabase.co`)
  - ⚠️ ต้องคัดลอกให้ครบถ้วน รวม `https://` ด้วย
  - ⚠️ ตรวจสอบว่าไม่มี space ตอนท้าย
- **SUPABASE_ANON_KEY**: คัดลอก `anon` `public` key (key ที่ยาวๆ เริ่มต้นด้วย `eyJ...`)
  - ⚠️ คัดลอกทั้งหมด ตรวจสอบว่าไม่มี space ตอนท้าย

**ตรวจสอบความถูกต้อง:**
- URL ควรเป็น: `https://xxxxxxxxxxxxx.supabase.co`
- Key ควรเป็น: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (ยาวมาก)
- ไม่ควรมี space หรือ newline ตอนท้ายทั้งสองค่า

### 3. Install Dependencies

```bash
npm install
```

### 4. Deploy ไปที่ Vercel

```bash
# Install Vercel CLI (ถ้ายังไม่มี)
npm install -g vercel

# Deploy
vercel

# หรือ deploy production
vercel --prod
```

### 5. ตรวจสอบการทำงาน

1. เปิดหน้า `register.html`
2. กรอกข้อมูลและส่ง form
3. ตรวจสอบใน Supabase Dashboard > Table Editor > `rsvp` table ว่ามีข้อมูลเข้า

## Troubleshooting

### API ไม่ทำงาน
- ตรวจสอบว่า environment variables ถูกตั้งค่าใน Vercel แล้ว
- ตรวจสอบ Console logs ใน Vercel Dashboard > Functions > `api/rsvp.js`

### Database Error
- ตรวจสอบว่า table `rsvp` ถูกสร้างแล้ว
- ตรวจสอบว่า Supabase credentials ถูกต้อง

### CORS Error
- ตรวจสอบว่า `vercel.json` มี CORS headers ที่ถูกต้อง

## ไฟล์ที่สำคัญ

- `api/rsvp.js` - Vercel serverless function สำหรับรับ RSVP submissions
- `package.json` - Dependencies (Supabase client)
- `vercel.json` - Vercel configuration
- `register.html` - Frontend form ที่เรียกใช้ API

## Schema ของ Database

```sql
rsvp
├── id (BIGSERIAL PRIMARY KEY)
├── name (TEXT NOT NULL)
├── attending (BOOLEAN NOT NULL)
├── guests (INTEGER DEFAULT 0)
├── submitted_at (TIMESTAMPTZ DEFAULT NOW())
└── created_at (TIMESTAMPTZ DEFAULT NOW())
```

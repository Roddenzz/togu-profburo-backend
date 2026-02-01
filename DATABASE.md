# Database Schema Documentation

## Обзор

База данных построена на PostgreSQL 16+ с использованием Prisma ORM для type-safe взаимодействия. Схема спроектирована для высокой производительности, масштабируемости и целостности данных.

---

## Prisma Schema

### Полная схема (schema.prisma)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum UserRole {
  STUDENT
  ADMIN
}

enum ApplicationStatus {
  DRAFT           // Черновик
  SUBMITTED       // Подана
  UNDER_REVIEW    // На рассмотрении
  ADDITIONAL_INFO // Требуется доп. информация
  APPROVED        // Одобрена
  REJECTED        // Отклонена
  COMPLETED       // Выплачена
}

enum ApplicationReason {
  LOW_INCOME              // Низкий доход семьи
  MEDICAL                 // Медицинские показания
  EMERGENCY               // Чрезвычайная ситуация
  ORPHAN                  // Сирота
  DISABILITY              // Инвалидность
  LARGE_FAMILY            // Многодетная семья
  SINGLE_PARENT           // Неполная семья
  ACADEMIC_EXCELLENCE     // Академические успехи
  OTHER                   // Другое
}

enum ApplicationHistoryAction {
  CREATED
  SUBMITTED
  STATUS_CHANGED
  DOCUMENT_UPLOADED
  COMMENT_ADDED
  REVIEWED
  APPROVED
  REJECTED
}

enum ChatConversationStatus {
  ACTIVE
  CLOSED
}

// ============================================
// MODELS
// ============================================

model User {
  id              String   @id @default(uuid())
  
  // Authentication
  studentId       String?  @unique // Номер студенческого билета
  email           String   @unique
  phone           String?
  
  // Personal Information
  firstName       String
  lastName        String
  middleName      String?
  
  // Academic Information
  faculty         String   // Факультет
  department      String   // Кафедра
  course          Int      // Курс (1-6)
  group           String?  // Группа
  
  // Role
  role            UserRole @default(STUDENT)
  
  // Status
  isActive        Boolean  @default(true)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  lastLoginAt     DateTime?
  
  // Relations
  applications           Application[]        @relation("UserApplications")
  reviewedApplications   Application[]        @relation("ReviewedApplications")
  applicationHistory     ApplicationHistory[]
  sentMessages           ChatMessage[]        @relation("SenderMessages")
  studentConversations   ChatConversation[]   @relation("StudentConversations")
  adminConversations     ChatConversation[]   @relation("AdminConversations")
  news                   News[]
  
  @@index([email])
  @@index([studentId])
  @@index([role])
  @@map("users")
}

model Application {
  id                    String              @id @default(uuid())
  
  // Application Number
  applicationNumber     String              @unique // e.g., "2024-001"
  
  // User
  userId                String
  user                  User                @relation("UserApplications", fields: [userId], references: [id], onDelete: Cascade)
  
  // Status
  status                ApplicationStatus   @default(DRAFT)
  
  // Application Details
  reason                ApplicationReason
  description           String              @db.Text
  amount                Decimal             @db.Decimal(10, 2) // Запрашиваемая сумма
  
  // Form Data (JSON для гибкости)
  formData              Json?               // Все данные из формы в структурированном виде
  
  // PDF
  pdfUrl                String?             // Ссылка на сгенерированный PDF
  
  // Review
  reviewedBy            String?
  reviewer              User?               @relation("ReviewedApplications", fields: [reviewedBy], references: [id], onDelete: SetNull)
  reviewedAt            DateTime?
  reviewComment         String?             @db.Text
  
  // Approval
  approvedAmount        Decimal?            @db.Decimal(10, 2) // Одобренная сумма (может отличаться)
  
  // Timestamps
  submittedAt           DateTime?
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  
  // Relations
  documents             ApplicationDocument[]
  history               ApplicationHistory[]
  
  @@index([userId])
  @@index([status])
  @@index([applicationNumber])
  @@index([submittedAt])
  @@index([createdAt])
  @@map("applications")
}

model ApplicationDocument {
  id              String      @id @default(uuid())
  
  // Application
  applicationId   String
  application     Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  
  // File Info
  fileName        String
  fileUrl         String      // S3/MinIO URL
  fileType        String      // MIME type
  fileSize        Int         // Bytes
  
  // Metadata
  uploadedAt      DateTime    @default(now())
  
  @@index([applicationId])
  @@map("application_documents")
}

model ApplicationHistory {
  id              String                    @id @default(uuid())
  
  // Application
  applicationId   String
  application     Application               @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  
  // User who performed action
  userId          String
  user            User                      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Action
  action          ApplicationHistoryAction
  
  // Details
  comment         String?                   @db.Text
  metadata        Json?                     // Дополнительные данные (старый статус, новый статус и т.д.)
  
  // Timestamp
  createdAt       DateTime                  @default(now())
  
  @@index([applicationId])
  @@index([userId])
  @@index([createdAt])
  @@map("application_history")
}

model ChatConversation {
  id              String                  @id @default(uuid())
  
  // Participants
  studentId       String
  student         User                    @relation("StudentConversations", fields: [studentId], references: [id], onDelete: Cascade)
  
  adminId         String?
  admin           User?                   @relation("AdminConversations", fields: [adminId], references: [id], onDelete: SetNull)
  
  // Status
  status          ChatConversationStatus  @default(ACTIVE)
  
  // Metadata
  lastMessageAt   DateTime?
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @updatedAt
  
  // Relations
  messages        ChatMessage[]
  
  @@index([studentId])
  @@index([adminId])
  @@index([status])
  @@index([lastMessageAt])
  @@map("chat_conversations")
}

model ChatMessage {
  id              String           @id @default(uuid())
  
  // Conversation
  conversationId  String
  conversation    ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  // Sender
  senderId        String
  sender          User             @relation("SenderMessages", fields: [senderId], references: [id], onDelete: Cascade)
  
  // Message
  content         String           @db.Text
  attachments     Json?            // Array of attachment objects {url, name, type, size}
  
  // Status
  isRead          Boolean          @default(false)
  
  // Timestamp
  createdAt       DateTime         @default(now())
  
  @@index([conversationId])
  @@index([senderId])
  @@index([createdAt])
  @@map("chat_messages")
}

model News {
  id              String   @id @default(uuid())
  
  // Content
  title           String
  content         String   @db.Text
  imageUrl        String?
  
  // Publishing
  isPublished     Boolean  @default(false)
  publishedAt     DateTime?
  
  // Author
  authorId        String
  author          User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([isPublished])
  @@index([publishedAt])
  @@index([authorId])
  @@map("news")
}

model FAQ {
  id              String   @id @default(uuid())
  
  // Content
  question        String
  answer          String   @db.Text
  
  // Ordering
  order           Int      @default(0)
  
  // Publishing
  isPublished     Boolean  @default(true)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([order])
  @@index([isPublished])
  @@map("faq")
}

model OTPCode {
  id              String   @id @default(uuid())
  
  // Identifier (email or phone)
  identifier      String
  
  // Code
  code            String   // 6-digit code
  
  // Attempts
  attempts        Int      @default(0)
  
  // Expiry
  expiresAt       DateTime
  
  // Timestamp
  createdAt       DateTime @default(now())
  
  @@index([identifier, code])
  @@index([expiresAt])
  @@map("otp_codes")
}

// ============================================
// ANALYTICS VIEWS (Optional - can be created via raw SQL)
// ============================================

// CREATE VIEW application_statistics AS
// SELECT 
//   COUNT(*) as total_applications,
//   COUNT(*) FILTER (WHERE status = 'APPROVED') as approved_count,
//   COUNT(*) FILTER (WHERE status = 'REJECTED') as rejected_count,
//   SUM(approved_amount) as total_paid,
//   AVG(EXTRACT(EPOCH FROM (reviewed_at - submitted_at))/3600) as avg_review_hours
// FROM applications
// WHERE submitted_at IS NOT NULL;
```

---

## Индексирование

### Критичные индексы

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_role ON users(role);

-- Application indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_number ON applications(application_number);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_applications_user_status ON applications(user_id, status);
CREATE INDEX idx_applications_status_submitted ON applications(status, submitted_at DESC);

-- Chat indexes
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id, created_at DESC);
CREATE INDEX idx_chat_conversations_student ON chat_conversations(student_id, status);

-- Full-text search (PostgreSQL)
CREATE INDEX idx_applications_description_fts ON applications USING gin(to_tsvector('russian', description));
CREATE INDEX idx_news_content_fts ON news USING gin(to_tsvector('russian', title || ' ' || content));
```

---

## Миграции

### Начальная миграция

```sql
-- init.sql
-- Создается автоматически через Prisma Migrate

npx prisma migrate dev --name init
```

### Полезные команды Prisma

```bash
# Создать миграцию
npx prisma migrate dev --name <migration_name>

# Применить миграции в production
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate

# Открыть Prisma Studio (GUI для БД)
npx prisma studio

# Сбросить БД (осторожно!)
npx prisma migrate reset

# Seed данные
npx prisma db seed
```

---

## Seed Data

### seed.ts

```typescript
import { PrismaClient, UserRole, ApplicationStatus, ApplicationReason } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      firstName: 'Администратор',
      lastName: 'Системы',
      faculty: 'Администрация',
      department: 'Социальный отдел',
      course: 1,
      role: UserRole.ADMIN,
    },
  });

  console.log('Created admin:', admin);

  // Create test students
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@university.edu' },
      update: {},
      create: {
        studentId: '2024001',
        email: 'student1@university.edu',
        phone: '+79991234567',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        faculty: 'Инженерный',
        department: 'Программная инженерия',
        course: 2,
        group: 'ПИ-21',
        role: UserRole.STUDENT,
      },
    }),
    prisma.user.upsert({
      where: { email: 'student2@university.edu' },
      update: {},
      create: {
        studentId: '2024002',
        email: 'student2@university.edu',
        phone: '+79991234568',
        firstName: 'Мария',
        lastName: 'Петрова',
        middleName: 'Сергеевна',
        faculty: 'Медицинский',
        department: 'Лечебное дело',
        course: 3,
        group: 'ЛД-22',
        role: UserRole.STUDENT,
      },
    }),
  ]);

  console.log('Created students:', students.length);

  // Create sample applications
  const application = await prisma.application.create({
    data: {
      applicationNumber: '2024-001',
      userId: students[0].id,
      status: ApplicationStatus.SUBMITTED,
      reason: ApplicationReason.LOW_INCOME,
      description: 'Прошу оказать материальную помощь в связи с тяжелым материальным положением семьи.',
      amount: 15000,
      formData: {
        familyMembers: 4,
        familyIncome: 25000,
        additionalInfo: 'Отец находится на лечении',
      },
      submittedAt: new Date(),
    },
  });

  console.log('Created application:', application);

  // Create FAQ entries
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'Кто может подать заявку на материальную помощь?',
        answer: 'Все студенты очной формы обучения университета могут подать заявку на материальную помощь при наличии соответствующих оснований.',
        order: 1,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Какие документы необходимы для подачи заявки?',
        answer: 'Список необходимых документов зависит от основания подачи заявки и включает справки о доходах, медицинские справки, копии свидетельств и т.д.',
        order: 2,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Сколько времени рассматривается заявка?',
        answer: 'Среднее время рассмотрения заявки составляет 7-14 рабочих дней с момента подачи полного пакета документов.',
        order: 3,
      },
    }),
  ]);

  console.log('Created FAQs:', faqs.length);

  // Create news
  const news = await prisma.news.create({
    data: {
      title: 'Открыт прием заявок на материальную помощь',
      content: 'Уважаемые студенты! Начался прием заявок на материальную помощь на зимний семестр 2024 года. Заявки принимаются до 31 января 2024 года.',
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('Created news:', news);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### package.json (добавить)

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## Запросы и производительность

### Типичные запросы с оптимизацией

```typescript
// 1. Get user applications with pagination
const userApplications = await prisma.application.findMany({
  where: { userId },
  include: {
    documents: true,
    reviewer: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit,
});

// 2. Get applications for admin with filters
const applications = await prisma.application.findMany({
  where: {
    status: { in: statusFilter },
    submittedAt: {
      gte: startDate,
      lte: endDate,
    },
    user: {
      faculty: facultyFilter,
    },
  },
  include: {
    user: {
      select: {
        firstName: true,
        lastName: true,
        studentId: true,
        faculty: true,
      },
    },
  },
  orderBy: { submittedAt: 'desc' },
});

// 3. Get statistics (optimized)
const stats = await prisma.application.groupBy({
  by: ['status'],
  _count: { id: true },
  _sum: { approvedAmount: true },
  where: {
    submittedAt: { gte: startDate },
  },
});

// 4. Full-text search
const searchResults = await prisma.$queryRaw`
  SELECT * FROM applications
  WHERE to_tsvector('russian', description) @@ plainto_tsquery('russian', ${searchQuery})
  ORDER BY ts_rank(to_tsvector('russian', description), plainto_tsquery('russian', ${searchQuery})) DESC
  LIMIT 20;
`;
```

### Connection Pooling

```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Connection pooling in production (использовать PgBouncer)
// DATABASE_URL="postgresql://user:password@host:6432/db?pgbouncer=true&connection_limit=1"
```

---

## Бэкапы и восстановление

### Автоматические бэкапы

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DATABASE="aid_app_db"

pg_dump -U postgres $DATABASE | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

### Восстановление

```bash
# Restore from backup
gunzip -c backup_20240131_120000.sql.gz | psql -U postgres aid_app_db
```

---

## Связанные файлы

- [Architecture](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Migration Guide](./MIGRATIONS.md)

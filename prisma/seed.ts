import { PrismaClient, UserRole, ApplicationStatus, ApplicationReason } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean database
  console.log('🗑️  Cleaning existing data...');
  await prisma.applicationHistory.deleteMany();
  await prisma.applicationDocument.deleteMany();
  await prisma.application.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.news.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.oTPCode.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('👤 Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@university.edu',
      firstName: 'Администратор',
      lastName: 'Системы',
      faculty: 'Администрация',
      department: 'Социальный отдел',
      course: 1,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create test students
  console.log('👥 Creating students...');
  const students = await Promise.all([
    prisma.user.create({
      data: {
        studentId: '2024001',
        email: 'ivan.ivanov@university.edu',
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
    prisma.user.create({
      data: {
        studentId: '2024002',
        email: 'maria.petrova@university.edu',
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
    prisma.user.create({
      data: {
        studentId: '2024003',
        email: 'petr.sidorov@university.edu',
        phone: '+79991234569',
        firstName: 'Петр',
        lastName: 'Сидоров',
        middleName: 'Александрович',
        faculty: 'Экономический',
        department: 'Финансы и кредит',
        course: 4,
        group: 'ФК-20',
        role: UserRole.STUDENT,
      },
    }),
  ]);
  console.log(`✅ Created ${students.length} students`);

  // Create applications
  console.log('📝 Creating applications...');
  const applications = await Promise.all([
    // Application 1 - Submitted
    prisma.application.create({
      data: {
        applicationNumber: '2024-001',
        userId: students[0].id,
        status: ApplicationStatus.SUBMITTED,
        reason: ApplicationReason.LOW_INCOME,
        description:
          'Прошу оказать материальную помощь в связи с тяжелым материальным положением семьи. Отец находится на длительном лечении, мать не работает.',
        amount: 15000,
        formData: {
          familyMembers: 4,
          familyIncome: 25000,
          additionalInfo: 'Отец проходит лечение в онкологическом центре',
        },
        submittedAt: new Date('2024-01-15'),
      },
    }),
    // Application 2 - Under Review
    prisma.application.create({
      data: {
        applicationNumber: '2024-002',
        userId: students[1].id,
        status: ApplicationStatus.UNDER_REVIEW,
        reason: ApplicationReason.MEDICAL,
        description: 'Необходима материальная помощь на приобретение лекарственных препаратов.',
        amount: 20000,
        formData: {
          medicalCondition: 'Хроническое заболевание',
          prescriptionRequired: true,
        },
        submittedAt: new Date('2024-01-10'),
        reviewedBy: admin.id,
      },
    }),
    // Application 3 - Approved
    prisma.application.create({
      data: {
        applicationNumber: '2024-003',
        userId: students[2].id,
        status: ApplicationStatus.APPROVED,
        reason: ApplicationReason.EMERGENCY,
        description: 'Срочная помощь в связи с пожаром в месте проживания.',
        amount: 25000,
        approvedAmount: 25000,
        formData: {
          emergencyType: 'Пожар',
          documentationProvided: true,
        },
        submittedAt: new Date('2023-12-20'),
        reviewedAt: new Date('2023-12-22'),
        reviewedBy: admin.id,
        reviewComment: 'Заявка одобрена в полном объеме. Срочная выплата.',
      },
    }),
    // Application 4 - Completed
    prisma.application.create({
      data: {
        applicationNumber: '2023-045',
        userId: students[0].id,
        status: ApplicationStatus.COMPLETED,
        reason: ApplicationReason.LARGE_FAMILY,
        description: 'Материальная помощь для многодетной семьи.',
        amount: 18000,
        approvedAmount: 18000,
        submittedAt: new Date('2023-11-05'),
        reviewedAt: new Date('2023-11-08'),
        reviewedBy: admin.id,
        reviewComment: 'Выплачено',
      },
    }),
  ]);
  console.log(`✅ Created ${applications.length} applications`);

  // Create FAQ entries
  console.log('❓ Creating FAQ...');
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'Кто может подать заявку на материальную помощь?',
        answer:
          'Все студенты очной формы обучения университета могут подать заявку на материальную помощь при наличии соответствующих оснований: низкий доход семьи, медицинские показания, чрезвычайные ситуации и другие.',
        order: 1,
        isPublished: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Какие документы необходимы для подачи заявки?',
        answer:
          'Список документов зависит от основания подачи заявки. Обычно требуются: заявление, копия паспорта, справка о доходах семьи, документы, подтверждающие основание (медицинские справки, свидетельства и т.д.). Полный список можно уточнить в социальном отделе.',
        order: 2,
        isPublished: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Сколько времени рассматривается заявка?',
        answer:
          'Среднее время рассмотрения заявки составляет 7-14 рабочих дней с момента подачи полного пакета документов. В экстренных случаях срок может быть сокращен до 3-5 дней.',
        order: 3,
        isPublished: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Можно ли подать заявку повторно?',
        answer:
          'Да, студент может подавать заявки на материальную помощь несколько раз в течение учебного года при наличии оснований. Рекомендуется делать это не чаще одного раза в семестр.',
        order: 4,
        isPublished: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Как узнать статус моей заявки?',
        answer:
          'Вы можете отслеживать статус заявки в личном кабинете в разделе "Мои заявки". При изменении статуса вы получите уведомление на email.',
        order: 5,
        isPublished: true,
      },
    }),
  ]);
  console.log(`✅ Created ${faqs.length} FAQ entries`);

  // Create news
  console.log('📰 Creating news...');
  const news = await Promise.all([
    prisma.news.create({
      data: {
        title: 'Открыт прием заявок на материальную помощь',
        content:
          'Уважаемые студенты! Начался прием заявок на материальную помощь на весенний семестр 2024 года. Заявки принимаются до 31 января 2024 года. Для подачи заявки необходимо заполнить форму в личном кабинете и приложить подтверждающие документы.',
        authorId: admin.id,
        isPublished: true,
        publishedAt: new Date('2024-01-20'),
      },
    }),
    prisma.news.create({
      data: {
        title: 'Изменения в порядке подачи документов',
        content:
          'С 15 января 2024 года вступают в силу изменения в порядке подачи документов на материальную помощь. Теперь все документы можно подавать в электронном виде через личный кабинет. Оригиналы предоставлять не требуется.',
        authorId: admin.id,
        isPublished: true,
        publishedAt: new Date('2024-01-15'),
      },
    }),
    prisma.news.create({
      data: {
        title: 'График работы социального отдела в праздничные дни',
        content:
          'Обратите внимание на изменение графика работы социального отдела в праздничные дни. С 1 по 8 января отдел не работает. С вопросами можно обращаться через чат в личном кабинете.',
        authorId: admin.id,
        isPublished: true,
        publishedAt: new Date('2023-12-25'),
      },
    }),
  ]);
  console.log(`✅ Created ${news.length} news items`);

  // Create chat conversation
  console.log('💬 Creating chat conversation...');
  const conversation = await prisma.chatConversation.create({
    data: {
      studentId: students[0].id,
      adminId: admin.id,
      status: 'ACTIVE',
      lastMessageAt: new Date(),
    },
  });

  await Promise.all([
    prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: students[0].id,
        content: 'Здравствуйте! Подскажите, пожалуйста, какие документы нужны для подачи заявки?',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    }),
    prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: admin.id,
        content:
          'Добрый день! Для подачи заявки необходимы: заявление, копия паспорта и справка о доходах семьи.',
        isRead: true,
        createdAt: new Date(Date.now() - 3000000), // 50 minutes ago
      },
    }),
    prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: students[0].id,
        content: 'Спасибо! А справку можно предоставить в электронном виде?',
        isRead: false,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      },
    }),
  ]);
  console.log('✅ Created chat conversation with messages');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • Users: ${students.length + 1} (1 admin, ${students.length} students)`);
  console.log(`   • Applications: ${applications.length}`);
  console.log(`   • FAQ: ${faqs.length}`);
  console.log(`   • News: ${news.length}`);
  console.log(`   • Chat conversations: 1\n`);

  console.log('🔑 Login credentials:');
  console.log('   Admin: admin@university.edu');
  console.log('   Student 1: ivan.ivanov@university.edu');
  console.log('   Student 2: maria.petrova@university.edu');
  console.log('   Student 3: petr.sidorov@university.edu');
  console.log('\n💡 Use OTP authentication to login');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, Role, Status } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // إنشاء بعض المستخدمين
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
      image: 'https://i.pravatar.cc/150?img=1',
      bio: 'مدير الموقع ومحب كبير للمانجا'
    },
  });

  const userPassword = await hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'محمد أحمد',
      password: userPassword,
      role: Role.USER,
      image: 'https://i.pravatar.cc/150?img=2',
      bio: 'قارئ ومحب للمانجا منذ الصغر'
    },
  });

  const authorPassword = await hash('author123', 10);
  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      email: 'author@example.com',
      name: 'يوسف علي',
      password: authorPassword, 
      role: Role.MODERATOR, // استخدام MODERATOR بدلاً من AUTHOR
      image: 'https://i.pravatar.cc/150?img=3',
      bio: 'كاتب ورسام مانجا. أحب أن أشارك قصصي مع العالم'
    },
  });

  // إنشاء بعض التصنيفات
  const actionGenre = await prisma.genre.upsert({
    where: { name: 'أكشن' },
    update: {},
    create: {
      name: 'أكشن',
    },
  });

  const romanceGenre = await prisma.genre.upsert({
    where: { name: 'رومانسي' },
    update: {},
    create: {
      name: 'رومانسي',
    },
  });

  const fantasyGenre = await prisma.genre.upsert({
    where: { name: 'فانتازيا' },
    update: {},
    create: {
      name: 'فانتازيا',
    },
  });

  const comedyGenre = await prisma.genre.upsert({ 
    where: { name: 'كوميدي' },
    update: {},
    create: {
      name: 'كوميدي',
    },
  });

  // إنشاء بعض المانجا
  const mangaList = [
    {
      title: 'طريق الساموراي',
      description: 'قصة شاب يتدرب ليصبح محارب ساموراي قوي ويثأر لعائلته',
      status: Status.ONGOING,
      coverImage: 'https://images.unsplash.com/photo-1617074172293-a0f2837f10b3?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: actionGenre.id }, { id: fantasyGenre.id }]
      }
    },
    {
      title: 'حب في المدرسة',
      description: 'قصة رومانسية عن طالبين يقعان في الحب في المدرسة الثانوية',
      status: Status.COMPLETED,
      coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: romanceGenre.id }, { id: comedyGenre.id }]
      }
    },
    {
      title: 'عالم الأبطال',
      description: 'في عالم مليء بالأشخاص ذوي القدرات الخارقة، يسعى شاب عادي ليصبح بطلاً',
      status: Status.ONGOING,
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: actionGenre.id }, { id: fantasyGenre.id }]
      }
    },
    {
      title: 'مغامرات الصياد',
      description: 'قصة صياد شاب يسعى لاكتشاف أسرار العالم ويصبح أقوى صياد',
      status: Status.ONGOING,
      coverImage: 'https://images.unsplash.com/photo-1604152135912-04a022e73f35?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: actionGenre.id }, { id: fantasyGenre.id }]
      }
    },
    {
      title: 'النينجا الأخير',
      description: 'آخر نينجا على قيد الحياة يسعى لإعادة بناء قريته المدمرة',
      status: Status.ONGOING,
      coverImage: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: actionGenre.id }]
      }
    },
    {
      title: 'سيد المطبخ',
      description: 'طاهٍ شاب موهوب يسعى ليصبح أفضل طاهٍ في العالم',
      status: Status.ONGOING,
      coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: comedyGenre.id }]
      }
    },
    {
      title: 'رحلة إلى القمر',
      description: 'مغامرة مجموعة من الأصدقاء للسفر إلى القمر',
      status: Status.COMPLETED,
      coverImage: 'https://images.unsplash.com/photo-1532347922424-c84d79eca929?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: fantasyGenre.id }]
      }
    },
    {
      title: 'المدينة المفقودة',
      description: 'مغامرة البحث عن مدينة أسطورية مفقودة منذ آلاف السنين',
      status: Status.ONGOING,
      coverImage: 'https://images.unsplash.com/photo-1582921597893-f834b3de4e28?q=80&w=600',
      author: {
        connect: { id: author.id }
      },
      genres: {
        connect: [{ id: actionGenre.id }, { id: fantasyGenre.id }]
      }
    }
  ];

  for (const manga of mangaList) {
    await prisma.manga.create({
      data: manga
    });
  }

  // الحصول على جميع المانجا لإضافة فصول لها
  const mangas = await prisma.manga.findMany();

  // إضافة فصول لكل مانجا
  for (const manga of mangas) {
    const chaptersCount = Math.floor(Math.random() * 10) + 5; // 5-15 فصل
    
    for (let i = 1; i <= chaptersCount; i++) {
      const pages = Math.floor(Math.random() * 15) + 10; // 10-25 صفحة
      await prisma.chapter.create({
        data: {
          mangaId: manga.id,
          number: i,
          title: `الفصل ${i}: ${Math.random() > 0.5 ? 'المغامرة تبدأ' : 'مواجهة جديدة'}`,
          pagesCount: pages,
        }
      });
    }

    // إضافة تعليقات
    const commentsCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < commentsCount; i++) {
      await prisma.comment.create({
        data: {
          mangaId: manga.id,
          userId: i % 2 === 0 ? user.id : admin.id,
          content: i % 2 === 0 
            ? 'مانجا رائعة! أحب القصة والرسومات جميلة جداً' 
            : 'استمتعت بقراءة هذه المانجا، أنتظر الفصول القادمة بفارغ الصبر'
        }
      });
    }

    // إضافة لمكتبة المستخدم
    if (Math.random() > 0.3) {
      await prisma.libraryEntry.create({
        data: {
          mangaId: manga.id,
          userId: user.id,
          readStatus: Math.random() > 0.5 ? 'READING' : 'PLAN_TO_READ',
        }
      });
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 
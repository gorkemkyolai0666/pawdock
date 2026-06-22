import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const FACILITY_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.facility.upsert({
    where: { id: FACILITY_ID },
    update: {},
    create: {
      id: FACILITY_ID,
      name: 'PawDock Pet Otel',
      phone: '+902121234567',
      address: 'Çamlıca Mahallesi, Hayvan Dostları Sokak No:12',
      city: 'İstanbul',
      district: 'Üsküdar',
      capacity: 30,
      timezone: 'Europe/Istanbul',
      users: {
        create: {
          email: 'demo@pawdock.com.tr',
          passwordHash,
          firstName: 'Aylin',
          lastName: 'Hayvan Sever',
          role: 'manager',
        },
      },
    },
  });

  const ownerData = [
    { id: '00000000-0000-0000-0000-000000000101', firstName: 'Elif', lastName: 'Yılmaz', email: 'elif.yilmaz@mail.com', phone: '+905551112233', address: 'Kadıköy, İstanbul' },
    { id: '00000000-0000-0000-0000-000000000102', firstName: 'Ahmet', lastName: 'Kara', email: 'ahmet.kara@mail.com', phone: '+905552223344', address: 'Beşiktaş, İstanbul' },
    { id: '00000000-0000-0000-0000-000000000103', firstName: 'Zeynep', lastName: 'Demir', email: 'zeynep.demir@mail.com', phone: '+905553334455', address: 'Maltepe, İstanbul' },
    { id: '00000000-0000-0000-0000-000000000104', firstName: 'Murat', lastName: 'Çelik', email: 'murat.celik@mail.com', phone: '+905554445566', address: 'Ataşehir, İstanbul' },
    { id: '00000000-0000-0000-0000-000000000105', firstName: 'Selin', lastName: 'Arslan', email: 'selin.arslan@mail.com', phone: '+905555556677', address: 'Sarıyer, İstanbul' },
  ];

  for (const o of ownerData) {
    await prisma.owner.upsert({ where: { id: o.id }, update: {}, create: o });
  }

  const petData = [
    { id: '00000000-0000-0000-0000-000000000201', name: 'Boncuk', species: 'dog' as const, breed: 'Golden Retriever', size: 'large' as const, age: 3, weight: 32.5, color: 'Altın sarısı', vaccinated: true, neutered: true, ownerId: '00000000-0000-0000-0000-000000000101', notes: 'Çok enerjik, günde 2 yürüyüş gerekli' },
    { id: '00000000-0000-0000-0000-000000000202', name: 'Pamuk', species: 'cat' as const, breed: 'Van Kedisi', size: 'medium' as const, age: 5, weight: 4.8, color: 'Beyaz', vaccinated: true, neutered: false, ownerId: '00000000-0000-0000-0000-000000000101', dietaryNotes: 'Kuru mama tercih eder' },
    { id: '00000000-0000-0000-0000-000000000203', name: 'Karamel', species: 'dog' as const, breed: 'Labrador', size: 'large' as const, age: 2, weight: 28.0, color: 'Kahverengi', vaccinated: true, neutered: true, ownerId: '00000000-0000-0000-0000-000000000102', specialNeeds: 'Kalça displazisi — merdivenlerden uzak tutulmalı' },
    { id: '00000000-0000-0000-0000-000000000204', name: 'Minnoş', species: 'cat' as const, breed: 'Tekir', size: 'small' as const, age: 1, weight: 3.2, color: 'Gri-beyaz', vaccinated: true, neutered: true, ownerId: '00000000-0000-0000-0000-000000000103' },
    { id: '00000000-0000-0000-0000-000000000205', name: 'Zeus', species: 'dog' as const, breed: 'Alman Kurdu', size: 'giant' as const, age: 4, weight: 42.0, color: 'Siyah-kahverengi', vaccinated: true, neutered: true, ownerId: '00000000-0000-0000-0000-000000000104', notes: 'Diğer köpeklerle iyi geçinir' },
    { id: '00000000-0000-0000-0000-000000000206', name: 'Cici', species: 'bird' as const, breed: 'Sultan Papağanı', size: 'tiny' as const, age: 2, weight: 0.09, color: 'Sarı-gri', ownerId: '00000000-0000-0000-0000-000000000105', dietaryNotes: 'Günlük taze meyve verilmeli' },
    { id: '00000000-0000-0000-0000-000000000207', name: 'Fıstık', species: 'rabbit' as const, breed: 'Holland Lop', size: 'small' as const, age: 1, weight: 1.8, color: 'Krem', ownerId: '00000000-0000-0000-0000-000000000105', allergies: 'Saman alerjisi var' },
    { id: '00000000-0000-0000-0000-000000000208', name: 'Max', species: 'dog' as const, breed: 'Beagle', size: 'medium' as const, age: 6, weight: 12.5, color: 'Üç renkli', vaccinated: true, neutered: true, ownerId: '00000000-0000-0000-0000-000000000103', notes: 'Yemek çalma alışkanlığı var' },
  ];

  for (const p of petData) {
    await prisma.pet.upsert({ where: { id: p.id }, update: {}, create: { ...p, facilityId: FACILITY_ID } });
  }

  const roomData = [
    { id: '00000000-0000-0000-0000-000000000301', name: 'Standart Oda 1', roomType: 'standard' as const, status: 'occupied' as const, capacity: 1, dailyRate: 250, floor: 1, hasCamera: true },
    { id: '00000000-0000-0000-0000-000000000302', name: 'Standart Oda 2', roomType: 'standard' as const, status: 'available' as const, capacity: 1, dailyRate: 250, floor: 1, hasCamera: true },
    { id: '00000000-0000-0000-0000-000000000303', name: 'Premium Oda 1', roomType: 'premium' as const, status: 'occupied' as const, capacity: 2, dailyRate: 450, floor: 2, hasCamera: true, notes: 'Geniş alan, oyun köşesi mevcut' },
    { id: '00000000-0000-0000-0000-000000000304', name: 'Süit Oda', roomType: 'suite' as const, status: 'available' as const, capacity: 3, dailyRate: 750, floor: 2, hasCamera: true, notes: 'VIP misafirler için — kamera, özel bahçe erişimi' },
    { id: '00000000-0000-0000-0000-000000000305', name: 'Dış Mekan Alanı', roomType: 'outdoor' as const, status: 'available' as const, capacity: 5, dailyRate: 150, floor: 1, hasCamera: true, notes: 'Güneşli havalar için açık alan' },
    { id: '00000000-0000-0000-0000-000000000306', name: 'İzolasyon Odası', roomType: 'isolation' as const, status: 'available' as const, capacity: 1, dailyRate: 350, floor: 1, hasCamera: true, notes: 'Hasta veya yeni gelen hayvanlar için' },
    { id: '00000000-0000-0000-0000-000000000307', name: 'Standart Oda 3', roomType: 'standard' as const, status: 'maintenance' as const, capacity: 1, dailyRate: 250, floor: 1, hasCamera: false, notes: 'Kamera tamirde' },
    { id: '00000000-0000-0000-0000-000000000308', name: 'Premium Oda 2', roomType: 'premium' as const, status: 'reserved' as const, capacity: 2, dailyRate: 450, floor: 2, hasCamera: true },
  ];

  for (const r of roomData) {
    await prisma.room.upsert({ where: { id: r.id }, update: {}, create: { ...r, facilityId: FACILITY_ID } });
  }

  const bookingData = [
    { id: '00000000-0000-0000-0000-000000000401', petId: '00000000-0000-0000-0000-000000000201', roomId: '00000000-0000-0000-0000-000000000301', checkIn: new Date('2024-07-01'), checkOut: new Date('2024-07-10'), status: 'checked_in' as const, totalPrice: 2250, notes: 'Sabah akşam yürüyüş, öğlen oyun' },
    { id: '00000000-0000-0000-0000-000000000402', petId: '00000000-0000-0000-0000-000000000203', roomId: '00000000-0000-0000-0000-000000000303', checkIn: new Date('2024-07-02'), checkOut: new Date('2024-07-08'), status: 'checked_in' as const, totalPrice: 2700, notes: 'Merdiven yok — zemin katı tercih edildi' },
    { id: '00000000-0000-0000-0000-000000000403', petId: '00000000-0000-0000-0000-000000000205', roomId: '00000000-0000-0000-0000-000000000308', checkIn: new Date('2024-07-15'), checkOut: new Date('2024-07-20'), status: 'confirmed' as const, totalPrice: 2250 },
    { id: '00000000-0000-0000-0000-000000000404', petId: '00000000-0000-0000-0000-000000000202', roomId: '00000000-0000-0000-0000-000000000302', checkIn: new Date('2024-06-20'), checkOut: new Date('2024-06-25'), status: 'checked_out' as const, totalPrice: 1250 },
    { id: '00000000-0000-0000-0000-000000000405', petId: '00000000-0000-0000-0000-000000000204', roomId: '00000000-0000-0000-0000-000000000304', checkIn: new Date('2024-07-05'), checkOut: new Date('2024-07-12'), status: 'pending' as const, totalPrice: 5250 },
  ];

  for (const b of bookingData) {
    await prisma.booking.upsert({ where: { id: b.id }, update: {}, create: { ...b, facilityId: FACILITY_ID } });
  }

  const careLogData = [
    { id: '00000000-0000-0000-0000-000000000501', petId: '00000000-0000-0000-0000-000000000201', careType: 'walking' as const, description: 'Sabah yürüyüşü — Çamlıca Parkı', staffName: 'Aylin Hayvan Sever', logDate: new Date('2024-07-05T08:00:00'), duration: 30, notes: 'Çok enerjikti, iyi koştu' },
    { id: '00000000-0000-0000-0000-000000000502', petId: '00000000-0000-0000-0000-000000000201', careType: 'feeding' as const, description: 'Sabah maması — 300g kuru mama', staffName: 'Aylin Hayvan Sever', logDate: new Date('2024-07-05T09:00:00'), duration: 10 },
    { id: '00000000-0000-0000-0000-000000000503', petId: '00000000-0000-0000-0000-000000000203', careType: 'medication' as const, description: 'Kalça eklemi ilacı verildi', staffName: 'Aylin Hayvan Sever', logDate: new Date('2024-07-05T09:30:00'), duration: 5, notes: 'Tablete iyi tepki verdi' },
    { id: '00000000-0000-0000-0000-000000000504', petId: '00000000-0000-0000-0000-000000000201', careType: 'playtime' as const, description: 'Top oyunu — bahçe alanı', staffName: 'Mehmet (Stajyer)', logDate: new Date('2024-07-05T14:00:00'), duration: 45 },
    { id: '00000000-0000-0000-0000-000000000505', petId: '00000000-0000-0000-0000-000000000203', careType: 'grooming' as const, description: 'Tüy fırçalama ve tırnak kesimi', staffName: 'Aylin Hayvan Sever', logDate: new Date('2024-07-04T11:00:00'), duration: 25 },
    { id: '00000000-0000-0000-0000-000000000506', petId: '00000000-0000-0000-0000-000000000201', careType: 'walking' as const, description: 'Akşam yürüyüşü', staffName: 'Mehmet (Stajyer)', logDate: new Date('2024-07-05T18:00:00'), duration: 25 },
  ];

  for (const cl of careLogData) {
    await prisma.careLog.upsert({ where: { id: cl.id }, update: {}, create: { ...cl, facilityId: FACILITY_ID } });
  }

  console.log('PawDock seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

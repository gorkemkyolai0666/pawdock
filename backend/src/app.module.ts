import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PetsModule } from './pets/pets.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { CareLogsModule } from './care-logs/care-logs.module';
import { OwnersModule } from './owners/owners.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    PetsModule,
    RoomsModule,
    BookingsModule,
    CareLogsModule,
    OwnersModule,
    DashboardModule,
  ],
})
export class AppModule {}

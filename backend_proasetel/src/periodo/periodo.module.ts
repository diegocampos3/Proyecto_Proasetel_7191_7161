import { Module } from '@nestjs/common';
import { PeriodoService } from './periodo.service';
import { PeriodoController } from './periodo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Periodo } from 'src/data-access/entities/periodo.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesWsModule } from 'src/messages-ws/messages-ws.module';

@Module({
  controllers: [PeriodoController],
  providers: [PeriodoService],
  imports: [
    TypeOrmModule.forFeature([Periodo]),
    AuthModule,
    MessagesWsModule
  ]
})
export class PeriodoModule {}

import { Module } from '@nestjs/common';
import { AnalisisSentimientosService } from './analisis-sentimientos.service';
import { AnalisisSentimientosController } from './analisis-sentimientos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalisisSentimientos } from 'src/data-access/entities/analisis-sentimiento.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AnalisisSentimientosController],
  providers: [AnalisisSentimientosService],
  imports: [
    TypeOrmModule.forFeature([AnalisisSentimientos]),
    AuthModule,

  ],
  exports: [TypeOrmModule]
})
export class AnalisisSentimientosModule {}

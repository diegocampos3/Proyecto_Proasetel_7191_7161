import { Module } from '@nestjs/common';
import { AnalisisSentimientosService } from './analisis-sentimientos.service';
import { AnalisisSentimientosController } from './analisis-sentimientos.controller';

@Module({
  controllers: [AnalisisSentimientosController],
  providers: [AnalisisSentimientosService],
})
export class AnalisisSentimientosModule {}

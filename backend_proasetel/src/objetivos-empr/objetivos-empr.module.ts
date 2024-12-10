import { Module } from '@nestjs/common';
import { ObjetivosEmprService } from './objetivos-empr.service';
import { ObjetivosEmprController } from './objetivos-empr.controller';

@Module({
  controllers: [ObjetivosEmprController],
  providers: [ObjetivosEmprService],
})
export class ObjetivosEmprModule {}

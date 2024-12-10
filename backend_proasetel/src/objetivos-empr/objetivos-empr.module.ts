import { Module } from '@nestjs/common';
import { ObjetivosEmprService } from './objetivos-empr.service';
import { ObjetivosEmprController } from './objetivos-empr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetivosEmpr } from './entities/objetivos-empr.entity';

@Module({
  controllers: [ObjetivosEmprController],
  providers: [ObjetivosEmprService],
  imports: [TypeOrmModule.forFeature([ObjetivosEmpr])],
  exports: [TypeOrmModule]
})
export class ObjetivosEmprModule {}

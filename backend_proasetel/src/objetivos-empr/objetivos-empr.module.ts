import { Module } from '@nestjs/common';
import { ObjetivosEmprService } from './objetivos-empr.service';
import { ObjetivosEmprController } from './objetivos-empr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetivosEmpr } from './entities/objetivosEmpr.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ObjetivosEmprController],
  providers: [ObjetivosEmprService],
  imports: [
    TypeOrmModule.forFeature([ObjetivosEmpr]),
    AuthModule
  ],
  exports: [TypeOrmModule]
})
export class ObjetivosEmprModule {}

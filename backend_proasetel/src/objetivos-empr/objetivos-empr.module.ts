import { Module } from '@nestjs/common';
import { ObjetivosEmprService } from './objetivos-empr.service';
import { ObjetivosEmprController } from './objetivos-empr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { ObjetivosEmpr } from './entities/objetivos-empr.entity';
=======
import { ObjetivosEmpr } from './entities/objetivosEmpr.entity';
import { AuthModule } from 'src/auth/auth.module';
>>>>>>> 6f494fd4d20514cbe27f6bcbd702a180a733d7dc

@Module({
  controllers: [ObjetivosEmprController],
  providers: [ObjetivosEmprService],
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([ObjetivosEmpr])],
=======
  imports: [
    TypeOrmModule.forFeature([ObjetivosEmpr]),
    AuthModule
  ],
>>>>>>> 6f494fd4d20514cbe27f6bcbd702a180a733d7dc
  exports: [TypeOrmModule]
})
export class ObjetivosEmprModule {}

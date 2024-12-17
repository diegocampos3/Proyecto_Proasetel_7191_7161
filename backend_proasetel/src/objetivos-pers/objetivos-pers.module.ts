import { Module } from '@nestjs/common';
import { ObjetivosPersService } from './objetivos-pers.service';
import { ObjetivosPersController } from './objetivos-pers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
import { ObjetivosDepModule } from 'src/objetivos-dep/objetivos-dep.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ObjetivosPersController],
  providers: [ObjetivosPersService],
  imports:[
    TypeOrmModule.forFeature([ObjetivosPers]),
    ObjetivosDepModule,
    AuthModule

  ],
  exports: [TypeOrmModule]

})
export class ObjetivosPersModule {}

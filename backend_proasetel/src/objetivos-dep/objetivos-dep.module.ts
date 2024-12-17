import { Module } from '@nestjs/common';
import { ObjetivosDepService } from './objetivos-dep.service';
import { ObjetivosDepController } from './objetivos-dep.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetivosDep } from 'src/data-access/entities/objetivosDep.entity';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';
import { ObjetivosEmprModule } from 'src/objetivos-empr/objetivos-empr.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ObjetivosDepController],
  providers: [ObjetivosDepService],
  imports: [
    TypeOrmModule.forFeature([ObjetivosDep]),
    DepartamentosModule,
    ObjetivosEmprModule,
    AuthModule
  ],
  exports: [TypeOrmModule]
})
export class ObjetivosDepModule {}

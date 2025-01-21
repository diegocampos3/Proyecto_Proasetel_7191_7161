import { Module } from '@nestjs/common';
import { ObjetivosDepService } from './objetivos-dep.service';
import { ObjetivosDepController } from './objetivos-dep.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetivosDep } from 'src/data-access/entities/objetivosDep.entity';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';
import { ObjetivosEmprModule } from 'src/objetivos-empr/objetivos-empr.module';
import { AuthModule } from 'src/auth/auth.module';
import { ObjtivosEmpDepModule } from 'src/objtivos-emp-dep/objtivos-emp-dep.module';

@Module({
  controllers: [ObjetivosDepController],
  providers: [ObjetivosDepService],
  imports: [
    TypeOrmModule.forFeature([ObjetivosDep]),
    ObjtivosEmpDepModule,
    AuthModule
  ],
  exports: [TypeOrmModule]
})
export class ObjetivosDepModule {}

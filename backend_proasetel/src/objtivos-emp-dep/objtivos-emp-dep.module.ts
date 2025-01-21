import { Module } from '@nestjs/common';
import { ObjtivosEmpDepService } from './objtivos-emp-dep.service';
import { ObjtivosEmpDepController } from './objtivos-emp-dep.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjtivosEmpDep } from 'src/data-access/entities/objtivos-emp-dep.entity';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';
import { ObjetivosEmprModule } from 'src/objetivos-empr/objetivos-empr.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ObjtivosEmpDepController],
  providers: [ObjtivosEmpDepService],
  imports: [
    TypeOrmModule.forFeature([ObjtivosEmpDep]),
    DepartamentosModule,
    ObjetivosEmprModule,
    AuthModule
  ],
  exports: [TypeOrmModule]
})
export class ObjtivosEmpDepModule {}

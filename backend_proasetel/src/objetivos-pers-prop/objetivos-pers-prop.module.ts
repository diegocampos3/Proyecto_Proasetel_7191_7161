import { Module } from '@nestjs/common';
import { ObjetivosPersPropService } from './objetivos-pers-prop.service';
import { ObjetivosPersPropController } from './objetivos-pers-prop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetivosPersProp } from 'src/data-access/entities/objetivos-pers-prop.entity';
import { ObjtivosEmpDepModule } from 'src/objtivos-emp-dep/objtivos-emp-dep.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ObjetivosPersPropController],
  providers: [ObjetivosPersPropService],
  imports: [
      TypeOrmModule.forFeature([ObjetivosPersProp]),
      ObjtivosEmpDepModule,
      AuthModule,
      
    ],
    exports: [TypeOrmModule]
})
export class ObjetivosPersPropModule {}

import { Module } from '@nestjs/common';
import { ObjetivosDepService } from './objetivos-dep.service';
import { ObjetivosDepController } from './objetivos-dep.controller';

@Module({
  controllers: [ObjetivosDepController],
  providers: [ObjetivosDepService],
})
export class ObjetivosDepModule {}

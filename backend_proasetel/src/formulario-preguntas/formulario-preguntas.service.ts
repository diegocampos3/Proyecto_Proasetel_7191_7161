import { Injectable } from '@nestjs/common';
import { CreateFormularioPreguntaDto } from './dto/create-formulario-pregunta.dto';
import { UpdateFormularioPreguntaDto } from './dto/update-formulario-pregunta.dto';

@Injectable()
export class FormularioPreguntasService {
  create(createFormularioPreguntaDto: CreateFormularioPreguntaDto) {
    return 'This action adds a new formularioPregunta';
  }

  findAll() {
    return `This action returns all formularioPreguntas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formularioPregunta`;
  }

  update(id: number, updateFormularioPreguntaDto: UpdateFormularioPreguntaDto) {
    return `This action updates a #${id} formularioPregunta`;
  }

  remove(id: number) {
    return `This action removes a #${id} formularioPregunta`;
  }
}

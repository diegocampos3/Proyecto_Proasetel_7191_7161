import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/data-access/entities/usuario.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Auth()
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @GetUser() user: User
  ) {
    return this.feedbackService.create(createFeedbackDto, user);
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.empleado)
  update(@Param('id') id: string, 
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @GetUser() user: User
  
  ) {
    return this.feedbackService.update(id, updateFeedbackDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}

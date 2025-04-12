import { PartialType } from '@nestjs/swagger';
import { CreatePhysicalAssessmentDto } from './create-physical-assessment.dto';

export class UpdatePhysicalAssessmentDto extends PartialType(CreatePhysicalAssessmentDto) {} 
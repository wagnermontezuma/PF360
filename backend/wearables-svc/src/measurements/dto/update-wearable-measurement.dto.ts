import { PartialType } from '@nestjs/swagger';
import { CreateWearableMeasurementDto } from './create-wearable-measurement.dto';

export class UpdateWearableMeasurementDto extends PartialType(CreateWearableMeasurementDto) {} 
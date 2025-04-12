import { CreateEquipmentInput } from './create-equipment.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEquipmentInput extends PartialType(CreateEquipmentInput) {
  id: number;
}

import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator'
import { Gender, PatientType } from '@prisma/client'

export class CreatePatientDto {
  @IsString()
  name: string

  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  secondPhone?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  age?: number

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  occupation?: string

  @IsOptional()
  @IsEnum(PatientType)
  patientType?: PatientType

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsString()
  allergies?: string
}

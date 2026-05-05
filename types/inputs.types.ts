// dtos.ts

import { Gender, AppointmentStatus, Appointment } from "./models.types";

export type SearchParamProps = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export interface CreateUserParams {
  name?: string;
  email: string;
  phone: string;
}

export interface User extends CreateUserParams {
  $id: string;
}

export interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: File;
  privacyConsent: boolean;
}

export interface CreateAppointmentParams {
  userId: string;
  patient: string;
  primaryPhysician: string;
  appointmentDate: Date;
  appointmentReason?: string;
  additionalComments?: string;
  cancellationReason?: string | null;
  appointmentStatus: AppointmentStatus;
}

export interface UpdateAppointmentParams {
  userId: string;
  appointmentId: string;
  appointment: Partial<Appointment>;
  type: string;
}

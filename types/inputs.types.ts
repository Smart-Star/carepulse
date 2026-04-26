// dtos.ts

import { Gender, Status, Appointment } from "./models.types";

/* export type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}; */

export type SearchParamProps = {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
};

export interface CreateUserParams {
  name: string;
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
  reason: string;
  schedule: Date;
  status: Status;
  note?: string;
}

export interface UpdateAppointmentParams {
  appointmentId: string;
  userId: string;
  appointment: Appointment;
  type: string;
}

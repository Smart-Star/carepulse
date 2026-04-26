import { Models } from "node-appwrite";

export type Gender = "Male" | "Female" | "Other";
export type Status = "pending" | "scheduled" | "cancelled";

export interface UserDocument extends Models.Document {
  name: string;
  email: string;
  phone: string;
}

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
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

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note?: string;
  userId: string;
  cancellationReason?: string | null;
}

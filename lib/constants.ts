import {
  userFormSchema,
  PatientFormSchema,
  createAppointmentFormSchema,
} from "@/lib/schema/validation";

import * as z from "zod";
import { FormControlType, FormFieldType } from "../types/ui.types";

export const genderOptions = ["Male", "Female", "Other"];

export const patientFormControls: FormControlType<
  z.infer<typeof userFormSchema>
>[] = [
  {
    name: "name",
    label: "Full name",
    fieldType: FormFieldType.INPUT,
    placeholder: "John Doe",
    iconSrc: "/assets/icons/user.svg",
    iconAlt: "user",
  },
  {
    name: "email",
    label: "Email address",
    fieldType: FormFieldType.INPUT,
    placeholder: "john@doe.com",
    iconSrc: "/assets/icons/email.svg",
    iconAlt: "email",
  },
  {
    name: "phone",
    label: "Phone number",
    fieldType: FormFieldType.PHONE_INPUT,
    placeholder: "+1 (555) 123-4567",
  },
];

export const registerFormControls: FormControlType<
  z.infer<typeof PatientFormSchema>
>[] = [
  {
    name: "name",
    label: "Full Name",
    fieldType: FormFieldType.INPUT,
    placeholder: "John Doe",
    iconSrc: "/assets/icons/user.svg",
    iconAlt: "user",
  },
  {
    name: "email",
    label: "Email address",
    fieldType: FormFieldType.INPUT,
    placeholder: "john@doe.com",
    iconSrc: "/assets/icons/email.svg",
    iconAlt: "email",
  },
  {
    name: "phone",
    label: "Phone number",
    fieldType: FormFieldType.PHONE_INPUT,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "birthDate",
    label: "Date of birth",
    fieldType: FormFieldType.DATE_PICKER,
    placeholder: "Select your birth date",
    iconSrc: "/assets/icons/calendar.svg",
    iconAlt: "calendar",
  },
  {
    name: "gender",
    label: "Gender",
    fieldType: FormFieldType.SKELETON,
  },
  {
    name: "address",
    label: "Address",
    fieldType: FormFieldType.INPUT,
    placeholder: "14 street, New York",
  },
  {
    name: "occupation",
    label: "Occupation",
    fieldType: FormFieldType.INPUT,
    placeholder: "Software Engineer",
  },
  {
    name: "emergencyContactName",
    label: "Emergency contact name",
    fieldType: FormFieldType.INPUT,
    placeholder: "Guardian's Name",
  },
  {
    name: "emergencyContactNumber",
    label: "Emergency contact number",
    fieldType: FormFieldType.PHONE_INPUT,
    placeholder: "+00 0342 0453 34",
  },
  {
    name: "primaryPhysician",
    label: "Primary care physician",
    fieldType: FormFieldType.SELECT,
    placeholder: "Select a physician",
  },
  {
    name: "insuranceProvider",
    label: "Insurance provider",
    fieldType: FormFieldType.INPUT,
    placeholder: "BlueCross BlueShield",
  },
  {
    name: "insurancePolicyNumber",
    label: "Insurance policy number",
    fieldType: FormFieldType.INPUT,
    placeholder: "ABC123456789",
  },
  {
    name: "allergies",
    label: "Allergies (if any)",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Peanuts, Penicillin, Pollen",
  },
  {
    name: "currentMedication",
    label: "Current medications",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Ibuprofen 200mg, Levothyroxine 50mcg",
  },
  {
    name: "familyMedicalHistory",
    label: "Family medical history (if relevant)",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Mother had breast cancer",
  },
  {
    name: "pastMedicalHistory",
    label: "Past medical history",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Asthma diagnosis in childhood",
  },
  {
    name: "identificationType",
    label: "Identification type",
    fieldType: FormFieldType.SELECT,
    placeholder: "Select an identification type",
  },
  {
    name: "identificationNumber",
    label: "Identification Number",
    fieldType: FormFieldType.INPUT,
    placeholder: "123456789",
  },
  {
    name: "identificationDocument",
    label: "Scanned Copy of Identification Document",
    fieldType: FormFieldType.SKELETON,
  },
  {
    name: "treatmentConsent",
    label: "I consent to receive treatment for my health condition.",
    fieldType: FormFieldType.CHECKBOX,
  },
  {
    name: "disclosureConsent",
    label:
      "I consent to the use and disclosure of my health information for treatment purposes.",
    fieldType: FormFieldType.CHECKBOX,
  },
  {
    name: "privacyConsent",
    label:
      "I acknowledge that I have reviewed and agree to the privacy policy.",
    fieldType: FormFieldType.CHECKBOX,
  },
];

export const createAppointmentFormControls: FormControlType<
  z.infer<typeof createAppointmentFormSchema>
>[] = [
  {
    name: "primaryPhysician",
    label: "Doctor",
    fieldType: FormFieldType.SELECT,
    placeholder: "Select a doctor",
  },
  {
    name: "appointmentDate",
    label: "Expected appointment date",
    fieldType: FormFieldType.DATE_PICKER,
    placeholder: "Select your appointment date",
    iconSrc: "/assets/icons/calendar.svg",
    iconAlt: "calendar",
  },
  {
    name: "appointmentReason",
    label: "Reason for appointment",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Enter reason for appointment",
  },
  {
    name: "additionalComments",
    label: "Additional comments/notes",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Prefer afternoon appointment, if possible",
  },
  {
    name: "cancellationReason",
    label: "Reason for cancellation",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Enter reason for cancellation",
  },
];

export const identificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const statusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

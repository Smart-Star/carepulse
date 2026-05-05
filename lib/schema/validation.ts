import z from "zod";

export const registerUserFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.email(),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const loginUserFormSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export function getUserFormSchema(type: string) {
  switch (type) {
    case "login":
      return loginUserFormSchema;
    default:
      return registerUserFormSchema;
  }
}

export const PatientFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number",
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.array(z.instanceof(File)).optional(),
  treatmentConsent: z.boolean().refine((value) => value === true, {
    message: "You must consent to treatment in order to proceed",
  }),
  disclosureConsent: z.boolean().refine((value) => value === true, {
    message: "You must consent to disclosure in order to proceed",
  }),
  privacyConsent: z.boolean().refine((value) => value === true, {
    message: "You must consent to privacy in order to proceed",
  }),
});

export const createAppointmentFormSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  appointmentDate: z.date(),
  appointmentReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  additionalComments: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentFormSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  appointmentDate: z.date(),
  appointmentReason: z.string().optional(),
  additionalComments: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentFormSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  appointmentDate: z.date(),
  appointmentReason: z.string().optional(),
  additionalComments: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return createAppointmentFormSchema;
    case "cancel":
      return CancelAppointmentFormSchema;
    default:
      return ScheduleAppointmentFormSchema;
  }
}

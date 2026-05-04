"use client";

import {
  doctors,
  genderOptions,
  identificationTypes,
  registerFormControls,
} from "@/lib/constants";

import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "../ui/label";
import { useTransition } from "react";
import { SelectItem } from "../ui/select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { User } from "@/types/inputs.types";
import { RadioGroup } from "@base-ui/react";
import { Field } from "@/components/ui/field";
import { SubmitButton } from "../submit-button";
import { FileUploader } from "../file-uploader";
import { RadioGroupItem } from "../ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormField } from "../custom-form-field";
import { PatientFormSchema } from "@/lib/schema/validation";
import { registerPatient } from "@/actions/patient.actions";

type Props = {
  user: User;
};

export function RegisterForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormSchema>>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      birthDate: new Date(),
      gender: "Male",
      address: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      primaryPhysician: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      currentMedication: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      identificationType: "",
      identificationNumber: "",
      identificationDocument: undefined, // ✅ important
      treatmentConsent: false,
      disclosureConsent: false,
      privacyConsent: false,
    },
  });

  async function onSubmit(data: z.infer<typeof PatientFormSchema>) {
    startTransition(async () => {
      try {
        const identificationDocument = data.identificationDocument?.[0];

        const patientData = {
          ...data,
          userId: user.$id,
          birthDate: new Date(data.birthDate),
          identificationDocument,
        };
        const patient = await registerPatient(patientData);

        if (patient?.success) {
          router.push(`/patients/${user?.$id}/new-appointment`);
          toast(patient?.message);
        } else {
          toast(patient?.message || "Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  // This looks up the configuration for a specific field by its name
  const getFormField = (name: string) =>
    registerFormControls.find((formControl) => formControl.name === name);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-12'>
      <header className='space-y-4'>
        <h1 className='header'>Welcome 👋</h1>
        <p className='text-dark-700'>Let us know more about yourself</p>
      </header>

      {/* Personal Information */}
      <section className='space-y-6'>
        <h2 className='mb-9 sub-header'>Personal information</h2>

        {/* Row 1: Full name */}
        <CustomFormField
          {...getFormField("name")!}
          control={form.control}
          disabled={!!user.name}
        />

        {/* Row 2: Email & Phone */}
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            {...getFormField("email")!}
            control={form.control}
            disabled={!!user.email}
          />
          <CustomFormField
            {...getFormField("phone")!}
            control={form.control}
            disabled={!!user.name}
          />
        </div>

        {/* Row 3: DOB & Gender */}
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            {...getFormField("birthDate")!}
            control={form.control}
          />
          <CustomFormField
            {...getFormField("gender")!}
            control={form.control}
            renderSkeleton={(field) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='flex h-11 gap-6 xl:justify-between'>
                {genderOptions.map((option) => (
                  <div key={option} className='radio-group'>
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className='cursor-pointer'>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        {/* Row 4: Address & Occupation */}
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            {...getFormField("address")!}
            control={form.control}
          />
          <CustomFormField
            {...getFormField("occupation")!}
            control={form.control}
          />
        </div>

        {/* Row 5: Emergency contact name & Emergency contact number */}
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            {...getFormField("emergencyContactName")!}
            control={form.control}
          />
          <CustomFormField
            {...getFormField("emergencyContactNumber")!}
            control={form.control}
          />
        </div>
      </section>

      {/* Medical Information */}
      <section className='space-y-6'>
        <h2 className='mb-9 sub-header'>Medical information</h2>

        {/* Row 6: primary physician */}
        <CustomFormField
          {...getFormField("primaryPhysician")!}
          control={form.control}
          renderValue={(value) => {
            const doctor = doctors.find((d) => d.name === value);
            if (!doctor) return <span>Select a physician</span>;

            return (
              <div className='flex items-center gap-2'>
                <Image
                  src={doctor.image}
                  height={24}
                  width={24}
                  alt={doctor.name}
                  className='rounded-full border border-dark-500'
                />
                <p>{doctor.name}</p>
              </div>
            );
          }}>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className='flex items-center gap-2 cursor-pointer'>
                <Image
                  src={doctor.image}
                  height={24}
                  width={24}
                  alt={doctor.name}
                  className='rounded-full border border-dark-500'
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        {/* Row 7: insurance provider & insurance policy number */}
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            {...getFormField("insuranceProvider")!}
            control={form.control}
          />
          <CustomFormField
            {...getFormField("insurancePolicyNumber")!}
            control={form.control}
          />
        </div>

        {/* Row 8: Allergies & Current medication */}
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            {...getFormField("allergies")!}
            control={form.control}
          />
          <CustomFormField
            {...getFormField("currentMedication")!}
            control={form.control}
          />
        </div>

        {/* Row 9: Family medical history & Past medical history */}
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            {...getFormField("familyMedicalHistory")!}
            control={form.control}
          />
          <CustomFormField
            {...getFormField("pastMedicalHistory")!}
            control={form.control}
          />
        </div>
      </section>

      {/* Identification */}
      <section className='space-y-6'>
        <h2 className='mb-9 sub-header'>Identification and Verification</h2>

        {/* Row 10: Identification Type */}
        <CustomFormField
          {...getFormField("identificationType")!}
          control={form.control}>
          {identificationTypes.map((identification) => (
            <SelectItem key={identification} value={identification}>
              {identification}
            </SelectItem>
          ))}
        </CustomFormField>

        {/* Row 11: Identification number */}
        <CustomFormField
          {...getFormField("identificationNumber")!}
          control={form.control}
        />

        {/* Row 12: Identification document */}
        <CustomFormField
          {...getFormField("identificationDocument")!}
          control={form.control}
          renderSkeleton={(field) => (
            <div>
              <FileUploader files={field.value} onChange={field.onChange} />
            </div>
          )}
        />
      </section>

      {/* Consent and Privacy */}
      <section className='space-y-6'>
        <h2 className='mb-9 sub-header'>Consent and Provacy</h2>

        {/* Row 13: Treatment consent */}
        <CustomFormField
          {...getFormField("treatmentConsent")!}
          control={form.control}
        />

        {/* Row 14: Disclosure consent */}
        <CustomFormField
          {...getFormField("disclosureConsent")!}
          control={form.control}
        />
        {/* Row 15: Privacy consent */}
        <CustomFormField
          {...getFormField("privacyConsent")!}
          control={form.control}
        />
      </section>

      <Field orientation='horizontal'>
        <SubmitButton isPending={isPending}>Get Started</SubmitButton>
      </Field>
    </form>
  );
}

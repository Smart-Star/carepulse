"use client";

import {
  cn,
  getAppointmentButtonLabel,
  getAppointmentStatus,
} from "@/lib/utils";

import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { SelectItem } from "../ui/select";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { SubmitButton } from "../submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormField } from "../custom-form-field";
import { getAppointmentSchema } from "@/lib/schema/validation";
import { createAppointment } from "@/actions/appointment.actions";
import { createAppointmentFormControls, doctors } from "@/lib/constants";

type Props = {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
};

export function AppointmentForm({ type, userId, patientId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const appointmentFormSchema = getAppointmentSchema(type);
  const buttonLabel = getAppointmentButtonLabel(type);

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      primaryPhysician: "",
      appointmentDate: new Date(),
      appointmentReason: "",
      additionalComments: "",
      cancellationReason: "",
    },
  });

  async function onSubmit(data: z.infer<typeof appointmentFormSchema>) {
    startTransition(async () => {
      const appointmentStatus = getAppointmentStatus(type);

      try {
        if (type === "create" && patientId) {
          const appointmentData = {
            ...data,
            userId,
            patient: patientId,
            appointmentDate: new Date(data.appointmentDate),
            appointmentStatus,
          };

          const newAppointment = await createAppointment(appointmentData);

          if (newAppointment?.success) {
            router.push(
              `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.data?.$id}`,
            );
            toast(newAppointment?.message);
            form.reset();
          } else {
            toast(newAppointment?.message || "Something went wrong");
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  // This looks up the configuration for a specific field by its name
  const getFormField = (name: string) =>
    createAppointmentFormControls.find(
      (formControl) => formControl.name === name,
    );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-6'>
      <header className='mb-12 space-y-4'>
        <h1 className='header'>Hey there 👋</h1>
        <p className='text-dark-700'>
          Request a new appointment in 10 secconds.
        </p>
      </header>

      <section className='space-y-6'>
        {type !== "cancel" && (
          <>
            {/* Row 1: Select doctor */}
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

            {/* Row 2: Expected appointment date */}
            <CustomFormField
              {...getFormField("appointmentDate")!}
              control={form.control}
              showTimeSelect
              dateFormat='dd/MM/yyyy - h:mm aa'
            />

            {/* Row 3: Appointment reason & Comments */}
            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                {...getFormField("appointmentReason")!}
                control={form.control}
              />
              <CustomFormField
                {...getFormField("additionalComments")!}
                control={form.control}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <>
            <CustomFormField
              {...getFormField("cancellationReason")!}
              control={form.control}
            />
          </>
        )}
      </section>

      <Field orientation='horizontal'>
        <SubmitButton
          isPending={isPending}
          className={cn(
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn",
            "w-full",
          )}>
          {buttonLabel}
        </SubmitButton>
      </Field>
    </form>
  );
}

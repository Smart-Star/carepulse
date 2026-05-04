"use client";

import {
  cn,
  getAppointmentButtonLabel,
  getAppointmentStatus,
} from "@/lib/utils";

import {
  createAppointment,
  updateAppointment,
} from "@/actions/appointment.actions";

import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { SelectItem } from "../ui/select";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { SubmitButton } from "../submit-button";
import { Appointment } from "@/types/models.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormField } from "../custom-form-field";
import { getAppointmentSchema } from "@/lib/schema/validation";
import { createAppointmentFormControls, doctors } from "@/lib/constants";

type Props = {
  userId: string;
  patientId: string;
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
  type: "create" | "cancel" | "schedule";
};

export function AppointmentForm({
  type,
  userId,
  patientId,
  appointment,
  setOpen,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const appointmentFormSchema = getAppointmentSchema(type);
  const buttonLabel = getAppointmentButtonLabel(type);

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      appointmentDate: appointment
        ? new Date(appointment?.appointmentDate)
        : new Date(),
      appointmentReason: appointment?.appointmentReason || "",
      additionalComments: appointment?.additionalComments || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  async function onSubmit(data: z.infer<typeof appointmentFormSchema>) {
    startTransition(async () => {
      const appointmentStatus = getAppointmentStatus(type);

      try {
        if (type === "create" && patientId) {
          const createAppointmentData = {
            ...data,
            userId,
            patient: patientId,
            appointmentDate: new Date(data.appointmentDate),
            appointmentStatus,
          };

          const newAppointment = await createAppointment(createAppointmentData);

          if (newAppointment?.success) {
            router.push(
              `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.data?.$id}`,
            );
            toast(newAppointment?.message);
            form.reset();
          } else {
            toast(newAppointment?.message || "Something went wrong");
          }
        } else {
          if (!appointment?.$id) return;

          const updateAppointmentData = {
            userId,
            appointmentId: appointment?.$id,
            appointment: {
              primaryPhysician: data?.primaryPhysician,
              cancellationReason: data?.cancellationReason,
              appointmentDate: new Date(data.appointmentDate),
              appointmentStatus,
            },
            type,
          };

          const updatedAppointment = await updateAppointment(
            updateAppointmentData,
          );

          console.log("updated appointment response:", updatedAppointment);

          if (updatedAppointment.success) {
            setOpen?.(false);
            form.reset();
            toast(updatedAppointment?.message);
          } else {
            toast(updatedAppointment?.message || "Something went wrong");
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
      {type === "create" && (
        <header className='mb-12 space-y-4'>
          <h1 className='header'>Hey there 👋</h1>
          <p className='text-dark-700'>
            Request a new appointment in 10 secconds.
          </p>
        </header>
      )}

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

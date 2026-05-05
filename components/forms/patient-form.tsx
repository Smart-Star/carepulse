"use client";

import {
  loginPatientFormControls,
  registerPatientFormControls,
} from "@/lib/constants";

import * as z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { SubmitButton } from "../submit-button";
import { getAuthButtonLabel } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormField } from "../custom-form-field";
import { getUserFormSchema } from "@/lib/schema/validation";
import { createUser, loginUser } from "@/actions/patient.actions";

type Props = {
  type: "login" | "register";
};

export function PatientForm({ type }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const userFormSchema = getUserFormSchema(type);
  const buttonLabel = getAuthButtonLabel(type);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(data: z.infer<typeof userFormSchema>) {
    startTransition(async () => {
      try {
        if (type === "register") {
          const userData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
          };

          const newUser = await createUser(userData);
          if (newUser?.success) {
            router.push(`/patients/${newUser?.data.$id}/register`);
            toast(newUser.message);
          } else {
            toast(newUser?.message || "Something went wrong");
          }
        } else {
          const existingUserData = {
            email: data.email,
            phone: data.phone,
          };

          const existingUser = await loginUser(existingUserData);
          if (existingUser?.success) {
            router.push(`/patients/${existingUser?.data.$id}/new-appointment`);
            toast(existingUser.message);
          } else {
            toast(existingUser?.message || "Something went wrong");
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-6'>
      <section className='mb-12 space-y-4'>
        <h1 className='header'>
          {type === "register" ? "Hi there 👋" : "Welcome back 👋"}
        </h1>
        <p className='text-dark-700'>
          {type === "register"
            ? "Schedule your first appointment."
            : "Login to schedule an appointment."}
        </p>
      </section>

      {type === "register"
        ? registerPatientFormControls.map((formControl) => (
            <CustomFormField
              key={formControl.name}
              fieldType={formControl.fieldType}
              control={form.control}
              name={formControl.name}
              label={formControl.label}
              placeholder={formControl.placeholder}
              iconSrc={formControl.iconSrc}
              iconAlt={formControl.iconAlt}
            />
          ))
        : loginPatientFormControls.map((formControl) => (
            <CustomFormField
              key={formControl.name}
              fieldType={formControl.fieldType}
              control={form.control}
              name={formControl.name}
              label={formControl.label}
              placeholder={formControl.placeholder}
              iconSrc={formControl.iconSrc}
              iconAlt={formControl.iconAlt}
            />
          ))}

      <Field orientation='horizontal'>
        <SubmitButton isPending={isPending}>{buttonLabel}</SubmitButton>
      </Field>
    </form>
  );
}

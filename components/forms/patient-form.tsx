"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { SubmitButton } from "../submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormControls } from "@/lib/constants";
import { CustomFormField } from "../custom-form-field";
import { CreateUser } from "@/actions/patient.actions";
import { userFormSchema } from "@/lib/schema/validation";

export function PatientForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        const userData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
        };

        const newUser = await CreateUser(userData);
        if (newUser?.success) {
          router.push(`/patients/${newUser?.data.$id}/register`);
          toast(newUser.message);
        } else {
          toast(newUser?.message || "Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-6'>
      <section className='mb-12 space-y-4'>
        <h1 className='header'>Hi there 👋</h1>
        <p className='text-dark-700'>Schedule your first appointment.</p>
      </section>

      {patientFormControls.map((formControl) => (
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
        <SubmitButton isPending={isPending}>Get Started</SubmitButton>
      </Field>
    </form>
  );
}

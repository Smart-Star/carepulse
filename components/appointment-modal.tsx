"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import clsx from "clsx";
import { useState } from "react";
import { buttonVariants } from "./ui/button";
import { Appointment } from "@/types/models.types";
import { AppointmentForm } from "./forms/appointment-form";

type Props = {
  userId: string;
  patientId: string;
  appointment: Appointment;
  type: "schedule" | "cancel";
};

export function AppointmentModal({
  type,
  userId,
  patientId,
  appointment,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={clsx(buttonVariants({ variant: "ghost" }), "capitalize", {
          "text-green-500": type === "schedule",
          "text-red-500": type === "cancel",
        })}>
        {type}
      </DialogTrigger>
      <DialogContent className='shad-dialog sm:max-w-lg'>
        <DialogHeader className='mb-4 space-y-3'>
          <DialogTitle className='capitalize'>{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} an appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          type={type}
          userId={userId}
          patientId={patientId}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

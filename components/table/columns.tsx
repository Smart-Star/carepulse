"use client";

import Image from "next/image";
import { doctors } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "../status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/types/models.types";
import { AppointmentModal } from "../appointment-modal";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className='text-14-medium'>{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <p className='text-14-medium'>{row.original.patient.name}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className='min-w-28.75'>
        <StatusBadge status={row.original.appointmentStatus} />
      </div>
    ),
  },
  {
    accessorKey: "appointmentDate",
    header: "Appointment",
    cell: ({ row }) => (
      <p className='text-14-regular min-w-25'>
        <span>{formatDateTime(row.original.appointmentDate).dateTime}</span>
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = doctors.find(
        (d) => d.name === row.original.primaryPhysician,
      );

      return (
        <div className='flex items-center gap-3'>
          <Image
            src={doctor?.image ?? ""}
            width={100}
            height={100}
            alt={doctor?.name ?? ""}
            className='size-8'
          />
          <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className='pl-4'>Actions</div>,
    cell: ({ row }) => (
      <div className='flex gap-1'>
        <AppointmentModal
          type='schedule'
          appointment={row.original}
          userId={row.original.userId}
          patientId={row.original.patient.$id}
        />
        <AppointmentModal
          type='cancel'
          appointment={row.original}
          userId={row.original.userId}
          patientId={row.original.patient.$id}
        />
      </div>
    ),
  },
];

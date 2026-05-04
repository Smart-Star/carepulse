import clsx from "clsx";
import Image from "next/image";
import { statusIcon } from "@/lib/constants";
import { AppointmentStatus } from "@/types/models.types";

type Props = {
  status: AppointmentStatus;
};

export function StatusBadge({ status }: Props) {
  return (
    <div
      className={clsx("status-badge", {
        "bg-blue-600": status === "Pending",
        "bg-red-600": status === "Cancelled",
        "bg-green-600": status === "Scheduled",
      })}>
      <Image
        src={statusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className='h-fit w-3'
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-blue-500": status === "Pending",
          "text-red-500": status === "Cancelled",
          "text-green-500": status === "Scheduled",
        })}>
        {status}
      </p>
    </div>
  );
}

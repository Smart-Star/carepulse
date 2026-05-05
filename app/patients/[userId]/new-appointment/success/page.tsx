import Link from "next/link";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
import { doctors } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import { getUser } from "@/actions/patient.actions";
import { buttonVariants } from "@/components/ui/button";
import { getAppointment } from "@/actions/appointment.actions";

type Props = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Success({ params, searchParams }: Props) {
  const { userId } = await params;
  const appointmentId = (await searchParams).appointmentId as string;

  const user = await getUser(userId);
  const appointment = await getAppointment(appointmentId);
  const doctor = doctors.find((d) => d.name === appointment?.primaryPhysician);

  Sentry.metrics.count("user_view_appointment-success", user.name);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link href='/'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt='logo'
            className='h-10 w-fit'
          />
        </Link>

        {/* Appointment success message */}
        <section className='flex flex-col items-center'>
          <Image
            src='/assets/gifs/success.gif'
            height={300}
            width={200}
            alt='success'
          />
          <h2 className='header mb-6 max-w-150 text-center'>
            Your <span className='text-green-500'>appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm</p>
        </section>

        {/* Appointment details */}
        <section className='request-details'>
          <p>Requested appointment details:</p>
          <div className='flex items-center gap-3'>
            <Image
              src={doctor?.image ?? ""}
              height={100}
              width={100}
              alt='doctor'
              className='size-6'
            />
            <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
          </div>
          <div className='flex gap-2'>
            <Image
              src='/assets/icons/calendar.svg'
              height={24}
              width={24}
              alt='calendar'
            />
            <p>{formatDateTime(appointment?.appointmentDate).dateTime}</p>
          </div>
        </section>

        <Link
          href={`/patients/${userId}/new-appointment`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shad-primary-btn",
          )}>
          New Appointment
        </Link>

        <p className='copyright'>© 2026 CarePulse</p>
      </div>
    </div>
  );
}

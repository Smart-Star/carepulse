import Image from "next/image";
import { getPatient } from "@/actions/patient.actions";
import { AppointmentForm } from "@/components/forms/appointment-form";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function NewAppointment({ params }: Props) {
  const { userId } = await params;
  const patient = await getPatient(userId);

  return (
    <div className='flex h-screen max-h-screen'>
      <section className='remove-scrollbar container my-auto'>
        <div className='sub-container max-w-215 flex-1 justify-between'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt='patient'
            className='mb-12 h-10 w-fit'
          />

          <AppointmentForm
            type='create'
            userId={userId}
            patientId={patient.$id}
          />

          <p className='copyright mt-10'>© 2026 CarePulse</p>
        </div>
      </section>

      <Image
        src='/assets/images/appointment-img.png'
        height={1000}
        width={1000}
        alt='appointment'
        className='side-img w-97.5 bg-bottom'
      />
    </div>
  );
}

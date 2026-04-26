import Image from "next/image";
import { getUser } from "@/actions/patient.actions";
import { RegisterForm } from "@/components/forms/register-form";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function Register({ params }: Props) {
  const { userId } = await params;
  const user = await getUser(userId);

  return (
    <div className='flex h-screen max-h-screen'>
      <section className='remove-scrollbar container overflow-y-auto h-full'>
        <div className='sub-container max-w-215 flex-1'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt='patient'
            className='mb-12 h-10 w-fit'
          />

          <RegisterForm user={user} />

          <p className='copyright py-12'>© 2026 CarePulse</p>
        </div>
      </section>

      <Image
        src='/assets/images/register-img.png'
        height={1000}
        width={1000}
        alt='patient'
        className='side-img w-97.5'
      />
    </div>
  );
}

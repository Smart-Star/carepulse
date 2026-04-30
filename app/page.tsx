import Link from "next/link";
import Image from "next/image";
import { PasskeyModal } from "@/components/passkey-modal";
import { PatientForm } from "@/components/forms/patient-form";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const isAdmin = (await searchParams).admin as string;

  return (
    <div className='flex h-screen max-h-screen'>
      {isAdmin && <PasskeyModal />}

      <section className='remove-scrollbar container my-auto'>
        <div className='sub-container max-w-124'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt='patient'
            className='mb-12 h-10 w-fit'
          />

          <PatientForm />

          <div className='text-14-regular mt-20 flex justify-between'>
            <p className='justify-items-end text-dark-600 xl:text-left'>
              © 2026 CarePulse
            </p>
            <Link href='/?admin=true' className='text-green-500'>
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src='/assets/images/onboarding-img.png'
        height={1000}
        width={1000}
        alt='patient'
        className='side-img w-1/2'
      />
    </div>
  );
}

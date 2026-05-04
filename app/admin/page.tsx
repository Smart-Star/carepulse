import Link from "next/link";
import Image from "next/image";
import { adminStat } from "@/lib/constants";
import { StatCard } from "@/components/stat-card";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { getRecentAppointmentList } from "@/actions/appointment.actions";

export default async function Admin() {
  const appointments = await getRecentAppointmentList();

  return (
    <div className='flex flex-col space-y-14 max-w-7xl mx-auto'>
      <header className='admin-header'>
        <Link href='/'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={32}
            width={162}
            alt='logo'
            className='h-8 w-fit'
          />
        </Link>
        <div className='flex items-center gap-4'>
          <p className='text-16-semibold'>Admin</p>
          <Image
            src='/assets/images/admin.png'
            height={32}
            width={32}
            alt='admin'
          />
        </div>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Welcome 👋</h1>
          <p className='text-dark-700'>
            Start the day with managing new appointments
          </p>
        </section>

        <section className='admin-stat'>
          {adminStat.map((stat) => (
            <StatCard
              key={stat.type}
              type={stat.type}
              count={
                stat.type === "appointments"
                  ? appointments?.scheduledCount
                  : stat.type === "pending"
                    ? appointments?.pendingCount
                    : stat.type === "cancelled"
                      ? appointments?.cancelledCount
                      : null
              }
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </section>

        {appointments && appointments.rows.length > 0 && (
          <DataTable data={appointments.rows} columns={columns} />
        )}
      </main>
    </div>
  );
}

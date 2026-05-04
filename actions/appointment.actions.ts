"use server";

import {
  tablesDB,
  DATABASE_ID,
  APPOINTMENT_TABLE_ID,
  PATIENT_TABLE_ID,
  messaging,
} from "@/lib/appwrite/appwrite.config";

import {
  CreateAppointmentParams,
  UpdateAppointmentParams,
} from "@/types/inputs.types";

import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { formatDateTime, parseStringify } from "@/lib/utils";
import { Appointment } from "@/types/models.types";

export const createAppointment = async (
  appointmentData: CreateAppointmentParams,
) => {
  try {
    const newAppointment = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      rowId: ID.unique(),
      data: {
        ...appointmentData,
      },
    });

    if (newAppointment) {
      return {
        success: true,
        data: parseStringify(newAppointment),
        message: `Appointment created successfully.`,
      };
    }
  } catch (error) {
    console.log(`Error creating appointment:`, error);

    return {
      success: false,
      message: "Something went wrong! Unable to create appointmentt.",
    };
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await tablesDB.getRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      rowId: appointmentId,
    });

    if (appointment) return parseStringify(appointment);
  } catch (error) {
    console.log(`Error fetching appointment. ${error}`);

    return {
      success: false,
      message: "Something went wrong! Unable to get appointment.",
    };
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      queries: [Query.orderDesc("$createdAt")],
    });

    const patients = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_TABLE_ID!,
    });

    const patientMap = new Map(patients.rows.map((p: any) => [p.$id, p]));

    // Enrich appointments with patient data (appwrite doesn't support joins, so we do it manually here)
    const enrichedAppointments = appointments.rows.map((appointment: any) => ({
      ...appointment,
      patient: patientMap.get(appointment.patient) || null,
    }));

    let scheduledCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    for (const appointment of enrichedAppointments as unknown as Appointment[]) {
      if (appointment.appointmentStatus === "Pending") {
        pendingCount++;
      } else if (appointment.appointmentStatus === "Scheduled") {
        scheduledCount++;
      } else if (appointment.appointmentStatus === "Cancelled") {
        cancelledCount++;
      }
    }

    return parseStringify({
      scheduledCount,
      pendingCount,
      cancelledCount,
      rows: enrichedAppointments,
      totalCount: appointments.total,
    });
  } catch (error) {
    console.log("Error fetching appointment list:", error);

    return {
      success: false,
      message: "Something went wrong! Unable to get appointment list.",
    };
  }
};

export const updateAppointment = async (
  updateAppointmentData: UpdateAppointmentParams,
) => {
  try {
    const updateAppointment = await tablesDB.updateRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      rowId: updateAppointmentData.appointmentId,
      data: {
        ...updateAppointmentData.appointment,
      },
    });

    if (!updateAppointment) {
      throw new Error("Appointment not found.");
    }

    // SMS notification
    const smsMessage = `
      Hi, it's CarePulse.
      ${
        updateAppointmentData?.type === "schedule"
          ? `Your appointment has been .scheduled for ${formatDateTime(updateAppointmentData!.appointment!.appointmentDate!).dateTime} with Dr. ${updateAppointmentData.appointment.primaryPhysician}.`
          : `We regret to inform you that your appointment has been cancelled for the following reason ${updateAppointmentData!.appointment!.cancellationReason!}. Please contact us to reschedule.`
      }`;

    await sendSMSnotification(updateAppointmentData.userId, smsMessage);

    revalidatePath("/admin");
    return {
      success: true,
      data: parseStringify(updateAppointment),
      message: `Appointment updated successfully.`,
    };
  } catch (error) {
    console.log("Error updating appointment:", error);

    return {
      success: false,
      message: "Something went wrong! Unable to update appointment.",
    };
  }
};

export const sendSMSnotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSMS({
      messageId: ID.unique(),
      content: content,
      users: [userId],
    });

    return {
      success: true,
      data: parseStringify(message),
      message: `SMS notification sent successfully.`,
    };
  } catch (error) {
    console.log("Error sending SMS notification:", error);

    return {
      success: false,
      message: "Something went wrong! Unable to send SMS notification.",
    };
  }
};

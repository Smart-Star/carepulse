"use server";

import {
  tablesDB,
  DATABASE_ID,
  APPOINTMENT_TABLE_ID,
} from "@/lib/appwrite/appwrite.config";

import { ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { CreateAppointmentParams } from "@/types/inputs.types";

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

    if (appointment) return parseStringify(appointment.$id);
  } catch (error) {
    console.log(`Error fetching appointment. ${error}`);

    return {
      success: false,
      message: "Something went wrong! Unable to get appointment.",
    };
  }
};

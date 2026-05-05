"use server";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_TABLE_ID,
  PROJECT_ID,
  storage,
  tablesDB,
  users,
} from "@/lib/appwrite/appwrite.config";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";
import { CreateUserParams, RegisterUserParams } from "@/types/inputs.types";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create({
      userId: ID.unique(),
      email: user.email,
      phone: user.phone,
      password: undefined,
      name: user.name,
    });

    if (newUser) {
      return {
        success: true,
        data: parseStringify(newUser),
        message: `Account created successfully. ${newUser.name}, you can now schedule your first appointment!`,
      };
    }
  } catch (error: any) {
    // check if user already exists (409)
    if (error?.code === 409) {
      console.error("User already exists:", error);

      return {
        success: false,
        message: "An account with this email already exists.",
      };
    } else {
      console.error("Error creating user:", error);

      return {
        success: false,
        message: "Something went wrong while creating the account.",
      };
    }
  }
};

export const loginUser = async (user: CreateUserParams) => {
  try {
    const getExistingusers = await users.list({
      queries: [
        Query.equal("email", [user.email]),
        Query.equal("phone", [user.phone]),
      ],
    });
    if (getExistingusers?.total > 0) {
      return {
        success: true,
        data: parseStringify(getExistingusers.users[0]),
        message: `Login successfully ${getExistingusers.users[0].name}.`,
      };
    }
  } catch (error) {
    console.log(`Error fetching user. ${error}`);

    return {
      success: false,
      message: "Something went wrong! Unable to get user.",
    };
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get({
      userId: userId,
    });

    if (user) return parseStringify(user);
  } catch (error) {
    console.log(`Error fetching user. ${error}`);

    return {
      success: false,
      message: "Something went wrong! Unable to get user.",
    };
  }
};

export const registerPatient = async (patient: RegisterUserParams) => {
  try {
    const { identificationDocument, ...patientData } = patient;

    let file;

    if (identificationDocument) {
      const arrayBuffer = await identificationDocument.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const inputFile = InputFile.fromBuffer(
        buffer,
        identificationDocument.name,
      );

      // node-appwrite v24 uses an object-parameter signature here.
      file = await storage.createFile({
        bucketId: BUCKET_ID!,
        fileId: ID.unique(),
        file: inputFile,
      });
    }

    const newPatient = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_TABLE_ID!,
      rowId: ID.unique(),
      data: {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patientData,
      },
    });

    if (newPatient) {
      return {
        success: true,
        data: parseStringify(newPatient),
        message: `Your information has been saved successfully.`,
      };
    }
  } catch (error) {
    console.log(`Error registering patient:`, error);

    return {
      success: false,
      message: "Something went wrong! Unable to register patient.",
    };
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_TABLE_ID!,
      queries: [Query.equal("userId", [userId])],
    });

    if (patients) return parseStringify(patients.rows[0]);
  } catch (error) {
    console.log(`Error fetching patient. ${error}`);

    return {
      success: false,
      message: "Something went wrong! Unable to get patient.",
    };
  }
};

"use server";

import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_TABLE_ID,
  PROJECT_ID,
  storage,
  users,
} from "@/lib/appwrite/appwrite.config";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";
import { CreateUserParams, RegisterUserParams } from "@/types/inputs.types";

export const CreateUser = async (user: CreateUserParams) => {
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
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return {
        success: false,
        data: parseStringify(existingUser?.users[0]),
        message: "An account with this email already exists.",
      };
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get({
      userId,
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

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    if (identificationDocument) {
      const arrayBuffer = await identificationDocument.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const inputFile = InputFile.fromBuffer(buffer, identificationDocument.name);

      // node-appwrite v24 uses an object-parameter signature here.
      file = await storage.createFile({
        bucketId: BUCKET_ID!,
        fileId: ID.unique(),
        file: inputFile,
      });
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return {
      success: true,
      data: parseStringify(newPatient),
      message: `Your information has been saved successfully.`,
    };
  } catch (error) {
    console.log(`Error fetching user. ${error}`);

    return {
      success: false,
      message: "Something went wrong! Unable to get user.",
    };
  }
};

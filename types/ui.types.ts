import { FieldPath, FieldValues } from "react-hook-form";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export type FormControlType<T extends FieldValues> = {
  name: FieldPath<T>;
  fieldType: FormFieldType;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
};

export interface AdminStat {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
}

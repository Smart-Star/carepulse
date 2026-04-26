"use client";

import {
  Control,
  FieldPath,
  Controller,
  FieldValues,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import DatePicker from "react-datepicker";
import "react-phone-number-input/style.css";
import { Input } from "@/components/ui/input";
import { FormFieldType } from "@/types/ui.types";
import PhoneInput from "react-phone-number-input";
import "react-datepicker/dist/react-datepicker.css";
import type { Value as E164Number } from "react-phone-number-input";

// renderSkeleton?: (field: ControllerRenderProps<T, FieldPath<T>>) => ReactNode;
type CustomFormProps<T extends FieldValues> = {
  control: Control<T>;
  fieldType: FormFieldType;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: ReactNode;
  renderSkeleton?: (field: any) => ReactNode;
  renderValue?: (value: any) => ReactNode;
};

type RenderFieldProps<T extends FieldValues> = {
  formProps: CustomFormProps<T>;
  fieldState: ControllerFieldState;
  field: ControllerRenderProps<T, FieldPath<T>>;
};

const RenderFormField = <T extends FieldValues>({
  field,
  formProps,
  fieldState,
}: RenderFieldProps<T>) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    name,
    dateFormat,
    showTimeSelect,
    renderSkeleton,
    children,
    renderValue,
    label,
  } = formProps;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className='rounded-md border border-dark-500 bg-dark-400 relative'>
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className='absolute top-1/2 left-5 -translate-x-1/2 -translate-y-1/2 w-auto h-auto'
            />
          )}
          <Input
            {...field}
            id={name}
            name={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            className={cn("shad-input border-0", iconSrc && "pl-11")}
          />
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry='US'
          placeholder={placeholder}
          international
          withCountryCallingCode
          value={field.value as E164Number | undefined}
          onChange={field.onChange}
          className='input-phone'
        />
      );
    case FormFieldType.TEXTAREA:
      return (
        <Textarea
          {...field}
          id={name}
          name={name}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          className='min-h-28 shad-textArea'
        />
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400 relative'>
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className='ml-2 w-6'
            />
          )}
          <DatePicker
            selected={field.value}
            onChange={(date: Date | null) => field.onChange(date)}
            dateFormat={dateFormat ?? "dd/MM/yyyy"}
            showTimeSelect={showTimeSelect ?? false}
            timeInputLabel='Time:'
            wrapperClassName='date-picker h-full'
          />
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className='shad-select-trigger'>
            {renderValue ? (
              renderValue(field.value)
            ) : (
              <SelectValue placeholder={placeholder} />
            )}
          </SelectTrigger>
          <SelectContent className='shad-select-content'>
            <SelectGroup>{children}</SelectGroup>
          </SelectContent>
        </Select>
      );
    case FormFieldType.CHECKBOX:
      return (
        <div className='flex items-center gap-4'>
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <Label htmlFor={name} className='checkbox-label'>
            {label}
          </Label>
        </div>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    default:
      break;
  }
};

export function CustomFormField<T extends FieldValues>(
  formProps: CustomFormProps<T>,
) {
  const { control, fieldType, name, label } = formProps;

  return (
    <FieldGroup>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className='flex-1'>
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
            )}

            <RenderFormField
              field={field}
              fieldState={fieldState}
              formProps={formProps}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}

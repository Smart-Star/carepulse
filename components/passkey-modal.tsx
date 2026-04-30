"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { X } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";
import { MouseEvent, useEffect, useState } from "react";

const INPUT_OTP_LENGTH = 6;

export function PasskeyModal() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("accessKey");

    if (storedKey) {
      const decrypted = decryptKey(storedKey);

      if (decrypted === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        router.push("/admin");
      } else {
        localStorage.removeItem("accessKey");
      }
    }
  }, [router]);

  const setOnchange = (value: string) => {
    setPasskey(value);
    setError(false);
  };

  const closeModal = () => {
    setOpen(false);
    setError(false);
    router.push("/");
  };

  const validatePasskey = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();

    if (passkey.length !== INPUT_OTP_LENGTH) {
      setError(true);
      return;
    }

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);

      setIsPending(true);
      setOpen(false);
      setError(false);
      router.push("/admin");
    } else {
      setIsPending(false);
      setError(true);
      setPasskey("");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='shad-alert-dialog min-w-fit'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center justify-between w-full'>
            Admin access verification
            <X onClick={closeModal} className='size-5 cursor-pointer' />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP
          maxLength={INPUT_OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          value={passkey}
          onChange={(value) => setOnchange(value)}>
          <InputOTPGroup className='shad-otp'>
            {[...Array(INPUT_OTP_LENGTH)].map((_, index) => (
              <div key={`input-otp-${index}`}>
                <InputOTPSlot
                  index={index}
                  aria-invalid={!!error}
                  className='size-16 border border-dark-500 rounded-lg text-36-bold!'
                />
              </div>
            ))}
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter className='bg-transparent'>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => validatePasskey(e)}
            className='shad-primary-btn w-full'>
            {isPending ? (
              <div className='flex items-center gap-4'>
                <Spinner /> Loading...
              </div>
            ) : (
              <>Enter Admin Passkey</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

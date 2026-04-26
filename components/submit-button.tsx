import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type Props = {
  isPending: boolean;
  className?: string;
  children: ReactNode;
};

export function SubmitButton({ isPending, className, children }: Props) {
  return (
    <Button
      type='submit'
      disabled={isPending}
      className={className ?? "shad-primary-btn w-full"}>
      {isPending ? (
        <div className='flex items-center gap-4'>
          <Spinner /> Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

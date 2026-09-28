import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

type DeleteDialogProps = {
  children: React.ReactNode;
  isDeleting: boolean;
  onDelete: () => void;
  title: string;
  description: string;
};

export default function DeleteDialog({
  children,
  onDelete,
  isDeleting,
  title,
  description,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-destructive! inline-flex items-center gap-1 whitespace-nowrap text-white"
          >
            {isDeleting ? (
              <>
                <Spinner className="size-3.5 shrink-0" />
                <span>Deleting</span>
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

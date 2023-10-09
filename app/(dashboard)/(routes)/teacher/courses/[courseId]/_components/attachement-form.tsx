"use client";

import * as z from "zod";
import axios from "axios";
import { File, Key, Loader2, PlusCircle, X } from "lucide-react";
import { Attachement, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";

interface AttachementFormProps {
  initialData: Course & { attachement: Attachement[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});
export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachementFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      await axios.post(`/api/courses/${courseId}/attachements`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`api/courses/${courseId}/attachements/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachement
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachement.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachements yet
            </p>
          )}
          {initialData.attachement.length > 0 && (
            <div className="space-y-2">
              {initialData.attachement.map((attachement) => (
                <div
                  key={attachement.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachement.name}</p>
                  {deletingId === attachement.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin ml-auto order-1" />
                    </div>
                  )}
                  {deletingId !== attachement.id && (
                    <button
                      onClick={() => onDelete(attachement.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachement"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;

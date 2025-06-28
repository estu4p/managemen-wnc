"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import NotePage from "../note/page";
import FormNote from "@/components/note/FormNote";
import { Note } from "@/lib/notes";

const addNotePage = () => {
  const [openButtonSaveNote, setOpenButtonSaveNote] = useState(false);
  const [note, setNote] = useState<Note>({
    id: "",
    incomingOrder: new Date(),
    estimatedCompletion: new Date(new Date().setDate(new Date().getDate() + 2)),
    customer: {
      id: "",
      name: "",
      phone: "",
      totalNotes: 0,
      totalItems: 0,
    },
    items: [
      {
        id: "1",
        name: "",
        category: "",
        material: "",
        size: "",
        color: "",
        service: "",
        notes: "",
        status: 0,
        images: [],
        price: 0,
      },
    ],
    paymentStatus: "Unpaid",
    notes: "",
    totalPrice: 0,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-0">
      {/* left */}
      <div className="px-4 sm:px-7 pt-4 border-r border-r-border">
        <h1 className="text-lg font-medium">Create New Note</h1>
        <p className="font-medium mt-1">Fill in the note with details</p>
        {/* form */}
        <FormNote note={note} setNote={setNote} />
      </div>
      {/* right */}
      <div className="bg-accent">
        <div className="px-4 py-4 flex items-center justify-between border-b border-b-border bg-background">
          <h1 className="text-lg font-medium">Preview</h1>
          <DropdownMenu
            onOpenChange={setOpenButtonSaveNote}
            open={openButtonSaveNote}
          >
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary-green hover:bg-primary-green/90 p-0">
                Save Note
                <Separator orientation="vertical" />
                <ChevronDown
                  className={cn(
                    "transition-transform duration-200",
                    openButtonSaveNote ? "rotate-180" : ""
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Send Note</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Print Note</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="">
          <NotePage note={note} />
        </div>
      </div>
    </div>
  );
};

export default addNotePage;

"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

interface DatePickerProps {
  label: string;
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  error?: any;
  placeholder?: string;
  maxDate?: Date;
}

export default function DatePicker({
  label,
  date,
  onSelect,
  error,
  placeholder = "Seleccionar",
  maxDate,
}: DatePickerProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-11",
              !date && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive/20"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={(d) => (maxDate ? d > maxDate : false)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}
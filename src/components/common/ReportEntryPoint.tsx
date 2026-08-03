/** @format */

"use client";

import Link from "next/link";
import { Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReportEntryPointProps {
  subject: "work" | "profile";
  label: string;
  className?: string;
}

export function ReportEntryPoint({
  subject,
  label,
  className,
}: ReportEntryPointProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Flag data-icon="inline-start" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this {subject}</DialogTitle>
          <DialogDescription>
            You are reporting “{label}”. Soma’s in-product reporting workflow is
            not connected yet, so nothing entered here is collected or sent.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm leading-6 text-foreground">
          For now, contact us with the page link and a short description of what
          happened. If someone is in immediate danger, contact local emergency
          services first.
        </p>
        <DialogFooter>
          <Button variant="outline" asChild>
            <Link href="/guidelines">Read the guidelines</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Contact Soma</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

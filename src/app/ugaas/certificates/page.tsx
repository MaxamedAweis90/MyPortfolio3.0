"use client";

import React from "react";
import { Award, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CertificatesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Certificates & Accreditations<span className="text-[#0B82EC]">.</span>
          </h1>
          <p className="text-sm text-mutedText">
            Upload and organize technical certifications, course badges, and credentials.
          </p>
        </div>

        <Button className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0B82EC]" />
            Verified Certificates
          </CardTitle>
          <CardDescription>
            Certificates showcased on the certifications section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center border border-dashed border-borderSubtle rounded-xl bg-[#111622]/50">
            <p className="text-sm text-mutedText">
              Certificates grid and manager will be loaded here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

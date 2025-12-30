"use client";

import { useLanguage } from "../language-provider";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex items-center gap-1 p-2 rounded-md hover:bg-secondary/50 transition-colors">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="uppercase text-sm">{language}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage("ar")}
          className={language === "ar" ? "bg-secondary/50" : ""}
        >
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-secondary/50" : ""}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

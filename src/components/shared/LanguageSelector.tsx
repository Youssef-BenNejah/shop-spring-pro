import { Globe } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { Language, languageNames } from "@/data/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages: { code: Language; flag: string }[] = [
  { code: "en", flag: "🇬🇧" },
  { code: "fr", flag: "🇫🇷" },
  { code: "ar", flag: "🇸🇦" },
];

const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, flag }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className={`font-body text-sm gap-2 ${language === code ? "bg-secondary font-medium" : ""}`}
          >
            <span>{flag}</span>
            <span>{languageNames[code]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;

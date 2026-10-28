import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeAndLanguageControls({ compact = false }) {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
    { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Language Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-secondary/60 hover:bg-secondary text-foreground border border-border/80 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Switch Language / تغيير اللغة"
          >
            <span className="text-sm leading-none">{currentLangObj.flag}</span>
            {!compact && <span className="font-medium hidden sm:inline">{currentLangObj.label}</span>}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 bg-popover text-popover-foreground border-border shadow-lg rounded-xl p-1 z-50">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg cursor-pointer hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-xl text-foreground bg-secondary/60 hover:bg-secondary border border-border/80 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Toggle Theme / تبديل المظهر"
        title={theme === "dark" ? "التحويل للنمط الفاتح (Light)" : "التحويل للنمط الليلي (Dark)"}
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform -rotate-12 hover:rotate-0 duration-300" />
        )}
      </button>
    </div>
  );
}

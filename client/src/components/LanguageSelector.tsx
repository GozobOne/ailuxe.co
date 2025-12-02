import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", rtl: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "fr", name: "French", nativeName: "Français", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: false },
  { code: "it", name: "Italian", nativeName: "Italiano", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: false },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: false },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: false },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: false },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", rtl: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", rtl: false },
  { code: "pl", name: "Polish", nativeName: "Polski", rtl: false },
  { code: "sv", name: "Swedish", nativeName: "Svenska", rtl: false },
  { code: "no", name: "Norwegian", nativeName: "Norsk", rtl: false },
  { code: "da", name: "Danish", nativeName: "Dansk", rtl: false },
  { code: "fi", name: "Finnish", nativeName: "Suomi", rtl: false },
  { code: "he", name: "Hebrew", nativeName: "עברית", rtl: true },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
  const selectedLanguage = LANGUAGES.find((l) => l.code === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedLanguage ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedLanguage.nativeName}</span>
              <span className="text-muted-foreground text-sm">({selectedLanguage.name})</span>
            </span>
          ) : (
            "Select language"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <span className="flex items-center gap-2">
              <span className="font-medium w-24">{language.nativeName}</span>
              <span className="text-muted-foreground">- {language.name}</span>
              {language.rtl && (
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">RTL</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Get language direction (LTR or RTL)
 */
export function getLanguageDirection(languageCode: string): "ltr" | "rtl" {
  const language = LANGUAGES.find((l) => l.code === languageCode);
  return language?.rtl ? "rtl" : "ltr";
}

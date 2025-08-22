
"use client";

import { useI18n } from "@/context/i18n-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const languages = [
  { value: 'en', label: 'English' },
  { value: 'my', label: 'Myanmar (Burmese)' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="max-w-sm">
        <Label htmlFor="language-select">{t('Select Language')}</Label>
        <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select">
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
  );
}

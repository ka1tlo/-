import React, { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: "RU", name: "Россия", dialCode: "+7", flag: "🇷🇺" },
  { code: "US", name: "США", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "Великобритания", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Германия", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "Франция", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Италия", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Испания", dialCode: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Нидерланды", dialCode: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Бельгия", dialCode: "+32", flag: "🇧🇪" },
  { code: "AT", name: "Австрия", dialCode: "+43", flag: "🇦🇹" },
  { code: "CH", name: "Швейцария", dialCode: "+41", flag: "🇨🇭" },
  { code: "SE", name: "Швеция", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Норвегия", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Дания", dialCode: "+45", flag: "🇩🇰" },
  { code: "FI", name: "Финляндия", dialCode: "+358", flag: "🇫🇮" },
  { code: "PL", name: "Польша", dialCode: "+48", flag: "🇵🇱" },
  { code: "CZ", name: "Чехия", dialCode: "+420", flag: "🇨🇿" },
  { code: "SK", name: "Словакия", dialCode: "+421", flag: "🇸🇰" },
  { code: "HU", name: "Венгрия", dialCode: "+36", flag: "🇭🇺" },
  { code: "RO", name: "Румыния", dialCode: "+40", flag: "🇷🇴" },
  { code: "BG", name: "Болгария", dialCode: "+359", flag: "🇧🇬" },
  { code: "GR", name: "Греция", dialCode: "+30", flag: "🇬🇷" },
  { code: "PT", name: "Португалия", dialCode: "+351", flag: "🇵🇹" },
  { code: "UA", name: "Украина", dialCode: "+380", flag: "🇺🇦" },
  { code: "BY", name: "Беларусь", dialCode: "+375", flag: "🇧🇾" },
  { code: "KZ", name: "Казахстан", dialCode: "+7", flag: "🇰🇿" },
  { code: "CN", name: "Китай", dialCode: "+86", flag: "🇨🇳" },
  { code: "JP", name: "Япония", dialCode: "+81", flag: "🇯🇵" },
  { code: "KR", name: "Южная Корея", dialCode: "+82", flag: "🇰🇷" },
  { code: "IN", name: "Индия", dialCode: "+91", flag: "🇮🇳" },
  { code: "AU", name: "Австралия", dialCode: "+61", flag: "🇦🇺" },
  { code: "NZ", name: "Новая Зеландия", dialCode: "+64", flag: "🇳🇿" },
  { code: "BR", name: "Бразилия", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Мексика", dialCode: "+52", flag: "🇲🇽" },
  { code: "CA", name: "Канада", dialCode: "+1", flag: "🇨🇦" },
  { code: "ZA", name: "ЮАР", dialCode: "+27", flag: "🇿🇦" },
];

interface CountrySelectorProps {
  value?: Country;
  onChange?: (country: Country) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCountry = value || COUNTRIES[0];

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES;
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectCountry = (country: Country) => {
    onChange?.(country);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        className="w-full justify-between h-12 px-4 text-base font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedCountry.flag}</span>
          <div className="flex flex-col items-start">
            <span className="text-sm text-muted-foreground">
              {selectedCountry.dialCode}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedCountry.code}
            </span>
          </div>
        </div>
        <ChevronDown
          className="h-5 w-5 transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border sticky top-0 bg-card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск страны..."
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <ScrollArea className="h-64">
            <div className="p-2">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full text-left px-3 py-3 rounded-md transition-colors flex items-center gap-3 ${
                      selectedCountry.code === country.code
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{country.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {country.dialCode}
                      </div>
                    </div>
                    {selectedCountry.code === country.code && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Страна не найдена
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

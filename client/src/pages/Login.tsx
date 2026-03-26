import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountrySelector, Country } from "@/components/CountrySelector";
import { Loader2, ChevronRight } from "lucide-react";
import axios from "axios";

interface LoginProps {
  onPhoneSubmit: (phone: string, sessionId: string) => void;
}

export default function Login({ onPhoneSubmit }: LoginProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: "RU",
    name: "Россия",
    dialCode: "+7",
    flag: "🇷🇺",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    // Limit to reasonable length
    if (value.length > 15) {
      value = value.slice(0, 15);
    }

    setPhoneNumber(value);
    setError("");
  };

  const formatDisplayPhone = () => {
    if (!phoneNumber) return "";
    
    if (selectedCountry.code === "RU" || selectedCountry.code === "KZ") {
      if (phoneNumber.length <= 3) return phoneNumber;
      if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      if (phoneNumber.length <= 8) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8)}`;
    } else if (selectedCountry.code === "US" || selectedCountry.code === "CA") {
      if (phoneNumber.length <= 3) return phoneNumber;
      if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else if (selectedCountry.code === "UA") {
      if (phoneNumber.length <= 2) return phoneNumber;
      if (phoneNumber.length <= 5) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
      if (phoneNumber.length <= 7) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5)}`;
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5, 7)}-${phoneNumber.slice(7)}`;
    } else if (selectedCountry.code === "GB") {
      if (phoneNumber.length <= 4) return phoneNumber;
      if (phoneNumber.length <= 7) return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
    } else if (selectedCountry.code === "DE" || selectedCountry.code === "FR") {
      if (phoneNumber.length <= 3) return phoneNumber;
      if (phoneNumber.length <= 7) return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 7)} ${phoneNumber.slice(7)}`;
    } else if (selectedCountry.code === "CN") {
      if (phoneNumber.length <= 4) return phoneNumber;
      if (phoneNumber.length <= 8) return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 8)} ${phoneNumber.slice(8)}`;
    } else if (selectedCountry.code === "IN") {
      if (phoneNumber.length <= 5) return phoneNumber;
      return `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
    }
    
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 7) {
      setError("Пожалуйста, введите корректный номер телефона");
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${selectedCountry.dialCode}${phoneNumber}`;
      
      const response = await axios.post("/api/auth/send-otp", {
        phone: fullPhone,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Show OTP in alert for testing
        alert(`Ваш код подтверждения: ${response.data.otp}`);
        onPhoneSubmit(fullPhone, response.data.sessionId);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Ошибка при отправке кода. Попробуйте снова."
      );
      console.error("Error sending OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Flick</h1>
          <p className="text-muted-foreground">Войдите в свой аккаунт</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Country Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Выберите страну
              </label>
              <CountrySelector
                value={selectedCountry}
                onChange={setSelectedCountry}
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Номер телефона
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-foreground font-medium">
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.dialCode}</span>
                </div>
                <Input
                  type="tel"
                  placeholder="Введите номер телефона"
                  value={formatDisplayPhone()}
                  onChange={handlePhoneChange}
                  className="pl-32 h-12 text-base"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Полный номер: {selectedCountry.dialCode}{phoneNumber || "___________"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !phoneNumber}
              className="w-full h-12 text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Отправка кода...
                </>
              ) : (
                <>
                  Получить код
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>

            {/* Info */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground text-center">
                Мы отправим вам SMS с кодом подтверждения. Стандартные тарифы на SMS могут применяться.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Используя приложение, вы принимаете наши условия использования
        </p>
      </div>
    </div>
  );
}

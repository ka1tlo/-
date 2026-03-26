import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Loader2, ChevronLeft, Clock } from "lucide-react";
import axios from "axios";

interface VerifyProps {
  phone: string;
  sessionId: string;
  onVerifySuccess: (token: string, phone: string) => void;
  onBack: () => void;
}

export default function Verify({
  phone,
  sessionId,
  onVerifySuccess,
  onBack,
}: VerifyProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Timer for OTP expiry
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Пожалуйста, введите полный код из 6 цифр");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        sessionId,
        code,
      });

      if (response.data.success) {
        onVerifySuccess(response.data.token, response.data.phone);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Ошибка при проверке кода. Попробуйте снова.";
      setError(errorMsg);
      
      // Show attempts left if available
      if (err.response?.data?.attemptsLeft !== undefined) {
        setError(
          `${errorMsg} (Осталось попыток: ${err.response.data.attemptsLeft})`
        );
      }
      
      console.error("Error verifying OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/send-otp", {
        phone,
      });

      if (response.data.success) {
        setCode("");
        setTimeLeft(600);
        setCanResend(false);
        
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Ошибка при повторной отправке кода"
      );
      console.error("Error resending OTP:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">📱</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Подтверждение</h1>
          <p className="text-muted-foreground">
            Введите код из SMS, отправленного на номер
          </p>
          <p className="text-sm font-medium text-foreground mt-2">{phone}</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-4 text-center">
                Код подтверждения
              </label>
              <div className="flex justify-center mb-4">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Код приходит в консоль браузера (F12 → Console)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Код действует: {formatTime(timeLeft)}</span>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full h-12 text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Проверка...
                </>
              ) : (
                "Подтвердить"
              )}
            </Button>

            {/* Resend Button */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Не получили код?
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={!canResend || resendLoading}
                onClick={handleResend}
                className="w-full"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : canResend ? (
                  "Отправить код заново"
                ) : (
                  `Отправить заново через ${formatTime(timeLeft)}`
                )}
              </Button>
            </div>

            {/* Back Button */}
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="w-full"
              disabled={loading}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Вернуться
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Не делитесь кодом ни с кем
        </p>
      </div>
    </div>
  );
}

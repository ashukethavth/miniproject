import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/src/utils/cn';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  className?: string;
  disabled?: boolean;
}

export const OTPInput = ({ length = 6, onComplete, className, disabled = false }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length).split('');
    const newOtp = [...otp];
    data.forEach((char, i) => {
      if (!isNaN(Number(char))) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    
    const lastIndex = Math.min(data.length, length - 1);
    inputRefs.current[lastIndex]?.focus();

    if (newOtp.join('').length === length) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
        />
      ))}
    </div>
  );
};

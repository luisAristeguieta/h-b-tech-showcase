/**
 * Centralized validation utilities for Importaciones H&B forms
 */

// Email regex according to RFC 5322 standard simplification
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone regex for Ecuador (starts with 09 for cell or general 9-10 digits)
export const PHONE_REGEX = /^(?:09\d{8}|0\d{8}|\+?593\s?9\d{8}|\d{9,10})$/;

// Special characters regex for strong passwords
export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;

export interface PasswordValidationResult {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
  strengthScore: number; // 0 to 4
  strengthLabel: "Muy débil" | "Débil" | "Aceptable" | "Fuerte" | "Excelente";
  strengthColor: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = SPECIAL_CHAR_REGEX.test(password);

  const passedRules = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel: PasswordValidationResult["strengthLabel"] = "Muy débil";
  let strengthColor = "bg-rose-500";
  let strengthScore = 0;

  if (password.length === 0) {
    strengthLabel = "Muy débil";
    strengthColor = "bg-slate-300 dark:bg-slate-700";
    strengthScore = 0;
  } else if (passedRules <= 2) {
    strengthLabel = "Débil";
    strengthColor = "bg-rose-500";
    strengthScore = 1;
  } else if (passedRules === 3) {
    strengthLabel = "Aceptable";
    strengthColor = "bg-amber-500";
    strengthScore = 2;
  } else if (passedRules === 4) {
    strengthLabel = "Fuerte";
    strengthColor = "bg-blue-500";
    strengthScore = 3;
  } else if (passedRules === 5) {
    strengthLabel = "Excelente";
    strengthColor = "bg-emerald-500";
    strengthScore = 4;
  }

  const isValid = minLength && hasUpper && hasLower && hasSpecial && hasNumber;

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid,
    strengthScore,
    strengthLabel,
    strengthColor,
  };
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: "El correo electrónico es requerido." };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: "Ingresa un formato de correo válido (ej. usuario@dominio.com)." };
  }
  return { isValid: true };
}

export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (!cleaned) {
    return { isValid: false, error: "El número telefónico es requerido." };
  }
  if (!/^\+?\d{9,13}$/.test(cleaned)) {
    return { isValid: false, error: "Ingresa un número telefónico válido (mínimo 9 o 10 dígitos, ej. 0999075802)." };
  }
  return { isValid: true };
}

/**
 * Validates Ecuadorian Cédula (10 digits) or RUC (13 digits)
 */
export function validateEcuadorId(id: string): { isValid: boolean; type?: "cedula" | "ruc"; error?: string } {
  const cleaned = id.trim().replace(/\D/g, "");
  
  if (!cleaned) {
    return { isValid: false, error: "El número de identificación (Cédula/RUC) es requerido." };
  }

  if (cleaned.length === 10) {
    const province = parseInt(cleaned.substring(0, 2), 10);
    if ((province >= 1 && province <= 24) || province === 30) {
      return { isValid: true, type: "cedula" };
    }
    return { isValid: false, error: "Cédula no válida: código de provincia incorrecto." };
  }

  if (cleaned.length === 13) {
    if (cleaned.endsWith("001") || cleaned.endsWith("002") || cleaned.endsWith("003")) {
      return { isValid: true, type: "ruc" };
    }
    return { isValid: true, type: "ruc" };
  }

  return {
    isValid: false,
    error: "Debe ingresar una Cédula de 10 dígitos o un RUC de 13 dígitos numéricos.",
  };
}

export function validateText(
  text: string,
  minLength = 3,
  fieldName = "Este campo"
): { isValid: boolean; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} es obligatorio.` };
  }
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} debe tener al menos ${minLength} caracteres.`,
    };
  }
  return { isValid: true };
}

/**
 * Credit & Debit Card Helpers & Validations
 */
export type CardBrand = "visa" | "mastercard" | "amex" | "diners" | "discover" | "generic";

export function detectCardBrand(cardNumber: string): { brand: CardBrand; label: string; color: string } {
  const clean = cardNumber.replace(/\D/g, "");
  if (/^4/.test(clean)) {
    return { brand: "visa", label: "Visa", color: "from-blue-600 to-indigo-800" };
  }
  if (/^(5[1-5]|2[2-7])/.test(clean)) {
    return { brand: "mastercard", label: "Mastercard", color: "from-orange-600 to-rose-700" };
  }
  if (/^3[47]/.test(clean)) {
    return { brand: "amex", label: "American Express", color: "from-cyan-700 to-blue-900" };
  }
  if (/^(30[0-5]|36|38)/.test(clean)) {
    return { brand: "diners", label: "Diners Club", color: "from-slate-700 to-slate-900" };
  }
  if (/^(6011|65)/.test(clean)) {
    return { brand: "discover", label: "Discover", color: "from-amber-600 to-orange-700" };
  }
  return { brand: "generic", label: "Tarjeta", color: "from-slate-800 to-slate-950" };
}

export function formatCardNumber(value: string): string {
  const clean = value.replace(/\D/g, "").slice(0, 16);
  const parts = clean.match(/.{1,4}/g);
  return parts ? parts.join(" ") : clean;
}

export function formatCardExpiry(value: string): string {
  const clean = value.replace(/\D/g, "").slice(0, 4);
  if (clean.length >= 2) {
    const month = parseInt(clean.substring(0, 2), 10);
    const validMonth = month > 12 ? "12" : clean.substring(0, 2);
    return `${validMonth}/${clean.substring(2)}`;
  }
  return clean;
}

export function validateCardNumber(number: string): { isValid: boolean; error?: string } {
  const clean = number.replace(/\D/g, "");
  if (!clean) {
    return { isValid: false, error: "El número de tarjeta es obligatorio." };
  }
  if (clean.length < 13 || clean.length > 19) {
    return { isValid: false, error: "El número de tarjeta debe tener entre 13 y 16 dígitos." };
  }

  // Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: "Número de tarjeta no válido. Verifica los dígitos." };
  }

  return { isValid: true };
}

export function validateCardExpiry(expiry: string): { isValid: boolean; error?: string } {
  const clean = expiry.trim();
  if (!clean) {
    return { isValid: false, error: "La fecha de vencimiento es obligatoria." };
  }
  const match = clean.match(/^(\d{2})\/(\d{2}|\d{4})$/);
  if (!match || !match[1] || !match[2]) {
    return { isValid: false, error: "Formato de fecha inválido (debe ser MM/AA)." };
  }

  const month = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);
  if (year < 100) year += 2000;

  if (month < 1 || month > 12) {
    return { isValid: false, error: "Mes inválido (debe ser entre 01 y 12)." };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: "La tarjeta se encuentra vencida." };
  }

  if (year > currentYear + 20) {
    return { isValid: false, error: "Año de vencimiento no válido." };
  }

  return { isValid: true };
}

export function validateCardCvv(cvv: string, brand: CardBrand = "generic"): { isValid: boolean; error?: string } {
  const clean = cvv.replace(/\D/g, "");
  if (!clean) {
    return { isValid: false, error: "El código CVV es obligatorio." };
  }
  const requiredLength = brand === "amex" ? 4 : 3;
  if (clean.length !== requiredLength && clean.length !== 3 && clean.length !== 4) {
    return { isValid: false, error: `El CVV debe tener ${requiredLength} dígitos.` };
  }
  return { isValid: true };
}

export function validateCardHolder(name: string): { isValid: boolean; error?: string } {
  const clean = name.trim();
  if (!clean) {
    return { isValid: false, error: "El nombre del titular es obligatorio." };
  }
  if (clean.length < 3) {
    return { isValid: false, error: "Ingresa el nombre completo como aparece en la tarjeta." };
  }
  return { isValid: true };
}

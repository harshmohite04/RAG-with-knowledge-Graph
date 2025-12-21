export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  if (!validateRequired(email)) {
    return { isValid: false, error: "Email is required" };
  }
  if (!validateEmail(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  if (!validateRequired(password)) {
    return { isValid: false, error: "Password is required" };
  }
  if (!validatePassword(password)) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }
  return { isValid: true };
};

export const validateNewCaseForm = (
  caseName: string,
  clientName: string,
  caseType: string
): ValidationResult => {
  if (!validateRequired(caseName)) {
    return { isValid: false, error: "Case name is required" };
  }
  if (!validateRequired(clientName)) {
    return { isValid: false, error: "Client name is required" };
  }
  if (!validateRequired(caseType)) {
    return { isValid: false, error: "Case type is required" };
  }
  return { isValid: true };
};

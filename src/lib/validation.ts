export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  // Must start with '+' followed by country code and subscriber digits (total 8 to 15 digits)
  const phoneRegex = /^\+[1-9]\d{0,3}[\s\-\(\)\.]?[0-9\s\-\(\)\.]{6,14}$/;
  const digits = (trimmed.match(/\d/g) || []).length;
  return phoneRegex.test(trimmed) && digits >= 8 && digits <= 15;
}

/**
 * Power Zero Identity Utils
 */

/**
 * Extracts initials from a full name.
 * - Stark -> S
 * - Stark Industries -> SI
 * - Tony Stark Industries -> TI (first and last initials)
 * - "  Tony   Stark  " -> TS
 */
export const getInitials = (name: string): string => {
  if (!name) return '??';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  const first = parts[0];
  const last = parts[parts.length - 1];
  
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
};

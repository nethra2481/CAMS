/**
 * Utility functions for Alumni Auto-Archival logic
 */

/**
 * Extracts the 2-digit passout year from a register number and converts it to a 4-digit year.
 * Example: "CB.SC.U4CYS24035" -> 2024
 */
export function getPassoutYear(registerNumber: string | null | undefined): number | null {
  if (!registerNumber) return null;

  // Match the last 5 digits (e.g. 24035) and capture the first 2 (e.g. 24)
  const match = registerNumber.match(/(\d{2})\d{3}$/);
  
  if (match && match[1]) {
    const joiningYearTwoDigit = parseInt(match[1], 10);
    // Assuming 2000s. Adjust logic if this software runs in year 2100+
    const joiningYear = 2000 + joiningYearTwoDigit;
    // B.Tech is typically a 4-year program, so they pass out 4 years after joining
    return joiningYear + 4;
  }
  
  return null;
}

/**
 * Determines if a student is an alumnus based on their register number.
 * A student is considered an alumnus if the current date is past their assumed graduation date (July 1st of passout year).
 */
export function isAlumnus(registerNumber: string | null | undefined): boolean {
  const passoutYear = getPassoutYear(registerNumber);
  if (!passoutYear) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed (0 = Jan, 6 = Jul)

  // If current year is greater than passout year, definitely an alumnus
  if (currentYear > passoutYear) return true;
  
  // If current year is exactly the passout year, they become an alumnus after July 1st
  if (currentYear === passoutYear && currentMonth >= 6) return true;

  return false;
}

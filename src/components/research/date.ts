// A research piece's date as visitors read it: "18 februari 2026".
export const formatDate = (date: Date) =>
  date.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

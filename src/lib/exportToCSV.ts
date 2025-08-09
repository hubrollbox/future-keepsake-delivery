// Utilitário para exportar arrays de objetos para CSV e fazer download
export function exportToCSV<T extends object>(data: T[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(","),
    ...data.map(row => keys.map(k => JSON.stringify((row as Record<string, unknown>)[k] ?? "")).join(","))
  ];
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

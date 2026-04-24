export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    aberto: "Aberto",
    em_andamento: "Em Andamento",
    finalizado: "Finalizado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    aberto: "bg-green-100 text-green-800",
    em_andamento: "bg-yellow-100 text-yellow-800",
    finalizado: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export const WHATSAPP_NUMBER = "5511932347131";
export const WHATSAPP_MESSAGE = "Olá! Quero participar do bolão! 🍀";
export function getWhatsAppLink(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

export const TIPOS_JOGO = [
  "Mega-Sena",
  "Lotofácil",
  "Quina",
  "Lotomania",
  "Dupla Sena",
  "Timemania",
  "Dia de Sorte",
];

export const MEGA_SENA_PRECOS: Record<number, number> = {
  6: 6.00,
  7: 42.00,
  8: 168.00,
  9: 504.00,
  10: 1260.00,
  11: 2772.00,
  12: 5544.00,
  13: 10296.00,
  14: 18018.00,
  15: 30030.00,
  16: 48048.00,
  17: 74256.00,
  18: 111384.00,
  19: 162792.00,
  20: 232560.00,
};

export const COMISSAO_OPERADOR = 0.10;

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal" },
  { code: "BHD", symbol: "د.ب", name: "Bahraini Dinar" },
  { code: "OMR", symbol: "ر.ع", name: "Omani Rial" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
];

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CurrencySelector({ value, onChange, className }: CurrencySelectorProps) {
  const selectedCurrency = CURRENCIES.find((c) => c.code === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedCurrency ? (
            <span className="flex items-center gap-2">
              <span className="font-semibold">{selectedCurrency.symbol}</span>
              <span>{selectedCurrency.code}</span>
              <span className="text-muted-foreground text-sm">- {selectedCurrency.name}</span>
            </span>
          ) : (
            "Select currency"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <span className="flex items-center gap-2">
              <span className="font-semibold w-8">{currency.symbol}</span>
              <span className="font-medium w-12">{currency.code}</span>
              <span className="text-muted-foreground">- {currency.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Format currency amount with proper symbol and formatting
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  if (!currency) return `${amount}`;

  // Format with commas and 2 decimal places
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency.symbol}${formatted}`;
}

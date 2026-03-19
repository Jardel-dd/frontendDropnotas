export interface UserMultiSelectProps {
  id?: string;
  label?: string;
  selectedItems: any[];
  onChange: (e: any) => void;
  options: any[];
  optionLabel?: string;
  placeholder?: string;
  maxSelectedLabels?: number;
  hasError?: boolean;
  errorMessage?: string;
  showChips?: boolean;
  fetchFilteredItems?: (query: string) => Promise<any[]>;
  fetchAllItems?: () => Promise<any[]>;
}
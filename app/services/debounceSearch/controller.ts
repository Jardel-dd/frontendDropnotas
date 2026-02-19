import { useDebouncedCallback } from 'use-debounce';

type UseSearchOptions<T> = {
  setter: React.Dispatch<React.SetStateAction<T>>;
  field: keyof T | (keyof T)[];  
  onSearch: (value: string) => void;
  delay?: number;
};
export function useGenericSearch<T>({
  setter,
  field,
  onSearch,
  delay = 500,
}: UseSearchOptions<T>) {
  const updateState = (value: string) => {
    setter((prevState) => {
      if (prevState && typeof (prevState as any).copyWith === "function") {
        if (Array.isArray(field)) {
          const updates: Partial<T> = {};
          field.forEach((f) => {
            (updates as any)[f] = value;
          });
          return (prevState as any).copyWith(updates);
        } else {
          return (prevState as any).copyWith({ [field]: value });
        }
      }

      if (Array.isArray(field)) {
        const updates: Partial<T> = {};
        field.forEach((f) => {
          (updates as any)[f] = value;
        });
        return { ...prevState, ...updates };
      } else {
        return { ...prevState, [field]: value };
      }
    });
    onSearch(value);
  };

  const debouncedSearch = useDebouncedCallback(updateState, delay);
  const searchNow = updateState;

  return { debouncedSearch, searchNow };
}

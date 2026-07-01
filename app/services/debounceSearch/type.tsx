
export type UseSearchOptions<T> = {
  setter: React.Dispatch<React.SetStateAction<T>>;
  field: keyof T | (keyof T)[];  
  onSearch: (value: string) => void;
  delay?: number;
};
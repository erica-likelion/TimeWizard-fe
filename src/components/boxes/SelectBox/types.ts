export interface Option {
  id: string | number;
  label: string;
}

export interface CustomSelectProps {
  options: Option[];
  onChange: (value: Option) => void;
  defaultValue?: Option;
  size?: 'large' | 'small' | 'fit' | 'full';
}
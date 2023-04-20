import { rows } from "mssql";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
}

const TextAreaField = (props: Props) => {
  const { value, disabled, className, rows, placeholder, onChange } = props;

  return (
    <textarea
      className={`${className || ""} w-full border px-3 py-2 rounded-lg dark:border-zinc-700 dark:bg-zinc-800 focus:outline-2`}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      rows={rows || 5}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextAreaField;

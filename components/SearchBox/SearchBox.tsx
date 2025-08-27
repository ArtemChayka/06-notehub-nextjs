import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearchChange: (query: string) => void;
  value: string;
}

export default function SearchBox ({ onSearchChange, value } : SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};



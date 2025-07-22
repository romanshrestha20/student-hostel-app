import React from "react";
import Dropdown from "./Dropdown";

interface SortDropdownProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = (props) => {
  return <Dropdown {...props} />;
};

export default SortDropdown;

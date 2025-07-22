import React from "react";
import Dropdown from "./Dropdown";

interface FilterDropdownProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = (props) => {
  return <Dropdown {...props} />;
};

export default FilterDropdown;

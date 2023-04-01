"use client";

import { Select, TextInput, Button } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

const SearchBar = params => {
  return (
    <div className="felx float-right mr-8 mb-4">
      <div className="flex">
        <Select
          sizing="sm"
          onChange={e => params.setSelected(e.target.value)}
          value={params.selected}
        >
          {params.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <TextInput
          type="text"
          sizing="sm"
          onChange={e => params.setWord(e.target.value)}
          value={params.word}
        />
        <Button size="sm" onClick={params.onSearch}>
          <HiSearch className="h-4 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

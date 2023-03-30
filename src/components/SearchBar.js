"use client";

import { Select, TextInput, Button } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { useState } from "react";

const SearchBar = params => {
  const [selected, setSelected] = useState(params.options[0].value);
  const [word, setWord] = useState("");

  const handleSearch = () => {};

  return (
    <div className="felx float-right mr-8 mb-4">
      <div className="flex">
        <Select sizing="sm" onChange={e => setSelected(e.target.value)} value={selected}>
          {params.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <TextInput type="text" sizing="sm" onChange={e => setWord(e.target.value)} value={word} />
        <Button size="sm" onClick={handleSearch}>
          <HiSearch className="h-4 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

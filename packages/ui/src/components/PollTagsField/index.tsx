import { useState } from "react";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";

type PollTagsFieldProps = {
  suggestions: {
    id: string;
    name: string;
  }[];
};

export const PollTagsField = ({ suggestions }: PollTagsFieldProps) => {
  const [selected, setSelected] = useState([]);
  const [suggestionsState, setSuggestionsState] = useState(suggestions);

  const search = (e: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuggestions;

      if (!e.query.trim().length) {
        _filteredSuggestions = [...suggestions];
      } else {
        _filteredSuggestions = suggestions.filter((country) => {
          return country.name.toLowerCase().startsWith(e.query.toLowerCase());
        });
      }

      setSuggestionsState(_filteredSuggestions);
    }, 250);
  };

  return (
    <AutoComplete
      className="custom-auto-complete"
      field="name"
      multiple
      inputClassName="w-full"
      value={selected}
      suggestions={suggestionsState}
      completeMethod={search}
      onChange={(e) => setSelected(e.value)}
    />
  );
};

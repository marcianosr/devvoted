import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";

export const pollTypes = [
  { name: "Regular question", value: "regular" },
  { name: "Minigame", value: "minigame" },
  { name: "Challenge", value: "challenge" },
];

export const PollDropdown = () => {
  const [selectedPollType, setSelectedPollType] = useState(pollTypes);

  return (
    <>
      <h2 className="text-3xl font-bold">Poll type</h2>
      <small>Choose the type of poll format you have in mind</small>
      <Dropdown
        value={selectedPollType}
        onChange={(e) => setSelectedPollType(e.value)}
        options={pollTypes}
        optionLabel="name"
        placeholder="Select a poll type"
        className="w-full md:w-14rem"
        name="poll-type"
      />
    </>
  );
};

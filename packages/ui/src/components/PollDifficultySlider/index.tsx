import React, { useState } from "react";
import { Slider, SliderChangeEvent } from "primereact/slider";

export const PollDifficultySlider = () => {
  const [value, setValue] = useState(20);

  const valueMapping = {
    0: "Very easy",
    20: "Easy",
    40: "Medium",
    60: "Hard",
    80: "Very hard",
    100: "Insane",
  };

  return (
    <section>
      <h2 className="text-3xl font-bold">Difficulty</h2>
      <div className="flex gap-4 items-center">
        <h3>{valueMapping[value as keyof typeof valueMapping]}</h3>

        <Slider
          value={value}
          className="flex-grow"
          onChange={(e: SliderChangeEvent) => setValue(e.value)}
          step={20}
        />
      </div>
    </section>
  );
};

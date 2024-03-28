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
      <h2 className="text-3xl font-bold dark:text-white">Difficulty</h2>

      <div className="card flex justify-content-center items-center gap-8">
        <span className="w-1/12">{valueMapping[value]}</span>

        <Slider
          value={value}
          className="w-6/12 md:w-14rem"
          onChange={(e: SliderChangeEvent) => setValue(e.value)}
          step={20}
        />
      </div>
    </section>
  );
};

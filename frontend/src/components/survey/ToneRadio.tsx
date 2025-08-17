import type { Tone } from "../../types/SurveyTypes";
import { TONES } from "../../types/SurveyTypes";

export default function ToneRadio({
  value = "Casual",
  onChange,
  required,
}: {
  value?: Tone;
  onChange: (v: Tone) => void;
  required?: boolean;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        답변 톤{required && <span className="text-red-500"> *</span>}
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="답변 톤">
        {TONES.map((t) => {
          const checked = value === t;
          return (
            <label
              key={t}
              className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm
                ${checked ? "border-green-600 bg-green-50" : "border-gray-300 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="tone"
                value={t}
                className="sr-only"
                checked={checked}
                onChange={() => onChange(t)}
                required={required}
              />
              {t}
            </label>
          );
        })}
      </div>
      <p className="text-xs text-gray-500"></p>
    </fieldset>
  );
}

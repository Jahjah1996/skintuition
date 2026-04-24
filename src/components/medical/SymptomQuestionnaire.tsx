import { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../core/Button";

// types

export interface SymptomData {
  symptomType: string;
  symptomTypeOther: string;
  duration: string;
  durationOther: string;
  painLevel: string;
  sensations: string;
  sensationsOther: string;
  changes: string;
  changesOther: string;
  additionalContext: string;
}

interface Props {
  onComplete: (data: SymptomData) => void;
}

// option sets

const SYMPTOM_TYPES = [
  "Rash or irritated skin",
  "Mole / growth / lump",
  "Dryness or flaking",
  "Wound or open sore",
  "Itching without visible rash",
  "Discolouration or pigment change",
  "Blistering or fluid-filled lesion",
  "Acne or cyst",
  "Other",
];

const DURATIONS = [
  "Less than 1 week",
  "1 – 4 weeks",
  "1 – 3 months",
  "3 – 6 months",
  "More than 6 months",
  "Other",
];

const PAIN_LEVELS = [
  "0 – No discomfort at all",
  "1-2 – Very mild, easy to ignore",
  "3-4 – Mild, noticeable but not disruptive",
  "5-6 – Moderate, somewhat distracting",
  "7-8 – Severe, hard to ignore",
  "9-10 – Extreme, unbearable",
];

const SENSATIONS = [
  "No unusual sensation",
  "Itching",
  "Burning",
  "Stinging or prickling",
  "Numbness or tingling",
  "Tenderness when touched",
  "Throbbing",
  "Other",
];

const CHANGES = [
  "No noticeable change",
  "It has grown larger",
  "The colour has changed",
  "It has started bleeding or oozing",
  "New spots have appeared nearby",
  "It has become itchier or more painful",
  "It crusted over or formed a scab",
  "Other",
];

// step config

interface StepConfig {
  id: string;
  icon: string;
  title: string;
  description: string;
  field: keyof SymptomData;
  otherField?: keyof SymptomData;
  options: string[];
  isTextarea?: boolean;
}

const STEPS: StepConfig[] = [
  {
    id: "symptomType",
    icon: "assignment",
    title: "What describes your concern?",
    description:
      "Select the option that best matches what you are experiencing. Choose \u2018Other\u2019 to describe something not listed.",
    field: "symptomType",
    otherField: "symptomTypeOther",
    options: SYMPTOM_TYPES,
  },
  {
    id: "duration",
    icon: "schedule",
    title: "How long have you had this?",
    description:
      "Knowing the duration helps the AI distinguish acute reactions from chronic conditions.",
    field: "duration",
    otherField: "durationOther",
    options: DURATIONS,
  },
  {
    id: "painLevel",
    icon: "device_thermostat",
    title: "How would you rate your discomfort?",
    description:
      "Select the level that best represents how discomfort is affecting you right now.",
    field: "painLevel",
    options: PAIN_LEVELS,
  },
  {
    id: "sensations",
    icon: "vital_signs",
    title: "What sensations are you experiencing?",
    description:
      "Select the sensation that most closely matches what you feel in or around the affected area.",
    field: "sensations",
    otherField: "sensationsOther",
    options: SENSATIONS,
  },
  {
    id: "changes",
    icon: "trending_up",
    title: "Has the area changed recently?",
    description:
      "Recent changes can indicate progression. Be as accurate as possible.",
    field: "changes",
    otherField: "changesOther",
    options: CHANGES,
  },
  {
    id: "additionalContext",
    icon: "chat",
    title: "Anything else you'd like to add?",
    description:
      "Tell the AI anything else about your condition — recent triggers, medications, allergies, family history, etc. This is optional but very helpful.",
    field: "additionalContext",
    options: [],
    isTextarea: true,
  },
];

// empty state

const EMPTY: SymptomData = {
  symptomType: "",
  symptomTypeOther: "",
  duration: "",
  durationOther: "",
  painLevel: "",
  sensations: "",
  sensationsOther: "",
  changes: "",
  changesOther: "",
  additionalContext: "",
};

// component

export function SymptomQuestionnaire({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<SymptomData>(EMPTY);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const step = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  const currentValue = data[step.field] as string;
  const otherValue = step.otherField ? (data[step.otherField] as string) : "";
  const isOtherSelected = currentValue === "Other";

  const isCurrentStepValid = (): boolean => {
    if (step.isTextarea) return true; // optional
    if (!currentValue) return false;
    if (isOtherSelected && step.otherField && !otherValue.trim()) return false;
    return true;
  };

  const transition = (forward: boolean, action: () => void) => {
    setDirection(forward ? "forward" : "back");
    setAnimating(true);
    setTimeout(() => {
      action();
      setAnimating(false);
    }, 220);
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    if (currentStep < totalSteps - 1) {
      transition(true, () => setCurrentStep((s) => s + 1));
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      transition(false, () => setCurrentStep((s) => s - 1));
    }
  };

  const setField = (field: keyof SymptomData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto w-full font-body-md">
      {/* progress header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-xs text-secondary">
            {progressPct}% complete
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-surface-dim rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === currentStep
                  ? "w-6 bg-primary"
                  : i < currentStep
                    ? "w-1.5 bg-primary/40"
                    : "w-1.5 bg-surface-dim",
              )}
            />
          ))}
        </div>
      </div>

      {/* question card */}
      <div
        className={cn(
          "bg-white border border-surface-dim rounded-2xl shadow-sm overflow-hidden transition-all duration-220",
          animating && direction === "forward" && "opacity-0 translate-x-4",
          animating && direction === "back" && "opacity-0 -translate-x-4",
          !animating && "opacity-100 translate-x-0",
        )}
        style={{ transition: "opacity 0.22s ease, transform 0.22s ease" }}
      >
        {/* Card header */}
        <div className="bg-surface-lowest border-b border-surface-dim px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-primary">
              <span className="material-symbols-outlined">{step.icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-serif italic text-primary">
                {step.title}
              </h2>
              <p className="text-sm text-secondary mt-0.5">
                {step.description}
              </p>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-6 space-y-4">
          {step.isTextarea ? (
            /* Free-text only step */
            <textarea
              id={`field-${step.id}`}
              rows={5}
              value={currentValue}
              onChange={(e) => setField(step.field, e.target.value)}
              placeholder="e.g. I recently changed my skincare routine, I take antihistamines daily..."
              className="w-full rounded-lg border border-surface-dim bg-surface-lowest px-4 py-3 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition"
            />
          ) : (
            <>
              {/* Dropdown */}
              <div>
                <label
                  htmlFor={`select-${step.id}`}
                  className="block text-sm font-medium text-primary mb-1.5"
                >
                  Select an option
                </label>
                <div className="relative">
                  <select
                    id={`select-${step.id}`}
                    value={currentValue}
                    onChange={(e) => {
                      setField(step.field, e.target.value);
                      if (step.otherField && e.target.value !== "Other") {
                        setField(step.otherField, "");
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-surface-dim bg-white px-4 py-3 pr-10 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition cursor-pointer"
                  >
                    <option value="" disabled>
                      — Please choose —
                    </option>
                    {step.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
                    expand_more
                  </span>
                </div>
              </div>

              {/* "Other" free-text expander */}
              {isOtherSelected && step.otherField && (
                <div className="rounded-lg border border-surface-dim bg-surface-lowest p-4 space-y-2 animate-fadeIn">
                  <label
                    htmlFor={`other-${step.id}`}
                    className="block text-sm font-medium text-primary"
                  >
                    Please describe your answer
                  </label>
                  <input
                    id={`other-${step.id}`}
                    type="text"
                    value={otherValue}
                    onChange={(e) => setField(step.otherField!, e.target.value)}
                    placeholder="Type your answer here…"
                    maxLength={200}
                    className="w-full rounded-md border border-surface-dim bg-white px-3 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <p className="text-right text-xs text-secondary">
                    {otherValue.length}/200
                  </p>
                </div>
              )}

              {/* Validation hint */}
              {!isCurrentStepValid() && currentValue !== "" && (
                <p className="text-sm text-amber-600 flex items-center gap-1.5 mt-2">
                  <span className="material-symbols-outlined text-[18px]">warning</span> 
                  Please describe your answer in the field above.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* prev/next buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-1.5 border-surface-dim text-secondary hover:text-primary rounded-full px-5"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isCurrentStepValid() && !step.isTextarea}
          className="gap-1.5 min-w-[130px] rounded-full bg-primary text-on-primary hover:bg-primary/90 px-6 py-2.5 shadow-sm hover:shadow transition-all"
        >
          {currentStep < totalSteps - 1 ? (
            <>
              Next
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </>
          ) : (
            "Continue to Upload"
          )}
        </Button>
      </div>

      {/* skip hint on last step */}
      {currentStep === totalSteps - 1 && (
        <p className="text-center text-sm text-secondary mt-4 italic">
          This step is optional — you can leave it blank and click "Continue to
          Upload".
        </p>
      )}
    </div>
  );
}

type Step = 'General Info' | 'Location' | 'Meal size and consistency' | 'Done';

export const StepMenu = ({ currentStep }: { currentStep: Step }) => {
  const steps: Step[] = [
    'General Info',
    'Location',
    'Meal size and consistency',
    'Done',
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  return (
    <>
      <ul className='steps'>
        {steps.map((step, index) => (
          <li
            key={step}
            className={`step ${
              index <= currentStepIndex ? 'step-neutral' : ''
            }`}
          >
            {step}
          </li>
        ))}
      </ul>
    </>
  );
};

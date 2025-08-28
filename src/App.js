import React, { useState, useCallback } from 'react';

const styles = {
  appContainer: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#e0f2fe',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  calculatorWrapper: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0',
    lineHeight: '1.5',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid transparent',
  },
  calculatedInputGroup: {
    backgroundColor: '#eff6ff',
    border: '2px dashed #3b82f6',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '0.5rem',
  },
  textInputWrapper: {
    position: 'relative',
    marginBottom: '1rem',
  },
  textInput: {
    width: '100%',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2d3748',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  textInputSymbolLeft: { paddingLeft: '2.5rem' },
  textInputSymbolRight: { paddingRight: '2.5rem' },
  textInputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
    outline: 'none',
  },
  inputSymbol: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#a0aec0',
  },
  inputSymbolLeft: { left: '1rem' },
  inputSymbolRight: { right: '1rem' },
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: '#3b82f6',
  },
  buttonsContainer: {
      textAlign: 'center',
      marginTop: '2rem',
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
  },
  button: {
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
  },
  selectionContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
  },
  selectionButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '100%',
      maxWidth: '400px',
  }
};

const InputControl = ({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step,
  isResult = false,
  unitPosition = 'before',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const groupStyles = {
    ...styles.inputGroup,
    ...(isResult ? styles.calculatedInputGroup : {}),
  };

  const inputStyles = {
    ...styles.textInput,
    ...(unitPosition === 'before' ? styles.textInputSymbolLeft : styles.textInputSymbolRight),
    ...(isFocused && !isResult ? styles.textInputFocus : {}),
  };

  const symbolStyles = {
      ...styles.inputSymbol,
      ...(unitPosition === 'before' ? styles.inputSymbolLeft : styles.inputSymbolRight),
  };

  return (
    <div style={groupStyles}>
      <label style={styles.label}>{label}</label>
      <div style={styles.textInputWrapper}>
        <span style={symbolStyles}>{unit}</span>
        <input
          type="number"
          value={Math.round(value)}
          onChange={onChange}
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={min}
          max={max}
          readOnly={isResult}
        />
      </div>
      {!isResult && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          style={styles.slider}
        />
      )}
    </div>
  );
};

const INITIAL_GOAL = 10000;
const INITIAL_CONTRIBUTION = 250;
const INITIAL_DURATION = 40;

export default function App() {
  const [goal, setGoal] = useState(INITIAL_GOAL);
  const [contribution, setContribution] = useState(INITIAL_CONTRIBUTION);
  const [duration, setDuration] = useState(INITIAL_DURATION);
  const [view, setView] = useState('selection');
  const handleReset = useCallback(() => {
    setGoal(INITIAL_GOAL);
    setContribution(INITIAL_CONTRIBUTION);
    setDuration(INITIAL_DURATION);
  }, []);

  const renderCalculator = () => {
    const commonButtons = (
        <div style={styles.buttonsContainer}>
            <button onClick={() => setView('selection')} style={styles.button}>Back</button>
            <button onClick={handleReset} style={styles.button}>Reset</button>
        </div>
    );

    switch (view) {
        case 'goal':
            return (
                <div>
                    <div style={styles.inputsContainer}>
                        <InputControl label="Monthly Contribution" unit="£" value={contribution} onChange={(e) => {
                            const newContribution = Number(e.target.value);
                            setContribution(newContribution);
                            setGoal(newContribution * duration);
                        }} min={10} max={2000} step={10} />
                        <InputControl label="Duration" unit="m" unitPosition="after" value={duration} onChange={(e) => {
                            const newDuration = Number(e.target.value);
                            setDuration(newDuration);
                            setGoal(contribution * newDuration);
                        }} min={1} max={240} step={1} />
                        <InputControl label="Savings Goal (Result)" unit="£" value={goal} isResult={true} />
                    </div>
                    {commonButtons}
                </div>
            );
        case 'contribution':
            return (
                <div>
                    <div style={styles.inputsContainer}>
                        <InputControl label="Savings Goal" unit="£" value={goal} onChange={(e) => {
                            const newGoal = Number(e.target.value);
                            setGoal(newGoal);
                            setContribution(isFinite(newGoal / duration) ? newGoal / duration : 0);
                        }} min={100} max={75000} step={100} />
                        <InputControl label="Duration" unit="m" unitPosition="after" value={duration} onChange={(e) => {
                            const newDuration = Number(e.target.value);
                            setDuration(newDuration);
                            setContribution(isFinite(goal / newDuration) ? goal / newDuration : 0);
                        }} min={1} max={240} step={1} />
                        <InputControl label="Monthly Contribution (Result)" unit="£" value={contribution} isResult={true} />
                    </div>
                    {commonButtons}
                </div>
            );
        case 'duration':
            return (
                <div>
                    <div style={styles.inputsContainer}>
                        <InputControl label="Savings Goal" unit="£" value={goal} onChange={(e) => {
                            const newGoal = Number(e.target.value);
                            setGoal(newGoal);
                            setDuration(isFinite(newGoal / contribution) ? newGoal / contribution : 0);
                        }} min={100} max={75000} step={100} />
                        <InputControl label="Monthly Contribution" unit="£" value={contribution} onChange={(e) => {
                            const newContribution = Number(e.target.value);
                            setContribution(newContribution);
                            setDuration(isFinite(goal / newContribution) ? goal / newContribution : 0);
                        }} min={10} max={2000} step={10} />
                        <InputControl label="Saving Duration (Result)" unit="m" unitPosition="after" value={duration} isResult={true} />
                    </div>
                    {commonButtons}
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.calculatorWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Savings Calculator</h1>
          {view === 'selection' ? (
            <p style={styles.subtitle}>How would you like to visualise your goal?</p>
          ) : (
            <p style={styles.subtitle}>Adjust the values to see the result update instantly.</p>
          )}
        </div>

        {view === 'selection' ? (
          <div style={styles.selectionContainer}>
            <button onClick={() => setView('goal')} style={styles.selectionButton}>How much will I save with my monthly payments?</button>
            <button onClick={() => setView('duration')} style={styles.selectionButton}>How many months of saving until I reach my goal?</button>
            <button onClick={() => setView('contribution')} style={styles.selectionButton}>I know my savings goal</button>
          </div>
        ) : (
          renderCalculator()
        )}
      </div>
    </div>
  );
}

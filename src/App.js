import React, { useState, useCallback } from 'react';

// --- STYLES ---
// Using JS objects for styling as requested.
const styles = {
  // Main container for the whole app
  appContainer: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  // Wrapper for the calculator component
  calculatorWrapper: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  // Header section
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#718096',
    margin: '0',
  },
  // Container for the input groups
  inputsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
  },
  // Individual input control group
  inputGroup: {
    flex: '1 1 200px',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },
  // Style for the calculated field
  calculatedInputGroup: {
    backgroundColor: '#edf2f7',
    padding: '1rem',
    borderRadius: '12px',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  },
  // Label for each input
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '0.5rem',
  },
  // "Calculated" badge
  calculatedBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    backgroundColor: '#38a169',
    color: 'white',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    textTransform: 'uppercase',
  },
  // Wrapper for the text input and currency/unit symbol
  textInputWrapper: {
    position: 'relative',
    marginBottom: '1rem',
  },
  // The actual text input
  textInput: {
    width: '100%',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2d3748',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    paddingLeft: '2.5rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  // Focus style for text input
  textInputFocus: {
    borderColor: '#3182ce',
    boxShadow: '0 0 0 3px rgba(66, 153, 226, 0.3)',
    outline: 'none',
  },
  // Currency/unit symbol inside the text input
  inputSymbol: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#a0aec0',
  },
  // Slider input
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: '#3182ce', // Modern way to style sliders
  },
};

// --- INPUT CONTROL COMPONENT ---
// A reusable component for each of the three controls (Goal, Contribution, Duration)
const InputControl = ({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step,
  isCalculated,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Combine base and conditional styles
  const groupStyles = {
    ...styles.inputGroup,
    ...(isCalculated ? styles.calculatedInputGroup : {}),
  };

  const inputStyles = {
    ...styles.textInput,
    ...(isFocused ? styles.textInputFocus : {}),
  };

  return (
    <div style={groupStyles}>
      <label style={styles.label}>
        {label}
        {isCalculated && <span style={styles.calculatedBadge}>Calculated</span>}
      </label>
      <div style={styles.textInputWrapper}>
        <span style={styles.inputSymbol}>{unit}</span>
        <input
          type="number"
          value={Math.round(value)}
          onChange={onChange}
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={min}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={styles.slider}
      />
    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  // State for the three core values
  const [goal, setGoal] = useState(10000);
  const [contribution, setContribution] = useState(250);
  const [duration, setDuration] = useState(40);

  // State to track which field was most recently calculated, for styling purposes
  const [calculatedField, setCalculatedField] = useState(null);

  // Memoized handlers to prevent unnecessary re-renders of child components
  const handleGoalChange = useCallback((e) => {
    const newGoal = Number(e.target.value);
    setGoal(newGoal);
    // If the user changes the goal, we recalculate the monthly contribution, keeping duration constant.
    const newContribution = newGoal / duration;
    setContribution(isFinite(newContribution) ? newContribution : 0);
    setCalculatedField('contribution');
  }, [duration]);

  const handleContributionChange = useCallback((e) => {
    const newContribution = Number(e.target.value);
    setContribution(newContribution);
    // If the user changes the contribution, we recalculate the duration, keeping the goal constant.
    const newDuration = goal / newContribution;
    setDuration(isFinite(newDuration) ? newDuration : 0);
    setCalculatedField('duration');
  }, [goal]);

  const handleDurationChange = useCallback((e) => {
    const newDuration = Number(e.target.value);
    setDuration(newDuration);
    // If the user changes the duration, we recalculate the contribution, keeping the goal constant.
    const newContribution = goal / newDuration;
    setContribution(isFinite(newContribution) ? newContribution : 0);
    setCalculatedField('contribution');
  }, [goal]);

  return (
    <div style={styles.appContainer}>
      <div style={styles.calculatorWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Savings Calculator</h1>
          <p style={styles.subtitle}>Adjust any two values to calculate the third.</p>
        </div>
        <div style={styles.inputsContainer}>
          <InputControl
            label="Savings Goal"
            unit="£"
            value={goal}
            onChange={handleGoalChange}
            min={100}
            max={100000}
            step={100}
            isCalculated={calculatedField === 'goal'}
          />
          <InputControl
            label="Monthly Contribution"
            unit="£"
            value={contribution}
            onChange={handleContributionChange}
            min={10}
            max={2000}
            step={10}
            isCalculated={calculatedField === 'contribution'}
          />
          <InputControl
            label="Duration"
            unit="m"
            value={duration}
            onChange={handleDurationChange}
            min={1}
            max={120}
            step={1}
            isCalculated={calculatedField === 'duration'}
          />
        </div>
      </div>
    </div>
  );
}

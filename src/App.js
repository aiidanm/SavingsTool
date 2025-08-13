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
  controlsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      alignItems: 'center',
  },
  inputsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    width: '100%',
    marginTop: '1.5rem',
  },
  inputGroup: {
    flex: '1 1 200px',
    minWidth: '200px',
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
  textInputSymbolLeft: {
    paddingLeft: '2.5rem',
  },
  textInputSymbolRight: {
    paddingRight: '2.5rem',
  },
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
  inputSymbolLeft: {
    left: '1rem',
  },
  inputSymbolRight: {
    right: '1rem',
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: '#3b82f6',
  },
  buttonsContainer: {
      textAlign: 'center',
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
  },
  manualButtonsGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
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
  secondaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
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
  isCalculated,
  unitPosition = 'before',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const groupStyles = {
    ...styles.inputGroup,
    ...(isCalculated ? styles.calculatedInputGroup : {}),
  };

  const inputStyles = {
    ...styles.textInput,
    ...(unitPosition === 'before' ? styles.textInputSymbolLeft : styles.textInputSymbolRight),
    ...(isFocused ? styles.textInputFocus : {}),
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

const INITIAL_GOAL = 10000;
const INITIAL_CONTRIBUTION = 250;
const INITIAL_DURATION = 40;

export default function App() {
  const [goal, setGoal] = useState(INITIAL_GOAL);
  const [contribution, setContribution] = useState(INITIAL_CONTRIBUTION);
  const [duration, setDuration] = useState(INITIAL_DURATION);
  const [calculatedField, setCalculatedField] = useState('goal');
  const [autoCalculate, setAutoCalculate] = useState(true);

  const calculateSwitch = () => {
    setAutoCalculate(!autoCalculate);
  }

  const handleGoalChange = useCallback((e) => {
    const newGoal = Number(e.target.value);
    setGoal(newGoal);
    if (autoCalculate) {
      const newContribution = newGoal / duration;
      setContribution(isFinite(newContribution) ? newContribution : 0);
      setCalculatedField('contribution');
    }
  }, [duration, autoCalculate]);

  const handleContributionChange = useCallback((e) => {
    const newContribution = Number(e.target.value);
    setContribution(newContribution);
    if (autoCalculate) {
      const newDuration = goal / newContribution;
      setDuration(isFinite(newDuration) ? newDuration : 0);
      setCalculatedField('duration');
    }
  }, [goal, autoCalculate]);

  const handleDurationChange = useCallback((e) => {
    const newDuration = Number(e.target.value);
    setDuration(newDuration);
    if (autoCalculate) {
      const newGoal = contribution * newDuration;
      setGoal(isFinite(newGoal) ? newGoal : 0);
      setCalculatedField('goal');
    }
  }, [contribution, autoCalculate]);

  const handleCalculateGoal = () => {
    const newGoal = contribution * duration;
    setGoal(isFinite(newGoal) ? newGoal : 0);
    setCalculatedField('goal');
  };

  const handleCalculateContribution = () => {
    const newContribution = goal / duration;
    setContribution(isFinite(newContribution) ? newContribution : 0);
    setCalculatedField('contribution');
  };

  const handleCalculateDuration = () => {
    const newDuration = goal / contribution;
    setDuration(isFinite(newDuration) ? newDuration : 0);
    setCalculatedField('duration');
  };

  const handleReset = useCallback(() => {
    setGoal(INITIAL_GOAL);
    setContribution(INITIAL_CONTRIBUTION);
    setDuration(INITIAL_DURATION);
    setCalculatedField('goal');
  }, []);

  return (
    <div style={styles.appContainer}>
      <div style={styles.calculatorWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Savings Calculator</h1>
          <p style={styles.subtitle}>
            The calculator will automatically calculate the remaining field for you, highlighted in blue.
            <br />
            Alternatively, turn auto-calculate off to enter values manually, then click 'Calculate'.
          </p>
        </div>
        <div style={styles.controlsContainer}>
            <button onClick={calculateSwitch} style={styles.button}>
                {autoCalculate ? "Turn Off Autocalculate" : "Turn On Autocalculate"}
            </button>
            <div style={styles.inputsContainer}>
            <InputControl
                label="Savings Goal"
                unit="£"
                value={goal}
                onChange={handleGoalChange}
                min={100}
                max={75000}
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
                unitPosition="after"
                value={duration}
                onChange={handleDurationChange}
                min={1}
                max={240}
                step={1}
                isCalculated={calculatedField === 'duration'}
            />
            </div>
        </div>
        <div style={styles.buttonsContainer}>
            <button onClick={handleReset} style={styles.button}>
                Reset Calculator
            </button>
            { !autoCalculate && (
                <div style={styles.manualButtonsGroup}>
                    <button onClick={handleCalculateGoal} style={styles.secondaryButton}>Calculate Total</button>
                    <button onClick={handleCalculateContribution} style={styles.secondaryButton}>Calculate Monthly</button>
                    <button onClick={handleCalculateDuration} style={styles.secondaryButton}>Calculate Duration</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

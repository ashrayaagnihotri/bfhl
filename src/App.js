import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  appContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  inputSection: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '5px',
    marginBottom: '10px',
  },
  submitButton: {
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    width: '100%',
  },
  filterSection: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  filterLabel: {
    marginLeft: '10px',
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '15px',
  },
  filteredResponse: {
    marginTop: '20px',
  },
  error: {
    color: 'red',
  },
};

function App() {
  const [input, setInput] = useState('{"data":["M","1","334","4","B"]}');
  const [filters, setFilters] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      let parsedInput = JSON.parse(input);
      const res = await axios.post('https://localhost:3000/bfhl', parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError(err.message || 'Invalid input or server error');
      console.error(err);
    }
  };

  const handleFilterChange = (filter) => {
    setFilters(prevFilters => 
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div style={styles.filteredResponse}>
        <h3>Filtered Response</h3>
        {filters.includes('Numbers') && (
          <div>Numbers: {response.numbers.join(',')}</div>
        )}
        {filters.includes('Highest Alphabet') && (
          <div>Highest Alphabet: {response.highest_alphabet[0]}</div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.appContainer}>
      <h2>Sample Output:</h2>
      <div style={styles.inputSection}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="API Input"
        />
        <button onClick={handleSubmit} style={styles.submitButton}>
          Submit
        </button>
      </div>
      <div style={styles.filterSection}>
        <span>Multi Filter</span>
        <label style={styles.filterLabel}>
          <input
            type="checkbox"
            checked={filters.includes('Numbers')}
            onChange={() => handleFilterChange('Numbers')}
          />
          Numbers
        </label>
        <label style={styles.filterLabel}>
          <input
            type="checkbox"
            checked={filters.includes('Highest Alphabet')}
            onChange={() => handleFilterChange('Highest Alphabet')}
          />
          Highest Alphabet
        </label>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {renderResponse()}
    </div>
  );
}

export default App;

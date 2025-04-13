import React, { useEffect, useState } from 'react';
import './App.css';
import CreateConstituentForm from './Form';

const API_URL = process.env.REACT_APP_API_URL || '';

function App() {
  const [constituents, setConstituents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConstituents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/constituents`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setConstituents(data);
    } catch (err: any) {
      console.error('Error fetching constituents:', err);
      setError(err?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCSV = async () => {
    try {
      const response = await fetch(`${API_URL}/api/constituents/csv`, {
        method: 'GET',
        headers: { 'Content-Type': 'text/csv' },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'constituents.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  useEffect(() => {
    fetchConstituents();
  }, []);

  const handleConstituentCreated = () => {
    fetchConstituents();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Constituent Management</h1>
        <CreateConstituentForm onConstituentCreated={handleConstituentCreated} />
      </header>

      <main className="App-main">
        <section className="constituent-section">
          <div className="section-header">
            <h2>Constituents</h2>
            <button className="csv-button" onClick={getCSV}>Download CSV</button>
          </div>

          {loading && <p>Loading constituents...</p>}
          {error && <p className="error-text">Error: {error}</p>}
          {!loading && constituents.length === 0 && <p>No constituents found.</p>}

          {constituents.length > 0 && (
            <div className="table-wrapper">
              <table className="constituents-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>Address</th>
                    <th>District</th>
                    <th>Signed Up</th>
                  </tr>
                </thead>
                <tbody>
                  {constituents.map((c: any) => (
                    <tr key={c.id}>
                      <td>{c.first_name} {c.last_name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>{c.age}</td>
                      <td>{`${c.street_address}, ${c.city}, ${c.state} ${c.zip}`}</td>
                      <td>{c.district}</td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

import React, { useState } from 'react';

interface CreateConstituentFormProps {
    onConstituentCreated?: (constituent: any) => void;
}

const CreateConstituentForm: React.FC<CreateConstituentFormProps> = ({ onConstituentCreated }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get the API base URL from environment
  const API_URL = process.env.REACT_APP_API_URL || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/constituents/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, age, phone, email, street_address: streetAddress, city, state, zip, district}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create constituent');
      }

      const newConstituent = await response.json();
      setSuccess(true);
      setFirstName('');
      setLastName('');
      setAge(0);
      setPhone('');
      setEmail('');
      setStreetAddress('');
      setCity('');
      setState('');
      setZip('');
      setDistrict('');

      // Call the callback if provided
      if (onConstituentCreated) {
        onConstituentCreated(newConstituent);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-constituent-form">
      <h2>Create New Constituent</h2>
      {success && <div className="success-message">Constituent created successfully!</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
            <div className="form-group">
            <label htmlFor="first-name">First Name:</label>
            <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="last-name">Last Name:</label>
            <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="street-address">Street Address:</label>
            <input
                type="text"
                id="street-address"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="state">State:</label>
            <input
                type="text"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="zip">ZIP:</label>
            <input
                type="text"
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                disabled={loading}
            />
            </div>

            <div className="form-group">
            <label htmlFor="district">District:</label>
            <input
                type="text"
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                disabled={loading}
            />
            </div>
        </div>

        <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Constituent'}
        </button>
        </form>

    </div>
  );
};

export default CreateConstituentForm;

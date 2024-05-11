import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();
    if (!username || !password || preferences.length === 0) {
      alert('Username, password, and preferences are required.');
      return;
    }
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, preferences }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      alert('Registration successful');
      navigate('/login')
    } else {
      alert('Registration failed');
    }
  }

  const handlePreferenceChange = (preference) => {
    // If the preference is already selected, remove it from the array
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter(item => item !== preference));
    } else {
      // Otherwise, add it to the array
      setPreferences([...preferences, preference]);
    }
  };

  return (
    <form className="register" onSubmit={register}>
    <h1>Register</h1>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={ev => setUsername(ev.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={ev => setPassword(ev.target.value)}
    />
    <div className="preferences">
      <label htmlFor="world">
        <input
          id="world"
          type="checkbox"
          checked={preferences.includes('world')}
          onChange={() => handlePreferenceChange('world')}
        />
        World
      </label>
      <label htmlFor="business">
        <input
          id="business"
          type="checkbox"
          checked={preferences.includes('business')}
          onChange={() => handlePreferenceChange('business')}
        />
        Business
      </label>
      <label htmlFor="sports">
        <input
          id="sports"
          type="checkbox"
          checked={preferences.includes('sports')}
          onChange={() => handlePreferenceChange('sports')}
        />
        Sports
      </label>
      <label htmlFor="Sci">
        <input
          id="Sci"
          type="checkbox"
          checked={preferences.includes('Sci')}
          onChange={() => handlePreferenceChange('Sci')}
        />
        Science/Technology
      </label>
    </div>
    <button>Register</button>
  </form>

  );
}

import { useState, useEffect } from 'react';
import { usePreferences } from '../services/preferences';
import { useAuth } from '../services/auth';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { getPreferences, updatePreferences } = usePreferences();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPreferences = async () => {
        try {
          const prefs = await getPreferences();
          setPreferences(prefs);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPreferences();
    }
  }, [isAuthenticated, getPreferences]);

  const handlePreferenceChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    try {
      const updated = await updatePreferences({
        ...preferences,
        [name]: newValue
      });
      setPreferences(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) return <div>Please log in to view your profile</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <img src={user.picture} alt="Profile" className="profile-picture" />
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>
      
      <h3>Preferences</h3>
      <form className="preferences-form">
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            name="language"
            value={preferences?.language || 'en'}
            onChange={handlePreferenceChange}
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="notificationEnabled"
              checked={preferences?.notificationEnabled || false}
              onChange={handlePreferenceChange}
            />
            Enable Notifications
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './services/auth';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CulturalSites from './pages/CulturalSites';
import SiteDetail from './pages/SiteDetail';
import Quests from './pages/Quests';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green
    },
    secondary: {
      main: '#D32F2F', // Red
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sites" element={<CulturalSites />} />
          <Route path="/sites/:id" element={<SiteDetail />} />
          <Route path="/quests" element={<Quests />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
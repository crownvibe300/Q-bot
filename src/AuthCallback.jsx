import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const success = searchParams.get('success');

      if (error) {
        console.error('OAuth error:', error);
        // Redirect to login with error message
        navigate('/?error=oauth_failed', { replace: true });
        return;
      }

      if (success && token) {
        try {
          // Store the token and user data
          localStorage.setItem('authToken', token);
          
          // Fetch user data with the token
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData.user));
            
            // Update auth context
            window.location.href = '/dashboard';
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error processing OAuth callback:', error);
          navigate('/?error=oauth_processing_failed', { replace: true });
        }
      } else {
        // No token or success parameter, redirect to login
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #ff6b35',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Processing Google login...
      </p>
    </div>
  );
}

export default AuthCallback;

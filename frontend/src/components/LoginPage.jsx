import { useState } from 'react';
import api from '../api/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [otpValid, setOtpValid] = useState(false);
  const [userType, setUserType] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleNextStep = async (e) => {
    e.preventDefault();
    if ((!isRegistering || password === confirmPassword) && email) {
      try {
        const data = { email, password, user_type: userType };
        // Send OTP first
        if (isRegistering) {
          // Register the user
          const registerResponse = await api.post('/register', data);
          if (registerResponse.data.success) {
            setStep(2);
          }
        } else {
          // Log in the user
          const loginResponse = await api.post('/login', { email, password });
          localStorage.setItem('token', loginResponse.data.token);
          alert('Login successful');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Passwords do not match or email is invalid!');
    }
  };

  const handleOtpChange = (e) => {
    const inputOtp = e.target.value;
    setOtp(inputOtp);
    setOtpValid(inputOtp.length === 6);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const data = { email, otp, user_type: userType };
      const response = await api.post('/verify-otp', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Verification successful');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">{isRegistering ? 'Register' : 'Login'} as {userType ? (userType === 'user' ? 'Student' : 'Institution') : ''}</h2>
            {!userType && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setUserType('user')}
                  className={`w-1/2 py-2 text-white rounded-md ${userType === 'user' ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  Student
                </button>
                <button
                  onClick={() => setUserType('institution')}
                  className={`w-1/2 py-2 text-white rounded-md ${userType === 'institution' ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  Institution
                </button>
              </div>
            )}

            {userType && (
              <form onSubmit={handleNextStep}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                {isRegistering && (
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">
                  {isRegistering ? 'Register' : 'Login'}
                </button>
                <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full py-2 mt-4 border border-gray-300 rounded-md">
                  {isRegistering ? 'Already have an account? Login' : 'Create an account'}
                </button>
              </form>
            )}
          </>
        ) : (
          <form onSubmit={handleVerify}>
            <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                required
                maxLength="6"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button type="submit" disabled={!otpValid} className={`w-full py-2 ${otpValid ? 'bg-blue-500' : 'bg-gray-400'} text-white rounded-md`}>
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;

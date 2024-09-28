import { useState } from 'react';
import useFetch from '../api/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); 
  const [otpValid, setOtpValid] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (password === confirmPassword && email) {
      setStep(2); 
    } else {
      alert('Passwords do not match or email is invalid!');
    }
  };

  const handlePrevStep = (e) => {
    setStep(1); 
  };

  const handleOtpChange = (e) => {
    const inputOtp = e.target.value;
    setOtp(inputOtp);
    setOtpValid(inputOtp.length === 6); 
  };

  const handleVerify = (e) => {
    e.preventDefault();
    useFetch('/login', {
      method: 'POST',
      data: {email,password},
      headers
    })
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {step === 1 ? (
          <form onSubmit={handleNextStep}>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md text-sm hover:bg-blue-600"
            >
              Next
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
            <p className="text-gray-600 mb-4">
              Enter the OTP sent to {`${email.slice(0, 3)}****${email.slice(-3)}`} 
            </p>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="w-full px-4 py-2 border rounded-md text-sm"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-md text-sm text-white ${otpValid ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={!otpValid}
            >
              Verify
              </button>
              <p className='mt-5'>Want to Edit Email ?  <span className='text-blue-600 underline cursor-pointer' onClick={handlePrevStep} >Click here</span></p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;

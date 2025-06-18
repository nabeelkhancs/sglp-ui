import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { APICalls } from '@/api/api-calls';

const VerificationContainer = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [title, setTitle] = useState<string>();
  const [message, setMessage] = useState<string>(
    'We sent a verification link to the email address you used to sign up. Please click that link to confirm your account. If you can\'t see the email, please check your spam or junk folder.'
  );

  useEffect(() => {
    if (!token) {
      setMessage(`We sent a verification link to the email address you used to sign up. Please click that link to confirm your account. If you can't see the email, please check your spam or junk folder.`);
    }
    if (token) {
      setMessage('Verifying your account, please wait...');
      APICalls.verifyEmail(token)
        .then((res) => {
          if (res?.status === 200) {
            setTitle('Email Verified');
            setMessage('Your email has been verified! You can now log in.');
          } else {
            setTitle('Verification Failed');
            setMessage('Verification failed or link expired. Please try again or contact support.');
          }
        })
        .catch((err) => {
          setTitle('Verification Failed');
          setMessage('Verification failed or link expired. Please try again or contact support.');
        });
    }
  }, [searchParams]);

  return (
    <div className="auth-page verify-email">
      <div className="mb-5">
        <Link href="/signup" className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1 text-white">
          <span><Image src="/icons/chevron-left.svg" width={20} height={20} alt="Back" /></span>Back
        </Link>
      </div>
      <div className="content">
        <Image className="mb-4" src="/icons/verify-email.svg" width={64} height={64} alt="Verify Email" />
        {token ? (
          <h2>{title}</h2>
        ) : (
          <h2>Verify your email <br />
            to confirm your account</h2>
        )}
        <p className="fs-6 mb-5">{message}</p>

        <Link href="/login" className="btn link-btn primary-bg text-white fs-14 fw-medium" style={{ width: '200px' }}>
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default VerificationContainer;
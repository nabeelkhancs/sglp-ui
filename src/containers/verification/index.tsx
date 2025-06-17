
import Link from 'next/link';
import Image from 'next/image';

const VerificationContainer = () => {
  return (
    <div className="auth-page verify-email">
      <div className="mb-5">
        <Link href="/signup" className="bg-transparent p-0 border-0 w-auto d-flex align-items-center gap-1 text-white">
          <span><Image src="/icons/chevron-left.svg" width={20} height={20} alt="Back" /></span>Back
        </Link>
      </div>
      <div className="content">
        <Image className="mb-4" src="/icons/verify-email.svg" width={64} height={64} alt="Verify Email" />
        <h2>Verify your email <br />
          to confirm your account</h2>
        <p className="fs-6 mb-5">We sent a verification link to the email address you used to sign up. Please click that link to confirm your account. If you can't see the email, please check your spam or junk folder.</p>

        <Link href="/login" className="btn link-btn primary-bg text-white fs-14 fw-medium" style={{ width: '200px' }}>
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default VerificationContainer;
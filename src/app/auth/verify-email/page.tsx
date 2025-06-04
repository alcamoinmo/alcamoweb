import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Check your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent you a verification email. Please click the link in the email to verify your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                try signing in
              </Link>{' '}
              to resend the verification email.
            </p>
            <div className="text-center">
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Return to home page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
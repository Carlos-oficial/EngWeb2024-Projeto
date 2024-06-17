export default function SignInCard({ message }: { message: string }) {
  return (
    <div className='flex flex-col justify-center items-center space-y-2'>
      <span className='flex flex-col items-center font-semibold text-lg'>
        <span className='flex space-x-1 items-center'>
          <i className='ph ph-info'></i>
          <p>Oops!</p>
        </span>
        <p>{message}</p>
      </span>
      <span>
        Please{' '}
        <a className='underline font-semibold text-primary' href='/auth/signin'>
          sign in
        </a>{' '}
        or{' '}
        <a className='underline font-semibold text-primary' href='/auth/signup'>
          create an account
        </a>{' '}
        to continue.
      </span>
    </div>
  );
}

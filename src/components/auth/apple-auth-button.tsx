
"use client"

import {Button} from '@/components/ui/button';

export function AppleAuthButton() {
  const handleAppleSignIn = () => {
    // Implement Apple sign-in logic here
    console.log('Signing in with Apple...');
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleAppleSignIn}
    >
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19.3,13.63a4.34,4.34,0,0,1-4.29,4.39,4.41,4.41,0,0,1-4.37-4.21,1.5,1.5,0,0,0-1.5-1.5h-.06a1.5,1.5,0,0,0-1.5,1.45,7.39,7.39,0,0,0,5.82,7.34,7.44,7.44,0,0,0,7.67-5.83,1.5,1.5,0,0,0-1.44-1.64h-.06A.1.1,0,0,1,19.3,13.63Zm-8.48-3.69a4.2,4.2,0,0,1,3.46-2.1,1.5,1.5,0,0,0,1.15-2.26,4.32,4.32,0,0,0-5.89.79,4.24,4.24,0,0,0-1,6.06,1.5,1.5,0,0,0,2.28-1.15A4.18,4.18,0,0,1,10.82,9.94Z"
          ></path>
        </svg>
        <span className="ml-2">Continue with Apple</span>
      </div>
    </Button>
  );
}

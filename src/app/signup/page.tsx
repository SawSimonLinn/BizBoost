
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmailSignupForm } from '@/components/auth/email-signup-form';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { FacebookAuthButton } from '@/components/auth/facebook-auth-button';
import { AppleAuthButton } from '@/components/auth/apple-auth-button';

export default function SignupPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Get started with BizBoost to track your franchise performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailSignupForm />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <GoogleAuthButton />
          <FacebookAuthButton />
          <AppleAuthButton />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

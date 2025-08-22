
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/app-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()
  
    React.useEffect(() => {
      if (!loading && user) {
        router.push('/dashboard')
      }
    }, [user, loading, router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex justify-center">
                    <div className="flex items-center gap-2">
                        <Logo />
                        <h1 className="font-headline text-2xl font-semibold text-primary">
                            BizBoost
                        </h1>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}



"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { FacebookAuthButton } from "@/components/auth/facebook-auth-button";
import { AppleAuthButton } from "@/components/auth/apple-auth-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailSignupForm } from "@/components/auth/email-signup-form";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/language-switcher";


export default function SettingsPage() {
    const { user, logout, loading } = useAuth();

    return (
        <div>
            <PageHeader title="Settings" />
             <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Language</CardTitle>
                    <CardDescription>Choose your preferred language.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LanguageSwitcher />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account settings. Sign up or log in to save your data.</CardDescription>
                </CardHeader>
                <CardContent>
                   {user ? (
                        <div className="space-y-4">
                            <p>Welcome, <span className="font-semibold">{user.email}</span>!</p>
                            <Button onClick={logout} disabled={loading}>
                                {loading ? "Logging out..." : "Log Out"}
                            </Button>
                        </div>
                   ) : (
                        <Tabs defaultValue="login" className="max-w-md">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Login</CardTitle>
                                        <CardDescription>Access your saved dashboard and settings.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <EmailLoginForm />
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
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="signup">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign Up</CardTitle>
                                        <CardDescription>Create an account to save your progress.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                   )}
                </CardContent>
            </Card>
        </div>
    )
}

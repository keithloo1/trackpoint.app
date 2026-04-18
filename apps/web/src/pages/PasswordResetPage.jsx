
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext.jsx';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const PasswordResetPage = () => {
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setIsSuccess(true);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Helmet>
        <title>Reset Password - TRACK</title>
      </Helmet>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">TRACK</h1>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Check your email for a link to reset your password." 
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            ) : (
              <div className="py-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Return to Login</Link>
                </Button>
              </div>
            )}
          </CardContent>
          {!isSuccess && (
            <CardFooter className="flex justify-center border-t p-4">
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary flex items-center font-medium">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PasswordResetPage;

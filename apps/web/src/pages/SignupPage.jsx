
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext.jsx';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: ''
    }
  });

  const password = watch('password', '');

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.match(/[A-Z]/)) score += 1;
    if (pass.match(/[0-9]/)) score += 1;
    if (pass.match(/[^A-Za-z0-9]/)) score += 1;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await signup(data.email, data.password, data.passwordConfirm);
      navigate('/dashboard');
    } catch (error) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Helmet>
        <title>Sign Up - TRACK</title>
      </Helmet>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">TRACK</h1>
          <p className="text-gray-500">Create an account to start managing your clients.</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your details to create a new account.</CardDescription>
          </CardHeader>
          <CardContent>
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
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                      <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-transparent'} transition-all w-1/3`} />
                      <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-transparent'} transition-all w-1/3`} />
                      <div className={`h-full ${strength.score >= 4 ? strength.color : 'bg-transparent'} transition-all w-1/3`} />
                    </div>
                    <p className={`text-xs mt-1 font-medium ${
                      strength.label === 'Weak' ? 'text-red-500' : 
                      strength.label === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {strength.label}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <Input 
                  id="passwordConfirm" 
                  type="password" 
                  {...register('passwordConfirm')}
                  className={errors.passwordConfirm ? 'border-destructive' : ''}
                />
                {errors.passwordConfirm && <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;

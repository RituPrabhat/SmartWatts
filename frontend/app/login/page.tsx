'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Mail, Lock, Eye, EyeOff, AirVent, Refrigerator, WashingMachine, Lightbulb, Fan, Tv } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STEPS = [
  { title: 'Add your appliances', desc: 'Pick from common presets — AC, fridge, washing machine — or add your own.' },
  { title: 'Log usage weekly', desc: 'A one-click weekly snapshot keeps your projected bill accurate.' },
  { title: 'See the breakdown & act', desc: 'Know which appliance is driving your cost, and what to change.' },
];

const BG_ICONS = [
  { Icon: AirVent, size: 42, top: 70, right: 80, rotate: -6 },
  { Icon: Refrigerator, size: 34, top: 180, right: 210, rotate: 10 },
  { Icon: Tv, size: 38, top: 60, right: 280, rotate: 4 },
  { Icon: Lightbulb, size: 30, top: 250, right: 100, rotate: -12 },
  { Icon: WashingMachine, size: 36, bottom: 180, right: 60, rotate: 8 },
  { Icon: Fan, size: 28, bottom: 110, right: 200, rotate: -10 },
  { Icon: AirVent, size: 32, bottom: 60, right: 320, rotate: 6 },
  { Icon: Refrigerator, size: 26, top: 340, right: 40, rotate: 14 },
  { Icon: Fan, size: 30, bottom: 260, right: 340, rotate: -4 },
  { Icon: Lightbulb, size: 36, top: 40, right: '40%', rotate: 9 },
  { Icon: Tv, size: 28, top: 150, right: 400, rotate: -8 },
  { Icon: WashingMachine, size: 32, bottom: 340, right: 130, rotate: 12 },
  { Icon: Fan, size: 24, top: 420, right: 180, rotate: -15 },
  { Icon: AirVent, size: 30, bottom: 20, right: 460, rotate: 5 },
  { Icon: Refrigerator, size: 34, top: 300, right: 420, rotate: -6 },
  { Icon: Tv, size: 26, bottom: 400, right: 280, rotate: 10 },
  { Icon: Lightbulb, size: 38, top: 10, right: 460, rotate: -3 },
  { Icon: WashingMachine, size: 22, bottom: 230, right: 400, rotate: 7 },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dot-grid">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-sidebar border-r border-border relative overflow-hidden">
        {BG_ICONS.map(({ Icon, size, rotate, ...pos }, i) => (
          <Icon
            key={i}
            className="absolute text-primary opacity-[0.24] pointer-events-none"
            style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, ...pos }}
          />
        ))}

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground font-semibold text-lg tracking-tight">SmartWatts</span>
        </div>

        <div className="space-y-10 relative z-10">
          <div>
            <h2 className="text-4xl font-semibold text-foreground leading-tight tracking-tight">
              From appliance list<br />
              <span className="text-primary">to accurate bill.</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed max-w-sm">
              Three simple steps, and the picture stays current every week.
            </p>
          </div>

          <div>
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex gap-4 relative pb-6 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                )}
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 text-sm font-semibold z-10">
                  {i + 1}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{s.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5 max-w-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6 relative z-10">
          <p className="text-muted-foreground text-xs">
            Calculated using <span className="text-foreground font-medium">real slab-based electricity tariffs</span>, with support for government subsidy connections.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">SmartWatts</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] border border-[color-mix(in_srgb,var(--destructive)_35%,transparent)] text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

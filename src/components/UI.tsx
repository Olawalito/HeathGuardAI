import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  key?: React.Key | null;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("bg-white rounded border border-slate-200 shadow-sm overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export function Button({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' }) {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  };

  return (
    <button 
      className={cn(
        "px-3 py-1.5 rounded font-bold text-[10px] uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", 
        variants[variant], 
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string, variant?: 'default' | 'success' | 'warning' | 'error' | 'blue' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-rose-100 text-rose-700 border-rose-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={cn("px-1.5 py-0.5 border rounded text-[10px] font-bold uppercase tracking-tight", variants[variant], className)}>
      {children}
    </span>
  );
}

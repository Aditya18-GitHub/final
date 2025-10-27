import React from 'react';
import { getInitials } from '@/utils/task.utils';
import clsx from 'clsx';

export interface AvatarProps {
  name?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  color,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  const initials = name ? getInitials(name) : '?';
  const bgColor = color || 'bg-primary-500';
  
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full text-white font-medium',
        bgColor,
        sizeClasses[size],
        className
      )}
      aria-label={name ? `Avatar for ${name}` : 'Avatar'}
    >
      {initials}
    </div>
  );
};

import React from 'react';
import { Pressable, Text } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'accent';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onPress, 
  disabled = false, 
  className = '',
  variant = 'default',
  size = 'default'
}) => {
  const baseStyles = 'flex items-center justify-center rounded-md font-medium';
  
  const variants = {
    default: 'bg-[#203627] text-[#EFEFEF]',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-[#9DC4D5] bg-white text-[#203627]',
    secondary: 'bg-[#9DC4D5] text-[#203627]',
    ghost: 'text-[#203627]',
    link: 'text-[#9DC4D5] underline',
    accent: 'bg-[#E8FF40] text-[#203627]'
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {typeof children === 'string' ? (
        <Text className="text-center font-medium">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
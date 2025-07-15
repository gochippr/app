import React from 'react';
import { Pressable, Text } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
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
    default: 'bg-gray-900 text-white',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-gray-300 bg-white text-gray-700',
    secondary: 'bg-gray-100 text-gray-900',
    ghost: 'text-gray-700',
    link: 'text-blue-600 underline'
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
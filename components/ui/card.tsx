import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <View className={`bg-white rounded-lg border border-[#9DC4D5] shadow-lg ${className}`}>
      {children}
    </View>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <View className={`p-6 ${className}`}>
      {children}
    </View>
  );
};
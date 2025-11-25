import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingLayoutProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerColor?: string;
  spinnerSize?: 'small' | 'large';
}

const LoadingLayout: React.FC<LoadingLayoutProps> = ({
  isLoading,
  children,
  spinnerColor = '#007AFF',
  spinnerSize = 'large',
}) => {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size={spinnerSize} color={spinnerColor} />
      </View>
    );
  }

  return <>{children}</>;
};

export default LoadingLayout;

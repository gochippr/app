import React from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

interface LoadingLayoutProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerColor?: string;
  spinnerSize?: "small" | "large";
}

const LoadingLayout: React.FC<LoadingLayoutProps> = ({
  isLoading,
  children,
  spinnerColor = "#203627",
  spinnerSize = "large",
}) => {
  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "#EFEFEF" }}
      >
        <ActivityIndicator size={spinnerSize} color={spinnerColor} />
      </SafeAreaView>
    );
  }

  return <SafeAreaView className="p-4">{children}</SafeAreaView>;
};

export default LoadingLayout;

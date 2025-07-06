import SignInWithGoogleButton from "@/components/SignInWithGoogleButton";
import { useAuth } from "@/context/auth";
import { Text, View } from "react-native";

export default function Index() {

  const { signIn, isLoading } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SignInWithGoogleButton
        onPress={signIn}
        disabled={false}
      />
      <Text style={{ marginTop: 20 }}>Welcome to Chippr!</Text>
    </View>
  );
}

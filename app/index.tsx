import SignInWithGoogleButton from "@/components/SignInWithGoogleButton";
import { useAuth } from "@/context/auth";
import MockProtectedApi from "@/services/mockProtectedApi";
import { Pressable, Text, View } from "react-native";

import { useState } from "react";


export default function Index() {
  const [protectedData, setProtectedData] = useState({});
  const { signIn, isLoading, signOut, user, fetchWithAuth } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      { user && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 20 }}>
            Welcome back, {user.name}!
          </Text>

          <Pressable
            onPress={signOut}
            style={{
              padding: 10,  
              backgroundColor: "#f00",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff" }}>Sign Out</Text>
          </Pressable>
        </View>
      )}

      { isLoading && <Text>Loading...</Text> }

      { !user && (
        <SignInWithGoogleButton
          onPress={signIn}
          disabled={false}
        />
      )}

      <Text style={{ marginTop: 20 }}>
        {JSON.stringify(protectedData, null, 2)}
      </Text>

      <Pressable
        onPress={async () => {
          try {
            const data = await MockProtectedApi.getProtectedData(fetchWithAuth);
            console.log("Protected data:", data);
            setProtectedData(data);
          } catch (error) {
            console.error("Error fetching protected data:", error);
          }
        }}
        style={{
          padding: 10,
          backgroundColor: "#007bff",
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff" }}>Fetch Protected Data</Text>
      </Pressable>


      
      <Text style={{ marginTop: 20 }}>Welcome to Chippr!</Text>
    </View>
  );
}

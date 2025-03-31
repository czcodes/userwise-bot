
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import OnboardingFlow from "@/components/auth/OnboardingFlow";
import AppLayout from "@/components/layout/AppLayout";
import ChatInterface from "@/components/chat/ChatInterface";
import CredentialManager from "@/components/credentials/CredentialManager";
import AdminPanel from "@/components/admin/AdminPanel";
import { Toaster } from "@/components/ui/toaster";

// Auth states
type AuthState = "unauthenticated" | "onboarding" | "authenticated";

const Index = () => {
  const [authState, setAuthState] = useState<AuthState>("unauthenticated");
  const [userName, setUserName] = useState("John Doe");

  const handleLoginSuccess = () => {
    setAuthState("onboarding");
  };

  const handleOnboardingComplete = () => {
    setAuthState("authenticated");
  };

  const handleLogout = () => {
    setAuthState("unauthenticated");
  };

  // Render auth form if user is not authenticated
  if (authState === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">DevOps Chatbot</h1>
            <p className="text-gray-600">Your AI assistant for Airflow, MongoDB, and Kubernetes</p>
          </div>
          <AuthForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // Render onboarding flow if user is authenticated but not onboarded
  if (authState === "onboarding") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 p-4">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Render app layout with content if user is authenticated and onboarded
  return (
    <AppLayout onLogout={handleLogout} userName={userName}>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/credentials" element={<CredentialManager />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/settings" element={<div className="p-4">Settings page (coming soon)</div>} />
      </Routes>
    </AppLayout>
  );
};

export default Index;

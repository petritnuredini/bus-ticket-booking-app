import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../helpers/axiosInstance";
import AgentDashboard from "../components/Chat/AgentDashboard";
import { LogOut, User, Settings } from "react-feather";

const AgentDashboardPage = () => {
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { agentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAgent = async () => {
      try {
        // Check if agent is logged in
        const storedAgent = localStorage.getItem("agent");
        if (!storedAgent) {
          navigate("/agent/login");
          return;
        }

        const agentData = JSON.parse(storedAgent);
        if (agentData._id !== agentId) {
          navigate("/agent/login");
          return;
        }

        // Verify agent with server
        const token = localStorage.getItem("agentToken");
        if (!token) {
          navigate("/agent/login");
          return;
        }

        // axiosInstance automatically adds auth headers
        const response = await axiosInstance.get(`/agents/${agentId}`);
        setAgent(response.data);
      } catch (error) {
        console.error("Error loading agent:", error);
        setError("Failed to load agent data");
        localStorage.removeItem("agent");
        navigate("/agent/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [agentId, navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("agentToken");
      if (token) {
        // axiosInstance automatically adds auth headers
        await axiosInstance.post(`/agents/${agentId}/logout`, {});
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("agent");
      localStorage.removeItem("agentToken");
      navigate("/agent/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate("/agent/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Customer Support Dashboard
            </h1>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{agent.name}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <User size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1">
        <AgentDashboard agentId={agentId} agent={agent} />
      </div>
    </div>
  );
};

export default AgentDashboardPage;

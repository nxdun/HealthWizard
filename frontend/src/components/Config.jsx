import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const ConfigurationEditor = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin");
      const configData = response.data.find((c) => c.key === "healthwizard");
      setConfig(configData);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch configuration");
      setLoading(false);
    }
  };

  // Handle Input Changes
  // Handle Input Changes
const handleInputChange = (e, field) => {
  const { name, value, type, checked } = e.target;
  const newValue = type === "checkbox" ? checked : value;

  // Handle paymentMethods as JSON
  if (name === "paymentMethods") {
    let parsedValue;
    try {
      parsedValue = JSON.parse(newValue); // Try to parse the input
    } catch (error) {
      toast.error("Invalid JSON format for payment methods");
      return; // Exit if the JSON is not valid
    }
    setConfig((prevConfig) => ({
      ...prevConfig,
      settings: {
        ...prevConfig.settings,
        paymentMethods: parsedValue, // Save parsed JSON as object
      },
    }));
  } else {
    setConfig((prevConfig) => ({
      ...prevConfig,
      settings: {
        ...prevConfig.settings,
        [name]: newValue,
      },
    }));
  }
};


  // Save Configuration
  const saveConfig = async () => {
    try {
      setLoading(true);
      await axios.put(`/admin/${config.key}`, config);
      toast.success("Configuration updated successfully");
      setLoading(false);
      navigate("/dashboard/config");
    } catch (error) {
      toast.error("Failed to update configuration");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading)
    return (
      <div class="flex-col gap-4 w-full flex items-center justify-center">
        <div class="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div class="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    );

  if (!config)
    return <div className="text-center mt-10">No Configuration Found</div>;

  return (
    <section className="user-section">
      <div className="wid mx-auto max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Edit HealthWizard Configuration
        </h2>
        <form>
          {/* Site Name */}
          <div className="mb-4">
            <label
              htmlFor="siteName"
              className="block text-gray-700 font-bold mb-2"
            >
              Web Site Name:
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={config.settings.siteName || ""}
              onChange={(e) => handleInputChange(e, "settings")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Enable Feature X */}
          <div className="mb-4">
            <label
              htmlFor="enableFeatureX"
              className="block text-gray-700 font-bold mb-2"
            >
              Enable Feature X:
            </label>
            <input
              type="checkbox"
              id="enableFeatureX"
              name="enableFeatureX"
              checked={config.settings.enableFeatureX || false}
              onChange={(e) => handleInputChange(e, "settings")}
              className="w-5 h-5"
            />
          </div>

          {/* Enable Feature Y */}
          <div className="mb-4">
            <label
              htmlFor="enableFeatureY"
              className="block text-gray-700 font-bold mb-2"
            >
              Enable Payments:
            </label>
            <input
              type="checkbox"
              id="enableFeatureY"
              name="enableFeatureY"
              checked={config.settings.enableFeatureY || false}
              onChange={(e) => handleInputChange(e, "settings")}
              className="w-5 h-5"
            />
          </div>

          {/* Payment Methods */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Methods:
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              name="paymentMethods"
              value={JSON.stringify(config.settings.paymentMethods, null, 2)}
              onChange={(e) => handleInputChange(e, "settings")}
              rows="6"
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={saveConfig}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </section>
  );
};

export default ConfigurationEditor;

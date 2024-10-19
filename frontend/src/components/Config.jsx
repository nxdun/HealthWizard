import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const ConfigurationEditor = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/");
      const configData = response.data.find(c => c.key === "healthwizard");
      setConfig(configData);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch configuration");
      setLoading(false);
    }
  };

  // Handle Input Changes
  const handleInputChange = (e, field) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      settings: {
        ...config.settings,
        [field]: {
          ...config.settings[field],
          [name]: value
        }
      }
    });
  };

  // Save Configuration
  const saveConfig = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/admin/${config._id}`, config);
      toast.success("Configuration updated successfully");
      setLoading(false);
      navigate("/admin/healthwizard");
    } catch (error) {
      toast.error("Failed to update configuration");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!config) return <div className="text-center mt-10">No Configuration Found</div>;

  return (
    <section className="p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Edit HealthWizard Configuration</h2>
        <form>
          {/* Site Name */}
          <div className="mb-4">
            <label htmlFor="siteName" className="block text-gray-700 font-bold mb-2">
              Site Name:
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
            <label htmlFor="enableFeatureX" className="block text-gray-700 font-bold mb-2">
              Enable Feature X:
            </label>
            <input
              type="checkbox"
              id="enableFeatureX"
              name="enableFeatureX"
              checked={config.settings.enableFeatureX}
              onChange={(e) => handleInputChange(e, "settings")}
              className="w-5 h-5"
            />
          </div>

          {/* Enable Feature Y */}
          <div className="mb-4">
            <label htmlFor="enableFeatureY" className="block text-gray-700 font-bold mb-2">
              Enable Feature Y:
            </label>
            <input
              type="checkbox"
              id="enableFeatureY"
              name="enableFeatureY"
              checked={config.settings.enableFeatureY}
              onChange={(e) => handleInputChange(e, "settings")}
              className="w-5 h-5"
            />
          </div>

          {/* Payment Methods */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Payment Methods:</label>
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

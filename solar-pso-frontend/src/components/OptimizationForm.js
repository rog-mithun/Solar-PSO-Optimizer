// OptimizationForm.js
import React, { useState } from "react";
import { optimizeSites, downloadCSV } from "../api";

const OptimizationForm = ({ onResults }) => {
  const [weights, setWeights] = useState({
    irradiance: 0.5,
    land_cost: 0.3,
    proximity: 0.2,
  });
  const [numSites, setNumSites] = useState(5);
  const [useUploaded, setUseUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleChange = (e) => {
    setWeights({
      ...weights,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setDownloadUrl("");
    try {
      const response = await optimizeSites({
        num_sites: numSites,
        weight_irradiance: weights.irradiance,
        weight_land_cost: weights.land_cost,
        weight_proximity: weights.proximity,
        use_uploaded: useUploaded,
      });

      onResults(response.data.optimized_sites);
      setDownloadUrl(response.data.download_url);
    } catch (err) {
      alert("❌ Optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-lg font-semibold mb-3">⚙️ Optimize Solar Plant Sites</h3>

      <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
        <div className="text-left w-full">
          <label className="block text-sm font-medium mb-1">Number of Sites:</label>
          <input
            type="number"
            value={numSites}
            min="1"
            onChange={(e) => setNumSites(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="text-left w-full">
          <label className="block text-sm font-medium mb-1">Weight - Solar Irradiance:</label>
          <input
            type="number"
            name="irradiance"
            step="0.1"
            max="1"
            min="0"
            value={weights.irradiance}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="text-left w-full">
          <label className="block text-sm font-medium mb-1">Weight - Land Cost:</label>
          <input
            type="number"
            name="land_cost"
            step="0.1"
            max="1"
            min="0"
            value={weights.land_cost}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="text-left w-full">
          <label className="block text-sm font-medium mb-1">Weight - Proximity to Infra:</label>
          <input
            type="number"
            name="proximity"
            step="0.1"
            max="1"
            min="0"
            value={weights.proximity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useUploaded}
            onChange={() => setUseUploaded(!useUploaded)}
          />
          Use uploaded dataset
        </label>

        <button
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Running PSO..." : "Run Optimization"}
        </button>

        {downloadUrl && (
          <button
            onClick={() => downloadCSV(downloadUrl)}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download Results
          </button>
        )}
      </div>
    </div>
  );
};

export default OptimizationForm;

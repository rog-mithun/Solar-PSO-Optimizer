// App.js
import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import OptimizationForm from "./components/OptimizationForm";
import MapResults from "./components/MapResults";
import "./App.css";

function App() {
  const [results, setResults] = useState([]);
  const [uploadedPath, setUploadedPath] = useState("");

  const handleUploadSuccess = (path) => {
    setUploadedPath(path);
  };

  const handleOptimizationResults = (optimizedData) => {
    console.log("Results received:", optimizedData);
    if (Array.isArray(optimizedData)) {
      setResults(optimizedData);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-700">
            🌞 Solar Power Plant Optimizer
          </h1>
          <p className="text-sm text-gray-600">
            Optimize placement using Particle Swarm Optimization (PSO)
          </p>
        </header>

        {/* Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-center">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-center">
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-center">
            <OptimizationForm onResults={handleOptimizationResults} />
          </div>
        </div>

        {/* Results */}
        {Array.isArray(results) && results.length > 0 ? (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 text-center">
                📋 Optimized Site Results
              </h3>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Latitude</th>
                    <th className="px-4 py-2">Longitude</th>
                    <th className="px-4 py-2">Irradiance</th>
                    <th className="px-4 py-2">Land Cost</th>
                    <th className="px-4 py-2">Infra Distance</th>
                    <th className="px-4 py-2">Fitness</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((site, index) => (
                    <tr
                      key={index}
                      className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-yellow-50`}
                    >
                      <td className="px-4 py-2 font-medium">{index + 1}</td>
                      <td className="px-4 py-2">{site.latitude.toFixed(4)}</td>
                      <td className="px-4 py-2">{site.longitude.toFixed(4)}</td>
                      <td className="px-4 py-2">{site.solar_irradiance}</td>
                      <td className="px-4 py-2">₹{site.land_cost}</td>
                      <td className="px-4 py-2">{site.distance_to_infra} km</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            site.fitness > 0.8
                              ? "bg-green-100 text-green-800"
                              : site.fitness > 0.5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {site.fitness.toFixed(3)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MapResults results={results} />
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No optimization results to display yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
  
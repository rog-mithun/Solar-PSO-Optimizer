import numpy as np
from geopy.distance import geodesic
import pandas as pd
import uuid
import os

RESULT_DIR = "results"
os.makedirs(RESULT_DIR, exist_ok=True)

def save_results_as_csv(results):
    df = pd.DataFrame(results)
    file_id = str(uuid.uuid4())[:8]
    file_path = os.path.join(RESULT_DIR, f"optimized_sites_{file_id}.csv")
    df.to_csv(file_path, index=False)
    return file_path

def interpolate_feature(lat, lon, ref_data, feature):
    # Weighted average based on inverse distance
    distances = ref_data.apply(lambda row: geodesic((lat, lon), (row.latitude, row.longitude)).km, axis=1)
    weights = 1 / (distances + 1e-5)
    weighted_values = ref_data[feature] * weights
    return weighted_values.sum() / weights.sum()

def compute_fitness(lat, lon, ref_data, weights):
    irr = interpolate_feature(lat, lon, ref_data, "solar_irradiance")
    cost = interpolate_feature(lat, lon, ref_data, "land_cost")
    infra_dist = ref_data.apply(lambda row: geodesic((lat, lon), (row.latitude, row.longitude)).km, axis=1).min()

    # Normalize manually (assumed ranges)
    norm_irr = (irr - 4.5) / (6.0 - 4.5)
    norm_cost = (200 - cost) / (200 - 50)
    norm_prox = (20 - infra_dist) / 20

    fitness = weights["irradiance"] * norm_irr + weights["land_cost"] * norm_cost + weights["proximity"] * norm_prox
    return fitness, irr, cost, infra_dist

def optimize_locations(data, request):
    num_particles = 30
    num_iterations = 50
    bounds = {"lat": (8.0, 13.5), "lon": (76.5, 80.5)}  # Tamil Nadu region

    inertia = 0.7
    cognitive = 1.5
    social = 2.0

    # Initialize particles randomly
    particles = np.array([
        [np.random.uniform(*bounds["lat"]), np.random.uniform(*bounds["lon"])]
        for _ in range(num_particles)
    ])
    velocities = np.zeros_like(particles)
    p_best = particles.copy()
    p_best_fitness = np.array([compute_fitness(lat, lon, data, {
        "irradiance": request.weight_irradiance,
        "land_cost": request.weight_land_cost,
        "proximity": request.weight_proximity
    })[0] for lat, lon in particles])
    g_best = p_best[np.argmax(p_best_fitness)]
    
    for _ in range(num_iterations):
        for i in range(num_particles):
            r1, r2 = np.random.rand(), np.random.rand()
            velocities[i] = (
                inertia * velocities[i] +
                cognitive * r1 * (p_best[i] - particles[i]) +
                social * r2 * (g_best - particles[i])
            )
            particles[i] += velocities[i]
            # Clamp to bounds
            particles[i][0] = np.clip(particles[i][0], *bounds["lat"])
            particles[i][1] = np.clip(particles[i][1], *bounds["lon"])

            fitness, *_ = compute_fitness(particles[i][0], particles[i][1], data, {
                "irradiance": request.weight_irradiance,
                "land_cost": request.weight_land_cost,
                "proximity": request.weight_proximity
            })
            if fitness > p_best_fitness[i]:
                p_best[i] = particles[i]
                p_best_fitness[i] = fitness

        g_best = p_best[np.argmax(p_best_fitness)]

    # Sort and return top N results
    best_indices = np.argsort(p_best_fitness)[::-1][:request.num_sites]
    result = []
    for idx in best_indices:
        lat, lon = p_best[idx]
        fitness, irr, cost, infra = compute_fitness(lat, lon, data, {
            "irradiance": request.weight_irradiance,
            "land_cost": request.weight_land_cost,
            "proximity": request.weight_proximity
        })
        result.append({
            "latitude": lat,
            "longitude": lon,
            "solar_irradiance": round(irr, 2),
            "land_cost": round(cost, 2),
            "distance_to_infra": round(infra, 2),
            "fitness": round(fitness, 4)
        })

    return result

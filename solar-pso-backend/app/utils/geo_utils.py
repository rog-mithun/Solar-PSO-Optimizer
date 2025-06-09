from geopy.distance import geodesic

def calculate_distance_km(lat1, lon1, lat2, lon2):
    """
    Calculates geodesic distance between two coordinates in kilometers.
    """
    return geodesic((lat1, lon1), (lat2, lon2)).km

def find_nearest_point(target_lat, target_lon, point_list):
    """
    Given a target coordinate and a list of (lat, lon) points,
    returns the nearest point and its distance.
    """
    min_dist = float("inf")
    nearest = None
    for lat, lon in point_list:
        dist = calculate_distance_km(target_lat, target_lon, lat, lon)
        if dist < min_dist:
            min_dist = dist
            nearest = (lat, lon)
    return nearest, min_dist

def generate_grid_over_region(lat_bounds, lon_bounds, step=0.1):
    """
    Generates a grid of (lat, lon) points across a region.
    Useful for synthetic testing or heatmap generation.
    """
    lat_points = list(frange(lat_bounds[0], lat_bounds[1], step))
    lon_points = list(frange(lon_bounds[0], lon_bounds[1], step))
    return [(lat, lon) for lat in lat_points for lon in lon_points]

def frange(start, stop, step):
    """
    Float range generator.
    """
    while start <= stop:
        yield round(start, 6)
        start += step

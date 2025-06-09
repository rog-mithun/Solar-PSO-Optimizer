import pandas as pd

def load_data(path: str):
    """
    Load the solar site reference data CSV.
    Columns must include: latitude, longitude, solar_irradiance, land_cost
    """
    try:
        df = pd.read_csv(path)
        required_columns = {"latitude", "longitude", "solar_irradiance", "land_cost"}
        if not required_columns.issubset(df.columns):
            raise ValueError("CSV must contain: latitude, longitude, solar_irradiance, land_cost")

        return df
    except Exception as e:
        raise RuntimeError(f"Error loading data: {e}")

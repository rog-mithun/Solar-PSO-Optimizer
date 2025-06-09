from pydantic import BaseModel

class OptimizationRequest(BaseModel):
    num_sites: int
    weight_irradiance: float
    weight_land_cost: float
    weight_proximity: float
    use_uploaded: bool = False 
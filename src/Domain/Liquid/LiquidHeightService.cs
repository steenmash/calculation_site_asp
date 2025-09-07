using System;

namespace Calculation.Domain.Liquid;

public readonly record struct LiquidHeightResult(double Height, double Velocity);

public static class LiquidHeightService
{
    public static LiquidHeightResult CalcLiquidHeight(double flow_m3_h, double diameter_mm, double holes, double mu = 0.62)
    {
        const double g = 9.81;
        if (flow_m3_h <= 0 || diameter_mm <= 0 || holes <= 0 || mu <= 0)
            return new LiquidHeightResult(double.NaN, double.NaN);
        var Q = flow_m3_h / 3600.0;
        var d = diameter_mm / 1000.0;
        var area = Math.PI * d * d / 4.0;
        var velocity = Q / (area * holes);
        var height = Math.Pow(velocity / mu, 2.0) / (2.0 * g);
        return new LiquidHeightResult(height, velocity);
    }
}

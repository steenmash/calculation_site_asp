using System;
using System.Collections.Generic;

namespace Calculation.Domain.Hydraulics;

public readonly record struct PipeResistanceResult(double Rho, double Mu, double Velocity, double Re, double Lambda, double RelativeRoughness, double DeltaP);

public static class HydraulicsService
{
    private static readonly Dictionary<string, Fluid> Fluids = new()
    {
        ["water"] = new Fluid(tMin:0.1, tMax:99,
            Density: T => 1000 * (1 - ((T + 288.9414) * (T - 3.9863) * (T - 3.9863)) / (508929.2 * (T + 68.12963))),
            Viscosity: T => 2.414e-5 * Math.Pow(10, 247.8 / (T + 133.15))),
        ["diesel"] = new Fluid(tMin:-25, tMax:150,
            Density: T => LinearInterpolate(new double[]{-25,20,150}, new double[]{860,830,720}, T),
            Viscosity: T => LinearInterpolate(new double[]{-25,20,150}, new double[]{0.02,0.004,0.0007}, T)),
        ["gasoline"] = new Fluid(tMin:-30, tMax:30,
            Density: T => LinearInterpolate(new double[]{-30,0,30}, new double[]{760,740,720}, T),
            Viscosity: T => LinearInterpolate(new double[]{-30,0,30}, new double[]{0.005,0.0014,0.0006}, T))
    };

    private static double LinearInterpolate(double[] xs, double[] ys, double x)
    {
        if (x <= xs[0]) return ys[0];
        if (x >= xs[xs.Length - 1]) return ys[ys.Length - 1];
        for (int i = 0; i < xs.Length - 1; i++)
        {
            var x1 = xs[i];
            var x2 = xs[i + 1];
            if (x >= x1 && x <= x2)
            {
                var t = (x - x1) / (x2 - x1);
                return ys[i] + t * (ys[i + 1] - ys[i]);
            }
        }
        return ys[ys.Length - 1];
    }

    public static PipeResistanceResult CalcPipeResistance(string fluidId, double T_C, double L_m, double D_m, double eps_m, double Q_m3h)
    {
        if (!Fluids.TryGetValue(fluidId, out var fluid))
            throw new ArgumentException("Unknown fluid", nameof(fluidId));

        var rho = fluid.Density(T_C);
        var mu = fluid.Viscosity(T_C);
        var Qs = Q_m3h / 3600.0;
        var area = Math.PI * D_m * D_m / 4.0;
        var v = Qs / area;
        var Re = rho * v * D_m / mu;
        double lambda;
        if (Re < 2300 && Re > 0) lambda = 64.0 / Re;
        else if (Re > 0) lambda = 0.25 / Math.Pow(Math.Log10((eps_m / (3.7 * D_m)) + (5.74 / Math.Pow(Re, 0.9))), 2.0);
        else lambda = double.NaN;
        var relative = eps_m / D_m;
        var deltaP = lambda * (L_m / D_m) * 0.5 * rho * v * v;
        return new PipeResistanceResult(rho, mu, v, Re, lambda, relative, deltaP);
    }

    private readonly record struct Fluid(double tMin, double tMax, Func<double,double> Density, Func<double,double> Viscosity);
}

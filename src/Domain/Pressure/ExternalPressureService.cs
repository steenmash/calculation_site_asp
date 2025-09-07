using System;

namespace Calculation.Domain.Pressure;

public readonly record struct ExternalThicknessResult(double TRequiredMm, double TTotalMm, bool LongCylinder);

public static class ExternalPressureService
{
    public static ExternalThicknessResult CalcThicknessByDo(double Do_mm, double P_MPa, double E_MPa, double nu, double length_mm, double corrosion_mm, double safetyFactor = 1.5)
    {
        var Do = Do_mm;
        var L = length_mm;
        var longCylinder = L / Do > 5.0;
        var targetP = P_MPa * safetyFactor;
        var k = longCylinder ? 2.0 : 1.5;
        var n = longCylinder ? 3.0 : 2.5;
        var tRequired = Do * Math.Pow((targetP * (1 - nu * nu)) / (k * E_MPa), 1.0 / n);
        var tTotal = tRequired + corrosion_mm;
        return new ExternalThicknessResult(tRequired, tTotal, longCylinder);
    }

    public static double CalcCriticalPressure(double Do_mm, double tActual_mm, double corrosion_mm, double length_mm, double E_MPa, double nu)
    {
        var tEff = tActual_mm - corrosion_mm;
        if (tEff <= 0) return double.NaN;
        var ratio = tEff / Do_mm;
        var longCylinder = length_mm / Do_mm > 5.0;
        var k = longCylinder ? 2.0 : 1.5;
        var n = longCylinder ? 3.0 : 2.5;
        return k * E_MPa / (1 - nu * nu) * Math.Pow(ratio, n);
    }
}

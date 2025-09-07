using System;

namespace Calculation.Domain.Pressure;

public readonly record struct InternalThicknessResult(double TRequiredMm, double TTotalMm, double DoRequiredMm);

public static class InternalPressureService
{
    public static InternalThicknessResult CalcThicknessByDi(double Di_mm, double P_MPa, double sigmaAllow_MPa, double weldEfficiency, double corrosion_mm)
    {
        var denominator = 2 * sigmaAllow_MPa * weldEfficiency - P_MPa;
        if (denominator <= 0)
            return new InternalThicknessResult(double.NaN, double.NaN, double.NaN);
        var tRequired = P_MPa * Di_mm / denominator;
        var tTotal = tRequired + corrosion_mm;
        var DoReq = Di_mm + 2 * tRequired;
        return new InternalThicknessResult(tRequired, tTotal, DoReq);
    }

    public static double CalcAllowablePressureByDi(double Di_mm, double tActual_mm, double corrosion_mm, double sigmaAllow_MPa, double weldEfficiency)
    {
        var tEff = tActual_mm - corrosion_mm;
        if (tEff <= 0) return double.NaN;
        return (2 * sigmaAllow_MPa * weldEfficiency * tEff) / (Di_mm + tEff);
    }
}

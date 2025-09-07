using System;

namespace Calculation.Domain.Materials;

public readonly record struct AllowableStressResult(double Sigma, bool Exceeded, double TLimit);

public static class AllowableStressService
{
    public static AllowableStressResult FindAllowableStress(string material, double temperatureC)
    {
        if (!MaterialsDatabase.Materials.TryGetValue(material, out var mat))
            throw new ArgumentException("Unknown material", nameof(material));

        var T = mat.T;
        var S = mat.Sigma;
        var last = T.Length - 1;
        if (temperatureC <= T[0])
            return new AllowableStressResult(S[0], false, T[last]);
        if (temperatureC >= T[last])
            return new AllowableStressResult(S[last], true, T[last]);
        for (int i = 0; i < last; i++)
        {
            var t1 = T[i];
            var t2 = T[i + 1];
            if (temperatureC >= t1 && temperatureC <= t2)
            {
                var s1 = S[i];
                var s2 = S[i + 1];
                var k = (temperatureC - t1) / (t2 - t1);
                var sigma = s1 + k * (s2 - s1);
                return new AllowableStressResult(sigma, false, T[last]);
            }
        }
        return new AllowableStressResult(S[last], true, T[last]);
    }
}

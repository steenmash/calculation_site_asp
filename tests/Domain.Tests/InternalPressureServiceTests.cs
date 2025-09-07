using Calculation.Domain.Pressure;
using Xunit;

public class InternalPressureServiceTests
{
    [Fact]
    public void CalcThicknessInternal_MatchesExpected()
    {
        var res = InternalPressureService.CalcThicknessByDi(1000, 1.6, 140, 1, 1);
        Assert.Equal(5.74712643678161, res.TRequiredMm, 9);
        Assert.Equal(6.74712643678161, res.TTotalMm, 9);
        Assert.Equal(1011.4942528735633, res.DoRequiredMm, 9);
    }

    [Fact]
    public void CalcAllowablePressureByDi_Matches()
    {
        var val = InternalPressureService.CalcAllowablePressureByDi(1000, 10, 1, 140, 1);
        Assert.Equal(2.497522299306244, val, 9);
    }
}

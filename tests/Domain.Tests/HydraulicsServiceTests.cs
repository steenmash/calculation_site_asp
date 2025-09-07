using Calculation.Domain.Hydraulics;
using Xunit;

public class HydraulicsServiceTests
{
    [Fact]
    public void PipeResistance_WaterCase_Matches()
    {
        var res = HydraulicsService.CalcPipeResistance("water", 20, 100, 0.1, 4.5e-5, 50);
        Assert.Equal(998.2336361398824, res.Rho, 9);
        Assert.Equal(0.001001748759408952, res.Mu, 9);
        Assert.Equal(1.7683882565766147, res.Velocity, 9);
        Assert.Equal(176218.30053586254, res.Re, 9);
        Assert.Equal(0.018898789470835665, res.Lambda, 9);
        Assert.Equal(0.00045, res.RelativeRoughness, 9);
        Assert.Equal(29497.922851615265, res.DeltaP, 9);
    }
}

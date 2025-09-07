using Calculation.Domain.Pressure;
using Xunit;

public class ExternalPressureServiceTests
{
    [Fact]
    public void CalcThicknessAndCritical_MatchExpected()
    {
        var thickness = ExternalPressureService.CalcThicknessByDo(1000, 0.2, 2.06e5, 0.3, 8000, 1);
        Assert.Equal(8.718099279315508, thickness.TRequiredMm, 9);
        Assert.Equal(9.718099279315508, thickness.TTotalMm, 9);
        Assert.True(thickness.LongCylinder);

        var pcr = ExternalPressureService.CalcCriticalPressure(1000, 10, 1, 8000, 2.06e5, 0.3);
        Assert.Equal(0.3300527472527472, pcr, 9);
    }
}

using Calculation.Domain.Liquid;
using Xunit;

public class LiquidHeightServiceTests
{
    [Fact]
    public void LiquidHeight_Matches()
    {
        var res = LiquidHeightService.CalcLiquidHeight(20, 3, 50, 0.62);
        Assert.Equal(32.76180473010875, res.Height, 9);
        Assert.Equal(15.719006725125467, res.Velocity, 9);
    }
}

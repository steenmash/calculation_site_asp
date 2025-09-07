using System.Globalization;
using Calculation.Domain.Materials;
using Calculation.Domain.Pressure;
using Calculation.Domain.Hydraulics;
using Calculation.Domain.Liquid;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

var culture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/materials", () =>
{
    var list = new List<object>();
    foreach (var name in MaterialsDatabase.MaterialOrder)
    {
        var m = MaterialsDatabase.Materials[name];
        list.Add(new { name, e_MPa = m.E, nu = m.Nu });
    }
    return Results.Ok(list);
}).WithOpenApi();

app.MapPost("/api/materials/allowable-stress", (AllowableStressRequest req) =>
{
    try
    {
        var res = AllowableStressService.FindAllowableStress(req.Material, req.TemperatureC);
        return Results.Ok(new AllowableStressResponse(res.Sigma, res.Exceeded, res.TLimit));
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message, field = ex.ParamName });
    }
}).WithOpenApi();

app.MapPost("/api/pressure/internal/thickness", (InternalThicknessRequest req) =>
{
    var res = InternalPressureService.CalcThicknessByDi(req.Di_mm, req.P_MPa, req.SigmaAllow_MPa, req.WeldEfficiency, req.Corrosion_mm);
    if (double.IsNaN(res.TRequiredMm))
        return Results.BadRequest(new { message = "Invalid parameters", field = nameof(req.SigmaAllow_MPa) });
    return Results.Ok(new InternalThicknessResponse(res.TRequiredMm, res.TTotalMm, res.DoRequiredMm));
}).WithOpenApi();

app.MapPost("/api/pressure/internal/allowable", (InternalAllowablePressureRequest req) =>
{
    var p = InternalPressureService.CalcAllowablePressure(req.Di_mm, req.TActual_mm, req.Corrosion_mm, req.SigmaAllow_MPa, req.WeldEfficiency);
    if (double.IsNaN(p))
        return Results.BadRequest(new { message = "Invalid parameters", field = nameof(req.TActual_mm) });
    return Results.Ok(new InternalAllowablePressureResponse(p));
}).WithOpenApi();

app.MapPost("/api/pressure/external/thickness", (ExternalThicknessRequest req) =>
{
    var res = ExternalPressureService.CalcThicknessByDo(req.Do_mm, req.P_MPa, req.E_MPa, req.Nu, req.Length_mm, req.Corrosion_mm, req.SafetyFactor ?? 1.5);
    return Results.Ok(new ExternalThicknessResponse(res.TRequiredMm, res.TTotalMm, res.LongCylinder));
}).WithOpenApi();

app.MapPost("/api/pressure/external/critical", (ExternalCriticalPressureRequest req) =>
{
    var p = ExternalPressureService.CalcCriticalPressure(req.Do_mm, req.TActual_mm, req.Corrosion_mm, req.Length_mm, req.E_MPa, req.Nu);
    if (double.IsNaN(p))
        return Results.BadRequest(new { message = "Invalid parameters", field = nameof(req.TActual_mm) });
    return Results.Ok(new ExternalCriticalPressureResponse(p));
}).WithOpenApi();

app.MapPost("/api/hydraulics/pipe-resistance", (PipeResistanceRequest req) =>
{
    try
    {
        var res = HydraulicsService.CalcPipeResistance(req.FluidId, req.T_C, req.L_m, req.D_m, req.Eps_m, req.Q_m3h);
        return Results.Ok(new PipeResistanceResponse(res.Rho, res.Mu, res.Velocity, res.Re, res.Lambda, res.RelativeRoughness, res.DeltaP));
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message, field = ex.ParamName });
    }
}).WithOpenApi();

app.MapPost("/api/liquid/height", (LiquidHeightRequest req) =>
{
    var mu = req.Mu ?? 0.62;
    var res = LiquidHeightService.CalcLiquidHeight(req.Flow_m3_h, req.Diameter_mm, req.Holes, mu);
    if (double.IsNaN(res.Height) || double.IsNaN(res.Velocity))
        return Results.BadRequest(new { message = "Invalid parameters", field = nameof(req.Flow_m3_h) });
    return Results.Ok(new LiquidHeightResponse(res.Height, res.Velocity));
}).WithOpenApi();

app.Run();

// DTOs
record AllowableStressRequest(string Material, double TemperatureC);
record AllowableStressResponse(double SigmaAllow_MPa, bool Exceeded, double TLimitC);

record InternalThicknessRequest(double Di_mm, double P_MPa, double SigmaAllow_MPa, double WeldEfficiency, double Corrosion_mm);
record InternalThicknessResponse(double TRequired_mm, double TTotal_mm, double DoRequired_mm);

record InternalAllowablePressureRequest(double Di_mm, double TActual_mm, double Corrosion_mm, double SigmaAllow_MPa, double WeldEfficiency);
record InternalAllowablePressureResponse(double Pallow_MPa);

record ExternalThicknessRequest(double Do_mm, double P_MPa, double E_MPa, double Nu, double Length_mm, double Corrosion_mm, double? SafetyFactor);
record ExternalThicknessResponse(double TRequired_mm, double TTotal_mm, bool LongCylinder);

record ExternalCriticalPressureRequest(double Do_mm, double TActual_mm, double Corrosion_mm, double Length_mm, double E_MPa, double Nu);
record ExternalCriticalPressureResponse(double Pcr_MPa);

record PipeResistanceRequest(string FluidId, double T_C, double L_m, double D_m, double Eps_m, double Q_m3h);
record PipeResistanceResponse(double Rho_kg_m3, double Mu_Pa_s, double Velocity_m_s, double Re, double Lambda, double RelativeRoughness, double DeltaP_Pa);

record LiquidHeightRequest(double Flow_m3_h, double Diameter_mm, double Holes, double? Mu);
record LiquidHeightResponse(double Height_m, double Velocity_m_s);

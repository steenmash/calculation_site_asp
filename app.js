// Data: allowable stress table [MPa] by material and temperature bands
const allowableStressTable = {
	"Сталь3 (до 20 мм)": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,425], sigma: [154,149,145,142,131,115,105,93,85,81,75,71] }
	},
	"Сталь3 (более 20 мм)": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,425], sigma: [140,134,131,126,120,108,98,93,85,81,75,71] }
	},
	"09Г2С (до 32 мм)": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,475], sigma: [196,177,171,165,162,151,140,133,122,104,92,86,78,71,64,56,53] }
	},
	"09Г2С (более 32 мм)": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,475], sigma: [183,160,154,148,145,134,123,116,105,104,92,86,78,71,64,56,53] }
	},
	"Сталь20": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,475], sigma: [147,142,139,136,132,119,106,98,92,86,80,75,67,61,55,49,46] }
	},
	"Сталь10": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,475], sigma: [130,125,122,118,112,100,88,82,77,75,72,68,60,53,47,42,37] }
	},
	"10Г2": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,475], sigma: [180,160,154,148,145,134,123,108,92,86,80,75,67,61,55,49,46] }
	},
	"17ГС": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,475], sigma: [183,160,154,148,145,134,123,116,105,104,92,86,78,71,64,56,53] }
	},
	"12ХМ": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560], sigma: [147,146.6,146,145,145,141,137,135,132,130,129,127,126,126,126,117,114,105,96,82,69,60,50,41,33] }
	},
	"12МХ": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540], sigma: [147,146.6,146,145,145,141,137,135,132,130,129,127,126,126,126,117,114,105,96,82,69,57,47] }
	},
	"15ХМ": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560], sigma: [155,153,152.5,152,152,147,142,140,137,136,135,134,132,132,132,122,117,107,99,84,74,67,57,49,41] }
	},
	"AISI904L": {
		points: { T: [20,100,150,200,250,300,350,375,400], sigma: [180,173,171,171,167,149,143,141,140] }
	},
	"AISI304L": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450], sigma: [160,133,125,120,115,112,108,107,107,107,107,107,107,107] }
	},
	"AISI316L": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450], sigma: [153,140,130,120,113,103,101,90,87,83,82,81,81,80] }
	},
	"08Х12Н10Т": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600], sigma: [168,156,148,140,132,123,113,108,103,102,101,101.5,100,99,98,97.5,97,96,95,94,79,79,78,76,73,69,65,61,57] }
	},
	"12Х18Н10Т": {
		points: { T: [20,100,150,200,250,300,350,375,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,650,660,670,680,690,700], sigma: [184,174,168,160,154,148,144,140,137,136,135,134,133,132,131,130,129,128,127,126,125,124,111,111,101,97,90,81,74,68,62,57,52,48,45,42,38,34,30] }
	},
};

// Material properties for external pressure calculations
const materialProperties = {
	"Сталь3 (до 20 мм)": { E: 2.06e5, nu: 0.3 },
	"Сталь3 (более 20 мм)": { E: 2.06e5, nu: 0.3 },
	"09Г2С (до 32 мм)": { E: 2.06e5, nu: 0.3 },
	"09Г2С (более 32 мм)": { E: 2.06e5, nu: 0.3 },
	"Сталь20": { E: 2.06e5, nu: 0.3 },
	"Сталь10": { E: 2.06e5, nu: 0.3 },
	"10Г2": { E: 2.06e5, nu: 0.3 },
	"17ГС": { E: 2.06e5, nu: 0.3 },
	"12ХМ": { E: 2.06e5, nu: 0.3 },
	"12МХ": { E: 2.06e5, nu: 0.3 },
	"15ХМ": { E: 2.06e5, nu: 0.3 },
	"AISI904L": { E: 2.00e5, nu: 0.3 },
	"AISI304L": { E: 2.00e5, nu: 0.3 },
	"AISI316L": { E: 2.00e5, nu: 0.3 },
	"08Х12Н10Т": { E: 2.00e5, nu: 0.3 },
	"12Х18Н10Т": { E: 2.00e5, nu: 0.3 },
};

function populateMaterials() {
	const selects = document.querySelectorAll('select[name="material"]');
	const order = [
		"Сталь3 (до 20 мм)", 
		"Сталь3 (более 20 мм)", 
		"09Г2С (до 32 мм)", 
		"09Г2С (более 32 мм)",
		"Сталь20",
		"Сталь10",
		"10Г2",
		"17ГС",
		"12ХМ",
		"12МХ",
		"15ХМ",
		"AISI904L",
		"AISI304L",
		"AISI316L",
		"08Х12Н10Т",
		"12Х18Н10Т"
	];
	selects.forEach(select => {
		select.innerHTML = order
			.filter((m) => allowableStressTable[m])
			.map((m) => `<option value="${m}">${m}</option>`)
			.join("");
	});
}

function parseNumber(value) {
	if (typeof value !== 'string') return Number.NaN;
	const normalized = value.replace(',', '.').replace(/\s+/g, '');
	return Number(normalized);
}

function interpolateSigma(points, T) {
	const { T: temps, sigma: sigmas } = points;
	if (!temps || temps.length === 0) return { sigma: NaN, exceeded: false, tLimit: NaN, used: null };
	if (T <= temps[0]) return { sigma: sigmas[0], exceeded: false, tLimit: temps[temps.length - 1], used: { kind: 'edge', aT: temps[0], aS: sigmas[0] } };
	if (T >= temps[temps.length - 1]) return { sigma: sigmas[sigmas.length - 1], exceeded: true, tLimit: temps[temps.length - 1], used: { kind: 'edge', aT: temps[temps.length - 1], aS: sigmas[sigmas.length - 1] } };
	for (let i = 0; i < temps.length - 1; i++) {
		const T1 = temps[i], T2 = temps[i+1];
		if (T >= T1 && T <= T2) {
			const S1 = sigmas[i], S2 = sigmas[i+1];
			const k = (T - T1) / (T2 - T1);
			const S = S1 + k * (S2 - S1);
			return { sigma: S, exceeded: false, tLimit: temps[temps.length - 1], used: { kind: 'interp', T1, T2, S1, S2 } };
		}
	}
	return { sigma: sigmas[sigmas.length - 1], exceeded: true, tLimit: temps[temps.length - 1], used: null };
}

function findAllowableStress(material, temperatureC) {
	const table = allowableStressTable[material];
	if (!table) return { sigma: NaN, exceeded: false, tLimit: NaN, meta: {} };
	const res = interpolateSigma(table.points, temperatureC);
	return { sigma: res.sigma, exceeded: res.exceeded, tLimit: res.tLimit, meta: { used: res.used } };
}

// Internal pressure calculations
function calcThicknessInternalByDi({ Di_mm, P_MPa, sigmaAllow_MPa, weldEfficiency, corrosion_mm }) {
	const denominator = 2 * sigmaAllow_MPa * weldEfficiency - P_MPa;
	if (denominator <= 0) return { tRequired_mm: NaN, tTotal_mm: NaN };
	const tRequired_mm = (P_MPa * Di_mm) / denominator;
	const tTotal_mm = tRequired_mm + corrosion_mm;
	return { tRequired_mm, tTotal_mm };
}

function calcAllowablePressureByDi({ Di_mm, tActual_mm, corrosion_mm, sigmaAllow_MPa, weldEfficiency }) {
	const tEff = tActual_mm - corrosion_mm;
	if (tEff <= 0) return NaN;
	return (2 * sigmaAllow_MPa * weldEfficiency * tEff) / (Di_mm + tEff);
}

// External pressure calculations
function calcThicknessExternalByDo({ Do_mm, P_MPa, E_MPa, nu, length_mm, corrosion_mm, safetyFactor = 1.5 }) {
	const Do = Do_mm;
	const L = length_mm;
	const longCylinder = L / Do > 5;
	const targetPcr = P_MPa * safetyFactor;
	const k = longCylinder ? 2 : 1.5;
	const n = longCylinder ? 3 : 2.5;
	const tRequired_mm = Do * Math.pow((targetPcr * (1 - nu * nu)) / (k * E_MPa), 1 / n);
	const tTotal_mm = tRequired_mm + corrosion_mm;
	return { tRequired_mm, tTotal_mm, longCylinder };
}

function calcCriticalPressure(Do, t, L, E, nu) {
	const ratio = t / Do;
	const longCylinder = L / Do > 5;
	if (longCylinder) {
		return 2 * E * Math.pow(ratio, 3) / (1 - nu * nu);
	} else {
		return 1.5 * E * Math.pow(ratio, 2.5) / (1 - nu * nu);
	}
}

// Liquid height (by flow through holes)
function calcLiquidHeight({ flow_m3_h, diameter_mm, holes, mu = 0.62 }) {
        const g = 9.81;
        if (!isFinite(flow_m3_h) || !isFinite(diameter_mm) || !isFinite(holes) ||
                flow_m3_h <= 0 || diameter_mm <= 0 || holes <= 0) {
                return { height: NaN, velocity: NaN };
        }
        const Q = flow_m3_h / 3600; // m^3/s
        const d = diameter_mm / 1000; // m
        const area = Math.PI * d * d / 4;
        const velocity = Q / (area * holes);
        const height = Math.pow(velocity / mu, 2) / (2 * g);
        return { height, velocity };
}

function formatNumber(value, digits = 3) {
	if (!isFinite(value)) return '—';
	return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function linearInterpolate(xs, ys, x) {
	if (x <= xs[0]) return ys[0];
	if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
	for (let i = 0; i < xs.length - 1; i++) {
		if (x >= xs[i] && x <= xs[i + 1]) {
			const t = (x - xs[i]) / (xs[i + 1] - xs[i]);
			return ys[i] + t * (ys[i + 1] - ys[i]);
		}
	}
	return ys[ys.length - 1];
}

const pipeFluids = {
	water: {
		tMin: 0.1,
		tMax: 99,
		density: (T) => 1000 * (1 - ((T + 288.9414) * Math.pow(T - 3.9863, 2)) / (508929.2 * (T + 68.12963))),
		viscosity: (T) => 2.414e-5 * Math.pow(10, 247.8 / (T + 133.15)) // Pa*s
	},
	diesel: {
		tMin: -25, tMax: 150,
		density: (T) => linearInterpolate([-25, 20, 150], [860, 830, 720], T),
		viscosity: (T) => linearInterpolate([-25, 20, 150], [0.02, 0.004, 0.0007], T)
	},
	gasoline: {
		tMin: -30, tMax: 30,
		density: (T) => linearInterpolate([-30, 0, 30], [760, 740, 720], T),
		viscosity: (T) => linearInterpolate([-30, 0, 30], [0.005, 0.0014, 0.0006], T)
	}
};

const pipeFluidNames = {
	water: 'Вода',
	diesel: 'Дизельное топливо',
	gasoline: 'Бензин'
};

// ===== Reports (internal pressure) =====
function buildReportHTML(params) {
	const { material, T, DiActual, tActual, P, c, phi, sigma, bandInfo, tReq, tTotal, DoReq, DoAct, Pallow, safety } = params;
	const interpInfo = bandInfo.used && bandInfo.used.kind === 'interp'
		? `между T=${bandInfo.used.T1}°C (σ=${bandInfo.used.S1} МПа) и T=${bandInfo.used.T2}°C (σ=${bandInfo.used.S2} МПа)` : '';
	return `
	<div style="font-family: Inter, Arial, sans-serif; color:#000; font-size: 14px; line-height: 1.6;">
		<h2 style="margin:0 0 20px 0; font-size: 20px; text-align: center;">Отчет по расчету: внутреннее давление</h2>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Исходные данные</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
			<tbody>
				<tr><td style="padding: 6px 8px;">Материал</td><td style="text-align:right; padding: 6px 8px;"><strong>${material}</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Температура, T</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(T, 1)} °C</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Внутренний диаметр</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(DiActual, 3)} мм</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Фактическая толщина, tф</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(tActual, 3)} мм</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Расчетное давление, P</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(P, 3)} МПа</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Коррозионная прибавка, c</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(c, 3)} мм</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Коэфф. шва, φ</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(phi, 3)}</strong></td></tr>
			</tbody>
		</table>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Допускаемые напряжения</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
			<tbody>
				<tr><td style="padding: 6px 8px;">Принято [σ](T)</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(sigma, 2)} МПа</strong></td></tr>
				${interpInfo ? `<tr><td style="padding: 6px 8px;">Интерполяция</td><td style="text-align:right; padding: 6px 8px;">${interpInfo}</td></tr>` : ''}
			</tbody>
		</table>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Формулы и подстановка</h3>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ t = \\frac{P\\,D_i}{2\\,[\\sigma] \\, \\varphi - P} = \\frac{${P}\\cdot ${DiActual}}{2\\cdot ${sigma} \\cdot ${phi} - ${P}} = ${formatNumber(tReq,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ t_{итог} = t + c = ${formatNumber(tReq,3)} + ${formatNumber(c,3)} = ${formatNumber(tTotal,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ D_o = D_i + 2t = ${formatNumber(DiActual,3)} + 2\\cdot ${formatNumber(tReq,3)} = ${formatNumber(DoReq,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ D_{oф} = D_i + 2t_{ф} = ${formatNumber(DiActual,3)} + 2\\cdot ${formatNumber(tActual,3)} = ${formatNumber(DoAct,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ t_{эф} = t_{ф} - c = ${formatNumber(tActual,3)} - ${formatNumber(c,3)} = ${formatNumber(tActual - c, 3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ P_{доп} = \\frac{2\\,[\\sigma] \\, \\varphi \\, t_{эф}}{D_i + t_{эф}} = ${formatNumber(Pallow,3)}\\,\\text{МПа} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ \\text{Запас} = 100\\% - \\frac{t}{t_{ф}}\\cdot 100\\% = ${formatNumber(safety,2)}\\% $$</div>
		</div>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Результаты</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px;">
			<tbody>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Толщина без коррозии</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd; font-weight: bold;"><strong>${formatNumber(tReq,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Толщина с коррозией</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd; font-weight: bold;"><strong>${formatNumber(tTotal,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Do по расчетной толщине</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd; font-weight: bold;"><strong>${formatNumber(DoReq,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Do по фактической толщине</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd; font-weight: bold;"><strong>${formatNumber(DoAct,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Допустимое давление</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd; font-weight: bold;"><strong>${formatNumber(Pallow,3)} МПа</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Запас по толщине</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd; font-weight: bold;"><strong>${isFinite(safety)? formatNumber(safety,2)+' %' : '—'}</strong></td></tr>
			</tbody>
		</table>
	</div>`;
}

function buildExportHTML(params) { return buildReportHTML(params); }

// ===== Reports (external pressure) =====
function buildExternalReportHTML(params) {
	const { material, T, DoActual, tActual, P, c, length, E, nu, Pcr, tReq, tTotal, DiReq, DiAct, safety, longCylinder } = params;
	const k = longCylinder ? 2 : 1.5;
	const n = longCylinder ? 3 : 2.5;
	return `
	<div style="font-family: Inter, Arial, sans-serif; color:#000; font-size: 14px; line-height: 1.6;">
		<h2 style="margin:0 0 20px 0; font-size: 20px; text-align: center;">Отчет по расчету: внешнее давление</h2>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Исходные данные</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
			<tbody>
				<tr><td style="padding: 6px 8px;">Материал</td><td style="text-align:right; padding: 6px 8px;"><strong>${material}</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Температура, T</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(T, 1)} °C</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Наружный диаметр</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(DoActual, 3)} мм</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Фактическая толщина, tф</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(tActual, 3)} мм</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Внешнее давление, P</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(P, 3)} МПа</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Коррозионная прибавка, c</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(c, 3)} мм</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Расчетная длина, L</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(length, 1)} мм</strong></td></tr>
			</tbody>
		</table>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Свойства материала</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
			<tbody>
				<tr><td style="padding: 6px 8px;">E</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(E, 0)} МПа</strong></td></tr>
				<tr><td style="padding: 6px 8px;">ν</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(nu, 2)}</strong></td></tr>
			</tbody>
		</table>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Формулы и подстановка</h3>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ t = D_o\\left(\\frac{1.5\\,P\\,(1-\\nu^2)}{${k}\\,E}\\right)^{\\frac{1}{${n}}} = ${formatNumber(DoActual,3)}\\left(\\frac{1.5\\cdot ${formatNumber(P,3)}\\cdot (1-${formatNumber(nu,2)}^2)}{${k}\\cdot ${formatNumber(E,0)}}\\right)^{\\frac{1}{${n}}} = ${formatNumber(tReq,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ P_{кр} = \\frac{${k}\\,E\\,(t/D_o)^{${n}}}{1-\\nu^2} = ${formatNumber(Pcr,3)}\\,\\text{МПа} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ t_{итог} = t + c = ${formatNumber(tReq,3)} + ${formatNumber(c,3)} = ${formatNumber(tTotal,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ D_i = D_o - 2t = ${formatNumber(DoActual,3)} - 2\\cdot ${formatNumber(tReq,3)} = ${formatNumber(DiReq,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ D_{iф} = D_o - 2t_{ф} = ${formatNumber(DoActual,3)} - 2\\cdot ${formatNumber(tActual,3)} = ${formatNumber(DiAct,3)}\\,\\text{мм} $$</div>
		</div>
		<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
			<div style="margin: 8px 0; text-align: center;">$$ \\text{Запас} = 100\\% - \\frac{t}{t_{ф}}\\cdot 100\\% = ${formatNumber(safety,2)}\\% $$</div>
		</div>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Результаты</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px;">
			<tbody>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Pкр</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd;"><strong>${formatNumber(Pcr,3)} МПа</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Толщина (расч.)</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd;"><strong>${formatNumber(tReq,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Толщина (с корроз.)</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd;"><strong>${formatNumber(tTotal,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Di (расч.)</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd;"><strong>${formatNumber(DiReq,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Di (факт.)</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd;"><strong>${formatNumber(DiAct,3)} мм</strong></td></tr>
				<tr><td style="padding: 8px; border: 1px solid #ddd;">Запас по толщине</td><td style="text-align:right; padding: 8px; border: 1px solid #ddd;"><strong>${isFinite(safety)? formatNumber(safety,2)+' %' : '—'}</strong></td></tr>
			</tbody>
		</table>
	</div>`;
}
function buildExternalExportHTML(params){ return buildExternalReportHTML(params); }

// ===== Materials comparison table =====
function updateMaterialsComparisonTable(DiActual, T, P, c, phi) {
const tbody = document.getElementById('materials-tbody');
if (!tbody) return;
if (![DiActual, T, P, c, phi].every(isFinite)) return;

const materialsOrder = [
"Сталь3 (до 20 мм)",
"Сталь3 (более 20 мм)",
"09Г2С (до 32 мм)",
"09Г2С (более 32 мм)",
"Сталь20",
"Сталь10",
"10Г2",
"17ГС",
"12ХМ",
"12МХ",
"15ХМ",
"AISI904L",
"AISI304L",
"AISI316L",
"08Х12Н10Т",
"12Х18Н10Т"
];

let html = '';

materialsOrder.forEach(materialName => {
const thicknessForStress = 20;
const stress = findAllowableStress(materialName, T, thicknessForStress);
const sigma = stress.sigma;
const isApplicable = !stress.exceeded && isFinite(sigma) && sigma > 0;

let thickness = '—';
let status = '';

if (isApplicable) {
const { tRequired_mm } = calcThicknessInternalByDi({
Di_mm: DiActual,
P_MPa: P,
sigmaAllow_MPa: sigma,
weldEfficiency: phi,
corrosion_mm: c,
});
if (isFinite(tRequired_mm) && tRequired_mm > 0) {
thickness = formatNumber(tRequired_mm, 3);
status = '<span class="status-valid">✓</span>';
} else {
status = '<span class="status-invalid">—</span>';
}
} else {
status = '<span class="status-cross">❌</span>';
}

html += `
<tr>
<td class="material-name">${materialName}</td>
<td class="material-stress">${isApplicable ? formatNumber(sigma, 0) : '—'}</td>
<td class="material-thickness">${thickness}</td>
<td class="material-status">${status}</td>
</tr>
`;
});

tbody.innerHTML = html;
}

// ===== Internal pressure form wiring =====
function wireInternalCalc() {
const form = document.getElementById('form-internal');
if (!form) return;
const btn = document.getElementById('btn-calc-internal');
const resSigma = document.getElementById('res-sigma');
const resTReq = document.getElementById('res-t-req');
const resTTotal = document.getElementById('res-t-total');
const resPAllow = document.getElementById('res-p-allow');
const resDoReq = document.getElementById('res-Do-req');
const resDoAct = document.getElementById('res-Do-act');
const resSafety = document.getElementById('res-safety');
const warnBox = document.getElementById('temp-warning');
const report = document.getElementById('report-content');
const printSource = document.getElementById('print-source');

const doCalc = () => {
const DiActual = parseNumber(form.Di_actual.value);
const T = parseNumber(form.temperature.value);
const tActual = parseNumber(form.t_actual.value);
const P = parseNumber(form.pressure.value);
const c = parseNumber(form.corrosion.value || '0');
const phi = parseNumber(form.weld_eff.value || '1');
const material = form.material.value;

const stress = findAllowableStress(material, T, tActual);
const sigma = stress.sigma;
const { tRequired_mm, tTotal_mm } = calcThicknessInternalByDi({
Di_mm: DiActual,
P_MPa: P,
sigmaAllow_MPa: sigma,
weldEfficiency: phi,
corrosion_mm: c,
});
const Pallow = calcAllowablePressureByDi({
Di_mm: DiActual,
tActual_mm: tActual,
corrosion_mm: c,
sigmaAllow_MPa: sigma,
weldEfficiency: phi,
});

const DoReq = isFinite(tRequired_mm) ? DiActual + 2 * tRequired_mm : NaN;
const DoAct = isFinite(tActual) && isFinite(DiActual) ? DiActual + 2 * tActual : NaN;
const safety = isFinite(tRequired_mm) && isFinite(tActual) && tActual !== 0 ? (100 - (tRequired_mm / tActual) * 100) : NaN;

if (stress.exceeded) {
warnBox.style.display = '';
warnBox.textContent = `Предупреждение: заданная температура (${T} °C) превышает диапазон таблицы для материала. В расчете использовано значение при ${stress.tLimit}+ °C.`;
} else {
warnBox.style.display = 'none';
warnBox.textContent = '';
}

resSigma.textContent = formatNumber(sigma, 0);
resTReq.textContent = formatNumber(tRequired_mm, 3);
resTTotal.textContent = formatNumber(tTotal_mm, 3);
resDoReq.textContent = formatNumber(DoReq, 3);
resDoAct.textContent = formatNumber(DoAct, 3);
resPAllow.textContent = formatNumber(Pallow, 3);
resSafety.textContent = isFinite(safety) ? `${formatNumber(safety, 2)} %` : '—';

updateMaterialsComparisonTable(DiActual, T, P, c, phi);

const reportHTML = buildReportHTML({
material, T, DiActual, tActual, P, c, phi,
sigma, bandInfo: stress.meta, tReq: tRequired_mm, tTotal: tTotal_mm,
DoReq, DoAct, Pallow, safety
});
const exportHTML = buildExportHTML({
material, T, DiActual, tActual, P, c, phi,
sigma, bandInfo: stress.meta, tReq: tRequired_mm, tTotal: tTotal_mm,
DoReq, DoAct, Pallow, safety
});

report.innerHTML = reportHTML;
printSource.innerHTML = exportHTML;
if (window.MathJax && MathJax.typesetPromise) {
MathJax.typesetPromise([report]).catch(() => {});
}
};

btn.addEventListener('click', doCalc);
 form.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); doCalc(); }
 });
form.addEventListener('reset', () => {
setTimeout(() => {
resSigma.textContent = '—';
resTReq.textContent = '—';
resTTotal.textContent = '—';
resPAllow.textContent = '—';
resDoReq.textContent = '—';
resDoAct.textContent = '—';
resSafety.textContent = '—';
warnBox.style.display = 'none';
warnBox.textContent = '';
report.innerHTML = '';
printSource.innerHTML = '';
const tbody = document.getElementById('materials-tbody');
if (tbody) tbody.innerHTML = '';
}, 0);
});
}

// ===== External pressure form wiring =====
function wireExternalCalc() {
const form = document.getElementById('form-external');
if (!form) return;
const btn = document.getElementById('btn-calc-external');
const resSigma = document.getElementById('res-sigma-ext');
const resE = document.getElementById('res-E');
const resPcr = document.getElementById('res-Pcr');
const resTReq = document.getElementById('res-t-req-ext');
const resTTotal = document.getElementById('res-t-total-ext');
const resDiReq = document.getElementById('res-Di-req');
const resDiAct = document.getElementById('res-Di-act');
const resSafety = document.getElementById('res-safety-ext');
const warnBox = document.getElementById('temp-warning-ext');
const report = document.getElementById('report-content-ext');
const printSource = document.getElementById('print-source-ext');

const doCalc = () => {
const DoActual = parseNumber(form.Do_actual.value);
const T = parseNumber(form.temperature.value);
const tActual = parseNumber(form.t_actual.value);
const P = parseNumber(form.pressure.value);
const c = parseNumber(form.corrosion.value || '0');
const length = parseNumber(form.length.value);
const material = form.material.value;

const stress = findAllowableStress(material, T, tActual);
const sigma = stress.sigma;
const materialProps = materialProperties[material] || { E: 2.06e5, nu: 0.3 };

const { tRequired_mm, tTotal_mm, longCylinder } = calcThicknessExternalByDo({
Do_mm: DoActual,
P_MPa: P,
E_MPa: materialProps.E,
nu: materialProps.nu,
length_mm: length,
corrosion_mm: c,
});

const Pcr = calcCriticalPressure(DoActual, tActual - c, length, materialProps.E, materialProps.nu);
const DiReq = isFinite(tRequired_mm) ? DoActual - 2 * tRequired_mm : NaN;
const DiAct = isFinite(tActual) && isFinite(DoActual) ? DoActual - 2 * tActual : NaN;
const safety = isFinite(tRequired_mm) && isFinite(tActual) && tActual !== 0 ? (100 - (tRequired_mm / tActual) * 100) : NaN;

if (stress.exceeded) {
warnBox.style.display = '';
warnBox.textContent = `Предупреждение: заданная температура (${T} °C) превышает диапазон таблицы для материала. В расчете использовано значение при ${stress.tLimit}+ °C.`;
} else {
warnBox.style.display = 'none';
warnBox.textContent = '';
}

resSigma.textContent = formatNumber(sigma, 0);
resE.textContent = formatNumber(materialProps.E, 0);
resPcr.textContent = formatNumber(Pcr, 3);
resTReq.textContent = formatNumber(tRequired_mm, 3);
resTTotal.textContent = formatNumber(tTotal_mm, 3);
resDiReq.textContent = formatNumber(DiReq, 3);
resDiAct.textContent = formatNumber(DiAct, 3);
resSafety.textContent = isFinite(safety) ? `${formatNumber(safety, 2)} %` : '—';

const reportHTML = buildExternalReportHTML({
material, T, DoActual, tActual, P, c, length,
E: materialProps.E, nu: materialProps.nu, Pcr,
tReq: tRequired_mm, tTotal: tTotal_mm, DiReq, DiAct, safety,
longCylinder
});
const exportHTML = buildExternalExportHTML({
material, T, DoActual, tActual, P, c, length,
E: materialProps.E, nu: materialProps.nu, Pcr,
tReq: tRequired_mm, tTotal: tTotal_mm, DiReq, DiAct, safety,
longCylinder
});

report.innerHTML = reportHTML;
printSource.innerHTML = exportHTML;
if (window.MathJax && MathJax.typesetPromise) {
MathJax.typesetPromise([report]).catch(() => {});
}
};

btn.addEventListener('click', doCalc);
 form.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); doCalc(); }
 });
form.addEventListener('reset', () => {
setTimeout(() => {
resSigma.textContent = '—';
resE.textContent = '—';
resPcr.textContent = '—';
resTReq.textContent = '—';
resTTotal.textContent = '—';
resDiReq.textContent = '—';
resDiAct.textContent = '—';
resSafety.textContent = '—';
warnBox.style.display = 'none';
warnBox.textContent = '';
report.innerHTML = '';
printSource.innerHTML = '';
}, 0);
});
}

// ===== Pipe resistance (by flow) =====
function buildPipeResistanceReportHTML({ fluidName, T, L, D, roughnessName, roughnessValue, flow, velocity, rho, mu, Re, lambda, relativeRoughness, deltaP }) {
	return `
	<div style="font-family: Inter, Arial, sans-serif; color:#000; font-size: 14px; line-height: 1.6;">
		<h2 style="margin:0 0 20px 0; font-size: 20px; text-align: center;">Отчет по расчету: гидравлическое сопротивление</h2>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Исходные данные</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
			<tbody>
				<tr><td style="padding: 6px 8px;">Жидкость</td><td style="text-align:right; padding: 6px 8px;"><strong>${fluidName}</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Температура, T</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(T,1)} °C</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Длина, L</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(L,3)} м</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Диаметр, D</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(D,3)} м</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Шероховатость</td><td style="text-align:right; padding: 6px 8px;"><strong>${roughnessName} (${formatNumber(roughnessValue,6)} м)</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Объемный расход, Q</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(flow,3)} м³/ч</strong></td></tr>
			</tbody>
		</table>
		<h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Результаты</h3>
		<table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
			<tbody>
                                <tr><td style="padding: 6px 8px;">Плотность, \(\rho\)</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(rho,1)} кг/м³</strong></td></tr>
                                <tr><td style="padding: 6px 8px;">Вязкость, \(\mu\)</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(mu,6)} Па·с</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Скорость, v</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(velocity,3)} м/с</strong></td></tr>
				<tr><td style="padding: 6px 8px;">Число Рейнольдса, Re</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(Re,0)}</strong></td></tr>
                                <tr><td style="padding: 6px 8px;">Коэф. трения, \(\lambda\)</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(lambda,5)}</strong></td></tr>
                                <tr><td style="padding: 6px 8px;">Относительная шероховатость, \(\varepsilon/D\)</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(relativeRoughness,6)}</strong></td></tr>
                                <tr><td style="padding: 6px 8px;">Потери давления, \(\Delta P\)</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(deltaP,2)} Па</strong></td></tr>
			</tbody>
		</table>
                <h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Формулы и подстановка</h3>
                <div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        <div style="margin: 8px 0; text-align: center;">$$ Re = \frac{\rho v D}{\mu} $$</div>
                </div>
                <div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        <div style="margin: 8px 0; text-align: center;">$$ \Delta P = \lambda \frac{L}{D} \frac{\rho v^2}{2} $$</div>
                </div>
        </div>`;
}
function buildPipeResistanceExportHTML(params){ return buildPipeResistanceReportHTML(params); }

function wirePipeResistanceCalc() {
	const form = document.getElementById('form-pipe-resistance');
	if (!form) return;
	const btn = document.getElementById('btn-calc-pipe');
	const resDensity = document.getElementById('res-density');
	const resViscosity = document.getElementById('res-viscosity');
	const resVelocity = document.getElementById('res-velocity-pipe');
       const resRe = document.getElementById('res-Re');
       const resLambda = document.getElementById('res-lambda');
       const resRelative = document.getElementById('res-relative-roughness');
       const resDeltaP = document.getElementById('res-deltaP');
	const report = document.getElementById('report-content-pipe-resistance');
	const printSource = document.getElementById('print-source-pipe-resistance');
	const tempInput = form.temperature;
	const tempDisplay = document.getElementById('temp-display');
	const fluidSelect = form.fluid;

	const roughnessValues = { smooth: 1.5e-6, slight: 4.5e-5, corroded: 5e-4 };
	const roughnessNames = { smooth: 'Гладкая', slight: 'Слегка шероховатая', corroded: 'Скорродированная' };

	function updateTempSlider() {
		const cfg = pipeFluids[fluidSelect.value];
		tempInput.min = cfg.tMin;
		tempInput.max = cfg.tMax;
		if (tempInput.value === '' || tempInput.value < cfg.tMin || tempInput.value > cfg.tMax) {
			tempInput.value = cfg.tMin;
		}
		tempDisplay.textContent = parseNumber(tempInput.value).toFixed(1);
	}
	fluidSelect.addEventListener('change', updateTempSlider);
	tempInput.addEventListener('input', () => tempDisplay.textContent = parseNumber(tempInput.value).toFixed(1));
	updateTempSlider();

	const doCalc = () => {
		const fluid = fluidSelect.value;
		const T = parseNumber(tempInput.value);
               const L = parseNumber(form.length.value);
               const D = parseNumber(form.diameter.value) / 1000;
		const roughType = form.roughness.value;
               const eps = roughnessValues[roughType];
               const Q = parseNumber(form.flow.value); // m3/h
               const Qs = Q / 3600; // m3/s
               const area = Math.PI * D * D / 4;
               const v = Qs / area; // m/s

		const rho = pipeFluids[fluid].density(T);
		const mu = pipeFluids[fluid].viscosity(T);
               const Re = rho * v * D / mu;
               let lambda = NaN;
               if (Re > 0) {
                       if (Re < 2300) lambda = 64 / Re;
                       else lambda = 0.25 / Math.pow(Math.log10((eps / (3.7 * D)) + (5.74 / Math.pow(Re, 0.9))), 2);
               }
               const epsRel = eps / D;
               const deltaP = lambda * (L / D) * 0.5 * rho * v * v;

		resDensity.textContent = formatNumber(rho, 1);
		resViscosity.textContent = formatNumber(mu, 6);
		resVelocity.textContent = formatNumber(v, 3);
		resRe.textContent = formatNumber(Re, 0);
               resLambda.textContent = formatNumber(lambda, 5);
               resRelative.textContent = formatNumber(epsRel, 6);
               resDeltaP.textContent = formatNumber(deltaP, 2);

               const reportHTML = buildPipeResistanceReportHTML({
                       fluidName: pipeFluidNames[fluid], T, L, D,
                       roughnessName: roughnessNames[roughType], roughnessValue: eps,
                       flow: Q, velocity: v, rho, mu, Re, lambda, relativeRoughness: epsRel, deltaP
               });
               const exportHTML = buildPipeResistanceExportHTML({
                       fluidName: pipeFluidNames[fluid], T, L, D,
                       roughnessName: roughnessNames[roughType], roughnessValue: eps,
                       flow: Q, velocity: v, rho, mu, Re, lambda, relativeRoughness: epsRel, deltaP
               });
               report.innerHTML = reportHTML;
               printSource.innerHTML = exportHTML;
               if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([report, printSource]).catch(() => {});
        };

       btn.addEventListener('click', doCalc);
       form.addEventListener('keydown', e => {
               if (e.key === 'Enter') { e.preventDefault(); doCalc(); }
       });
       form.addEventListener('reset', () => {
		setTimeout(() => {
			resDensity.textContent = '—';
			resViscosity.textContent = '—';
			resVelocity.textContent = '—';
			resRe.textContent = '—';
                       resLambda.textContent = '—';
                       resRelative.textContent = '—';
                       resDeltaP.textContent = '—';
			report.innerHTML = '';
			printSource.innerHTML = '';
			updateTempSlider();
		}, 0);
	});
}

function wirePipeResistancePDFExport() {
	const exportBtn = document.getElementById('btn-export-pdf-pipe-resistance');
	const report = document.getElementById('print-source-pipe-resistance');
	if (!exportBtn) return;
	exportBtn.addEventListener('click', () => {
		if (!report || !report.innerHTML.trim()) return alert('Сначала выполните расчет для создания отчета');
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = report.innerHTML;
		Object.assign(tempDiv.style, {
			position:'absolute', left:'0px', top:'0px', width:'800px',
			backgroundColor:'#ffffff', padding:'20px', fontFamily:'Arial, sans-serif',
			fontSize:'12px', lineHeight:'1.5', color:'#000000', zIndex:'9999', visibility:'visible', opacity:'1'
		});
		document.body.appendChild(tempDiv);
		const runExport = () => {
			const opt = {
				margin:10, filename:'calc-report-pipe-resistance.pdf',
				image:{ type:'jpeg', quality:0.95 },
				html2canvas:{ scale:1.5, useCORS:true, letterRendering:true, allowTaint:true, backgroundColor:'#ffffff', width:800, height: tempDiv.scrollHeight },
				jsPDF:{ unit:'mm', format:'a4', orientation:'portrait' }
			};
			html2pdf().set(opt).from(tempDiv).save().then(()=>document.body.removeChild(tempDiv))
			.catch((e)=>{ if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv); alert('Ошибка при экспорте PDF: ' + e.message); });
		};
		setTimeout(runExport,200);
	});
}

// ===== Pipe mass =====
function populatePipeMassMaterials(select) {
        const materials = {
                'Углеродистая сталь': 7850,
                'Нержавеющая сталь': 7900,
                'Латунь Л63': 8440,
                'Латунь ЛАМш-77-2-0,05': 8700,
                'Бронза БрАЖ': 7500
        };
        if (select) {
                select.innerHTML = Object.keys(materials).map(m => `<option value="${m}">${m}</option>`).join('');
        }
        return materials;
}

function wirePipeMassCalc() {
        const form = document.getElementById('form-pipe-mass');
        if (!form) return;
        const btn = document.getElementById('btn-calc-pipe-mass');
        const DoInput = form.Do, tInput = form.t, DiInput = form.Di, lengthInput = form.length, countInput = form.count, materialSelect = form.material, densityInput = form.density;
        const resTotalLength = document.getElementById('res-total-length');
        const resMassPerMeter = document.getElementById('res-mass-per-meter');
        const resTotalMass = document.getElementById('res-total-mass');

        const densities = populatePipeMassMaterials(materialSelect);

        function updateDensity(){ const d = densities[materialSelect.value]; if (d) densityInput.value = d; }
        function updateDi(){ const Do = parseNumber(DoInput.value), t = parseNumber(tInput.value), Di = Do - 2*t; DiInput.value = isFinite(Di) ? formatNumber(Di,3) : ''; }

        materialSelect.addEventListener('change', updateDensity);
        DoInput.addEventListener('change', updateDi);
        tInput.addEventListener('change', updateDi);

        const doCalc = () => {
                const Do = parseNumber(DoInput.value), t = parseNumber(tInput.value), Di = Do - 2*t, length = parseNumber(lengthInput.value), count = parseNumber(countInput.value), density = parseNumber(densityInput.value);
                if (![Do,t,length,count,density].every(isFinite) || Di <= 0) {
                        resTotalLength.textContent = resMassPerMeter.textContent = resTotalMass.textContent = '—';
                        return;
                }
                const area_mm2 = Math.PI * (Do*Do - Di*Di) / 4;
                const massPerMeter = area_mm2 / 1e6 * density;
                const totalLength = length * count;
                const totalMass = massPerMeter * totalLength;
                resTotalLength.textContent = formatNumber(totalLength, 3);
                resMassPerMeter.textContent = formatNumber(massPerMeter, 3);
                resTotalMass.textContent = formatNumber(totalMass, 3);
        };

       btn.addEventListener('click', doCalc);
       form.addEventListener('keydown', e => {
               if (e.key === 'Enter') { e.preventDefault(); doCalc(); }
       });
       form.addEventListener('reset', () => {
                setTimeout(() => {
                        DiInput.value = '';
                        resTotalLength.textContent = resMassPerMeter.textContent = resTotalMass.textContent = '—';
                        updateDensity();
                }, 0);
        });
        updateDensity(); updateDi();
}

// ===== Liquid height report (flow/holes) =====
function buildLiquidReportHTML({ flow, diameter, holes, height, velocity, holeCounts }) {
       const Qs = flow / 3600;
       const d_m = diameter / 1000;
       const area = Math.PI * d_m * d_m / 4;
       return `
       <div style="font-family: Inter, Arial, sans-serif; color:#000; font-size: 14px; line-height: 1.6;">
               <h2 style="margin:0 0 20px 0; font-size: 20px; text-align: center;">Отчет по расчету: высота слоя жидкости над распределительной тарелкой</h2>
                <h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Исходные данные</h3>
                <table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
                        <tbody>
                                <tr><td style="padding: 6px 8px;">Объемный расход, Q</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(flow, 3)} м³/ч</strong></td></tr>
                                <tr><td style="padding: 6px 8px;">Диаметр отверстия, d</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(diameter, 3)} мм</strong></td></tr>
                                <tr><td style="padding: 6px 8px;">Количество отверстий, n</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(holes, 0)} шт.</strong></td></tr>
                        </tbody>
                </table>
                <h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Результаты</h3>
                <table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
                        <tbody>
                                <tr><td style="padding: 6px 8px;">Линейная скорость, v</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(velocity, 3)} м/с</strong></td></tr>
                                <tr><td style="padding: 6px 8px;">Высота над тарелкой, h</td><td style="text-align:right; padding: 6px 8px;"><strong>${formatNumber(height * 1000, 3)} мм</strong></td></tr>
                        </tbody>
                </table>
                <h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Количество отверстий при той же скорости</h3>
                <table style="width:100%; border-collapse:collapse; font-size: 13px; margin-bottom: 16px;">
                        <thead><tr><th style="text-align:left; padding:6px 8px;">d, мм</th><th style="text-align:right; padding:6px 8px;">n, шт.</th></tr></thead>
                        <tbody>
                                ${holeCounts.map(h=>`<tr><td style='padding:6px 8px;'>${h.d}</td><td style='text-align:right; padding:6px 8px;'><strong>${formatNumber(h.n,0)}</strong></td></tr>`).join('')}
                        </tbody>
                </table>
                <h3 style="margin:16px 0 8px 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Формулы и подстановка</h3>
                <div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        <div style="margin: 8px 0; text-align: center;">$$ A = \\frac{\\pi d^2}{4} $$</div>
                </div>
                <div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        <div style="margin: 8px 0; text-align: center;">$$ v = \\frac{Q}{nA} = \\frac{${formatNumber(Qs,3)}}{${formatNumber(holes,0)} \\cdot ${formatNumber(area,6)}} = ${formatNumber(velocity,3)}\\,\\text{м/с} $$</div>
                </div>
                <div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        <div style="margin: 8px 0; text-align: center;">$$ h = \\frac{v^2}{2g\\mu^2} = \\frac{${formatNumber(velocity,3)}^2}{2\\cdot 9.81 \\cdot 0.62^2} = ${formatNumber(height,3)}\\,\\text{м} $$</div>
                </div>
                <p>Для отверстий диаметром более 2 мм вязкость практически не влияет на расчет.</p>
       </div>`;
}
function buildLiquidExportHTML(params){ return buildLiquidReportHTML(params); }

function wireLiquidHeightCalc() {
	const form = document.getElementById('form-liquid-height');
	const btn = document.getElementById('btn-calc-liquid-height');
        const resVelocity = document.getElementById('res-velocity');
        const resHeightMm = document.getElementById('res-height-mm');
        const resHoleCounts = document.getElementById('res-hole-counts');
        const report = document.getElementById('report-content-liquid-height');
        const printSource = document.getElementById('print-source-liquid-height');

	if (!form) return;

	const doCalc = () => {
                const flow = parseNumber(form.flow.value);
                const diameter = parseNumber(form.diameter.value);
                const holes = parseNumber(form.holes.value);
                const { height, velocity } = calcLiquidHeight({ flow_m3_h: flow, diameter_mm: diameter, holes });
                resVelocity.textContent = formatNumber(velocity, 3);
                resHeightMm.textContent = formatNumber(height * 1000, 3);

                const Qs = flow / 3600;
                const holeCounts = [2,3,4,5,6].map(d => {
                        const area = Math.PI * Math.pow(d/1000,2) / 4;
                        return { d, n: Qs / (velocity * area) };
                });
                resHoleCounts.innerHTML = `<table class="results-table"><thead><tr><th>Диаметр, мм</th><th>Кол-во, шт.</th></tr></thead><tbody>${holeCounts.map(h=>`<tr><td>${h.d}</td><td>${formatNumber(h.n,0)}</td></tr>`).join('')}</tbody></table>`;

                const reportHTML = buildLiquidReportHTML({ flow, diameter, holes, height, velocity, holeCounts });
                const exportHTML = buildLiquidExportHTML({ flow, diameter, holes, height, velocity, holeCounts });
                report.innerHTML = reportHTML;
                printSource.innerHTML = exportHTML;
                if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([report, printSource]).catch(()=>{});
	};
       btn.addEventListener('click', doCalc);
       form.addEventListener('keydown', e => {
               if (e.key === 'Enter') { e.preventDefault(); doCalc(); }
       });
       form.addEventListener('reset', () => setTimeout(() => {
		resVelocity.textContent = '—';
                resHeightMm.textContent = '—';
                resHoleCounts.innerHTML = '';
                report.innerHTML = '';
                printSource.innerHTML = '';
        }, 0));
}

function wireLiquidPDFExport() {
        const exportBtn = document.getElementById('btn-export-pdf-liquid-height');
        const report = document.getElementById('print-source-liquid-height');
	if (!exportBtn) return;
	exportBtn.addEventListener('click', () => {
		if (!report || !report.innerHTML.trim()) return alert('Сначала выполните расчет для создания отчета');
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = report.innerHTML;
		Object.assign(tempDiv.style, {
			position:'absolute', left:'0px', top:'0px', width:'800px',
			backgroundColor:'#ffffff', padding:'20px', fontFamily:'Arial, sans-serif',
			fontSize:'12px', lineHeight:'1.5', color:'#000000', zIndex:'9999', visibility:'visible', opacity:'1'
		});
		document.body.appendChild(tempDiv);
		const runExport = () => {
			const opt = {
				margin:10, filename:'calc-report-liquid-height.pdf',
				image:{ type:'jpeg', quality:0.95 },
				html2canvas:{ scale:1.5, useCORS:true, letterRendering:true, allowTaint:true, backgroundColor:'#ffffff', width:800, height: tempDiv.scrollHeight },
				jsPDF:{ unit:'mm', format:'a4', orientation:'portrait' }
			};
			html2pdf().set(opt).from(tempDiv).save().then(()=>document.body.removeChild(tempDiv))
			.catch((e)=>{ if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv); alert('Ошибка при экспорте PDF: ' + e.message); });
		};
		setTimeout(runExport,200);
	});
}

// ===== Velocity helper table & gas calorific =====
const velocityDiameters = [20,25,32,40,50,65,80,100,150,200,250,300,350,400,500,600,700,800,900,1000];

function wireVelocityCalc() {
	const form = document.getElementById('form-velocity');
	if (!form) return;
	const btn = document.getElementById('btn-calc-velocity');
	const tbody = document.getElementById('velocity-results-body');

	const doCalc = () => {
		const flow = parseNumber(form.flow.value);
		if (!isFinite(flow) || flow <= 0) { tbody.innerHTML = ''; return; }
		const Q = flow / 3600; // m^3/s
		tbody.innerHTML = '';
		velocityDiameters.forEach(D => {
			const area = Math.PI * Math.pow(D/1000, 2) / 4;
			const v = Q / area;
			const tr = document.createElement('tr');
			tr.innerHTML = `<td>${D}</td><td>${formatNumber(v,3)}</td>`;
                        if (v >= 10 && v <= 15) tr.classList.add('gas-ok');
                        if (v >= 0.8 && v <= 1.5) tr.classList.add('liquid-ok');
			tbody.appendChild(tr);
		});
	};

       btn.addEventListener('click', doCalc);
       form.addEventListener('keydown', e => {
               if (e.key === 'Enter') { e.preventDefault(); doCalc(); }
       });
       form.addEventListener('reset', () => setTimeout(() => { tbody.innerHTML = ''; }, 0));
}

const gasComponents = [
        { key: 'ch4', M: 16.04, H: 35.8, label: 'Метан' },
        { key: 'c2h6', M: 30.07, H: 65, label: 'Этан' },
        { key: 'c3h8', M: 44.1, H: 93, label: 'Пропан' },
        { key: 'c4h10', M: 58.12, H: 122, label: 'Бутаны' },
        { key: 'c5h12', M: 72.15, H: 151, label: 'Пентаны' },
        { key: 'c6plus', M: 86.18, H: 179, label: 'Гексаны+высшие' },
        { key: 'n2', M: 28.01, H: 0, label: 'Азот' },
        { key: 'co2', M: 44.01, H: 0, label: 'CO₂' },
        { key: 'h2o', M: 18.02, H: 0, label: 'Вода' }
];

function buildGasCalorificReportHTML({ molFracs, massFracs, calorificMJm3, calorificKcalm3, calorificKWhm3, density, calorificMJkg, calorificKcalKg, calorificKWhkg }) {
       const rows = gasComponents.map((c, i) => `<tr><td>${c.label}</td><td style="text-align:right; padding:6px 8px;">${formatNumber(molFracs[i]*100,2)}</td><td style="text-align:right; padding:6px 8px;">${formatNumber(massFracs[i]*100,2)}</td></tr>`).join('');
       return `
       <div style="font-family: Inter, Arial, sans-serif; color:#000; font-size:14px; line-height:1.6;">
               <h2 style="margin:0 0 20px 0; font-size:20px; text-align:center;">Отчет по расчету: калорийность газа</h2>
               <h3 style="margin:16px 0 8px 0; font-size:16px; border-bottom:1px solid #ccc; padding-bottom:4px;">Состав газа</h3>
               <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:16px;">
                       <thead><tr><th style="text-align:left; padding:6px 8px;">Компонент</th><th style="text-align:right; padding:6px 8px;">Мольная концентрация, %</th><th style="text-align:right; padding:6px 8px;">Массовая концентрация, %</th></tr></thead>
                       <tbody>${rows}<tr><td style="padding:6px 8px;">Сумма</td><td style="text-align:right; padding:6px 8px;"><strong>100</strong></td><td style="text-align:right; padding:6px 8px;"><strong>100</strong></td></tr></tbody>
               </table>
               <h3 style="margin:16px 0 8px 0; font-size:16px; border-bottom:1px solid #ccc; padding-bottom:4px;">Результаты</h3>
               <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:16px;">
                       <tbody>
                               <tr><td style="padding:6px 8px;">Калорийность, МДж/м³</td><td style="text-align:right; padding:6px 8px;"><strong>${formatNumber(calorificMJm3,3)}</strong></td></tr>
                               <tr><td style="padding:6px 8px;">Калорийность, ккал/м³</td><td style="text-align:right; padding:6px 8px;"><strong>${formatNumber(calorificKcalm3,3)}</strong></td></tr>
                               <tr><td style="padding:6px 8px;">Калорийность, кВт·ч/м³</td><td style="text-align:right; padding:6px 8px;"><strong>${formatNumber(calorificKWhm3,3)}</strong></td></tr>
                               <tr><td style="padding:6px 8px;">Плотность, кг/м³</td><td style="text-align:right; padding:6px 8px;"><strong>${formatNumber(density,3)}</strong></td></tr>
                               <tr><td style="padding:6px 8px;">Калорийность, МДж/кг</td><td style="text-align:right; padding:6px 8px;"><strong>${formatNumber(calorificMJkg,3)}</strong></td></tr>
                               <tr><td style="padding:6px 8px;">Калорийность, ккал/кг</td><td style="text-align:right; padding:6px 8px;"><strong>${formatNumber(calorificKcalKg,3)}</strong></td></tr>
                               <tr><td style="padding:6px 8px;">Калорийность, кВт·ч/кг</td><td style="text-align:right; padding:6px 8px;"><strong>${formatNumber(calorificKWhkg,3)}</strong></td></tr>
                       </tbody>
               </table>
               <p>Формула: \(H = \sum x_i H_i\)</p>
       </div>`;
}

function buildGasCalorificExportHTML(params){ return buildGasCalorificReportHTML(params); }

function wireGasCalorificCalc() {
       const form = document.getElementById('form-gas-calorific');
       if (!form) return;
       const btn = document.getElementById('btn-calc-gas');
       const resMJm3 = document.getElementById('res-gas-mj-m3');
       const resKcalm3 = document.getElementById('res-gas-kcal-m3');
       const resKWhm3 = document.getElementById('res-gas-kwh-m3');
       const resDensity = document.getElementById('res-gas-density');
       const resMJkg = document.getElementById('res-gas-mj-kg');
       const resKcalKg = document.getElementById('res-gas-kcal-kg');
       const resKWhkg = document.getElementById('res-gas-kwh-kg');
       const sumDisplay = document.getElementById('gas-total');
       const inputs = gasComponents.map(c => form[c.key]);
       const report = document.getElementById('report-content-gas-calorific');
       const printSource = document.getElementById('print-source-gas-calorific');

        function updateSum() {
                const total = inputs.reduce((s,inp) => s + (parseNumber(inp.value) || 0), 0);
                sumDisplay.textContent = formatNumber(total, 2);
        }
        inputs.forEach(inp => inp.addEventListener('input', updateSum));

        const doCalc = () => {
                const basis = form.basis.value;
                const values = gasComponents.map(c => parseNumber(form[c.key].value) || 0);
                const total = values.reduce((a,b)=>a+b,0);
                sumDisplay.textContent = formatNumber(total,2);
                let molFracs, massFracs;
                if (basis === 'molar') {
                        molFracs = values.map(v => total > 0 ? v/total : 0);
                        const masses = molFracs.map((x,i) => x * gasComponents[i].M);
                        const msum = masses.reduce((a,b)=>a+b,0);
                        massFracs = masses.map(m => msum > 0 ? m/msum : 0);
                } else {
                        massFracs = values.map(v => total > 0 ? v/total : 0);
                        const moles = massFracs.map((w,i) => w / gasComponents[i].M);
                        const msum = moles.reduce((a,b)=>a+b,0);
                        molFracs = moles.map(m => msum > 0 ? m/msum : 0);
                }
                const calorificMJm3 = molFracs.reduce((s,x,i)=> s + x * gasComponents[i].H, 0);
                const calorificKcalm3 = calorificMJm3 * 239.005736;
                const calorificKWhm3 = calorificMJm3 / 3.6;
                const Mmix = molFracs.reduce((s,x,i)=> s + x * gasComponents[i].M, 0);
                const density = Mmix / 22.41;
                const calorificMJkg = density > 0 ? calorificMJm3 / density : NaN;
               const calorificKcalKg = calorificMJkg * 239.005736;
               const calorificKWhkg = calorificMJkg / 3.6;

               resMJm3.textContent = formatNumber(calorificMJm3, 3);
               resKcalm3.textContent = formatNumber(calorificKcalm3, 3);
               resKWhm3.textContent = formatNumber(calorificKWhm3, 3);
               resDensity.textContent = formatNumber(density, 3);
               resMJkg.textContent = formatNumber(calorificMJkg, 3);
               resKcalKg.textContent = formatNumber(calorificKcalKg, 3);
               resKWhkg.textContent = formatNumber(calorificKWhkg, 3);

               const reportHTML = buildGasCalorificReportHTML({ molFracs, massFracs, calorificMJm3, calorificKcalm3, calorificKWhm3, density, calorificMJkg, calorificKcalKg, calorificKWhkg });
               const exportHTML = buildGasCalorificExportHTML({ molFracs, massFracs, calorificMJm3, calorificKcalm3, calorificKWhm3, density, calorificMJkg, calorificKcalKg, calorificKWhkg });
               report.innerHTML = reportHTML;
               printSource.innerHTML = exportHTML;
               if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([report]).catch(() => {});
       };

       btn.addEventListener('click', doCalc);
       form.addEventListener('keydown', e => {
               if (e.key === 'Enter') { e.preventDefault(); doCalc(); }
       });
       form.addEventListener('reset', () => setTimeout(() => {
               resMJm3.textContent = '—';
               resKcalm3.textContent = '—';
               resDensity.textContent = '—';
               resKWhm3.textContent = '—';
               resMJkg.textContent = '—';
               resKcalKg.textContent = '—';
               resKWhkg.textContent = '—';
               sumDisplay.textContent = '0';
               report.innerHTML = '';
               printSource.innerHTML = '';
       }, 0));
       updateSum();
}

function wireGasCalorificPDFExport() {
       const exportBtn = document.getElementById('btn-export-pdf-gas-calorific');
       const report = document.getElementById('print-source-gas-calorific');
       if (!exportBtn) return;
       exportBtn.addEventListener('click', () => {
               if (!report || !report.innerHTML.trim()) return alert('Сначала выполните расчет для создания отчета');
               const tempDiv = document.createElement('div');
               tempDiv.innerHTML = report.innerHTML;
               Object.assign(tempDiv.style, {
                       position:'absolute', left:'0px', top:'0px', width:'800px',
                       backgroundColor:'#ffffff', padding:'20px', fontFamily:'Arial, sans-serif',
                       fontSize:'12px', lineHeight:'1.5', color:'#000000', zIndex:'9999', visibility:'visible', opacity:'1'
               });
               document.body.appendChild(tempDiv);
               const runExport = () => {
                       const opt = {
                               margin:10, filename:'calc-report-gas-calorific.pdf',
                               image:{ type:'jpeg', quality:0.95 },
                               html2canvas:{ scale:1.5, useCORS:true, letterRendering:true, allowTaint:true, backgroundColor:'#ffffff', width:800, height: tempDiv.scrollHeight },
                               jsPDF:{ unit:'mm', format:'a4', orientation:'portrait' }
                       };
                       html2pdf().set(opt).from(tempDiv).save().then(()=>document.body.removeChild(tempDiv))
                       .catch((e)=>{ if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv); alert('Ошибка при экспорте PDF: ' + e.message); });
               };
               setTimeout(runExport,200);
       });
}

// ===== Navigation & PDF for internal/external =====
function wirePDFExport() {
	const exportBtn = document.getElementById('btn-export-pdf');
	const report = document.getElementById('print-source');
	if (!exportBtn) return;
	exportBtn.addEventListener('click', () => {
		if (!report) return alert('Ошибка: элемент отчета не найден');
		if (!report.innerHTML.trim()) return alert('Сначала выполните расчет для создания отчета');
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = report.innerHTML;
		Object.assign(tempDiv.style, {
			position:'absolute', left:'0px', top:'0px', width:'800px',
			backgroundColor:'#ffffff', padding:'20px', fontFamily:'Arial, sans-serif',
			fontSize:'12px', lineHeight:'1.5', color:'#000000', zIndex:'9999', visibility:'visible', opacity:'1'
		});
		document.body.appendChild(tempDiv);
		const runExport = () => {
			const opt = {
				margin:10, filename:'calc-report.pdf',
				image:{ type:'jpeg', quality:0.95 },
				html2canvas:{ scale:1.5, useCORS:true, letterRendering:true, allowTaint:true, backgroundColor:'#ffffff', width:800, height: tempDiv.scrollHeight },
				jsPDF:{ unit:'mm', format:'a4', orientation:'portrait' }
			};
			html2pdf().set(opt).from(tempDiv).save().then(()=>document.body.removeChild(tempDiv))
			.catch((e)=>{ if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv); alert('Ошибка при экспорте PDF: ' + e.message); });
		};
		setTimeout(runExport,200);
	});
}

function wireExternalPDFExport() {
	const exportBtn = document.getElementById('btn-export-pdf-external');
	const report = document.getElementById('print-source-ext');
	if (!exportBtn) return;
	exportBtn.addEventListener('click', () => {
		if (!report || !report.innerHTML.trim()) return alert('Сначала выполните расчет для создания отчета');
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = report.innerHTML;
		Object.assign(tempDiv.style, {
			position:'absolute', left:'0px', top:'0px', width:'800px',
			backgroundColor:'#ffffff', padding:'20px', fontFamily:'Arial, sans-serif',
			fontSize:'12px', lineHeight:'1.5', color:'#000000', zIndex:'9999', visibility:'visible', opacity:'1'
		});
		document.body.appendChild(tempDiv);
		const runExport = () => {
			const opt = {
				margin:10, filename:'calc-report-external.pdf',
				image:{ type:'jpeg', quality:0.95 },
				html2canvas:{ scale:1.5, useCORS:true, letterRendering:true, allowTaint:true, backgroundColor:'#ffffff', width:800, height: tempDiv.scrollHeight },
				jsPDF:{ unit:'mm', format:'a4', orientation:'portrait' }
			};
			html2pdf().set(opt).from(tempDiv).save().then(()=>document.body.removeChild(tempDiv))
			.catch((e)=>{ if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv); alert('Ошибка при экспорте PDF: ' + e.message); });
		};
		setTimeout(runExport,200);
	});
}

// ===== Tree navigation =====
function wireTreeNavigation() {
	const items = Array.from(document.querySelectorAll('.tree-item'));
	const views = {
		'thickness-internal': document.getElementById('view-thickness-internal'),
		'thickness-external': document.getElementById('view-thickness-external'),
		'velocity': document.getElementById('view-velocity'),
		'pipe-mass': document.getElementById('view-pipe-mass'),
		'liquid-height': document.getElementById('view-liquid-height'),
		'pipe-resistance': document.getElementById('view-pipe-resistance'),
		'gas-calorific': document.getElementById('view-gas-calorific'),
	};
	function showView(key) {
		Object.values(views).forEach(v => v.classList.remove('visible'));
		if (views[key]) views[key].classList.add('visible');
	}
	items.forEach((el) => {
		el.addEventListener('click', () => {
			items.forEach(i => i.classList.remove('active'));
			el.classList.add('active');
			const key = el.getAttribute('data-calc');
			showView(key);
		});
	});
}

function wireCollapsibleFolders() {
	const folders = document.querySelectorAll('.tree-folder');
	folders.forEach(folder => {
		const header = folder.querySelector('.folder-header');
		const content = folder.querySelector('.folder-content');
		header.addEventListener('click', () => {
			const isCollapsed = content.classList.contains('collapsed');
			if (isCollapsed) { content.classList.remove('collapsed'); header.classList.remove('collapsed'); }
			else { content.classList.add('collapsed'); header.classList.add('collapsed'); }
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	populateMaterials();
	wireInternalCalc();
	wireExternalCalc();
	wirePDFExport();
	wireExternalPDFExport();
	wirePipeResistanceCalc();
	wirePipeResistancePDFExport();
	wirePipeMassCalc();
       wireLiquidHeightCalc();
       wireLiquidPDFExport();
       wireVelocityCalc();
       wireGasCalorificCalc();
       wireGasCalorificPDFExport();
       wireTreeNavigation();
       wireCollapsibleFolders();
});

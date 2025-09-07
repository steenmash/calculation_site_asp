// Materials will be loaded from backend
let materialProps = {};
let materialsOrder = [];

async function populateMaterials() {
        const selects = document.querySelectorAll('select[name="material"]');
        try {
                const res = await fetch('/api/materials');
                const items = await res.json();
                materialsOrder = items.map(m => m.name);
                materialProps = {};
                selects.forEach(select => {
                        select.innerHTML = items.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
                });
                items.forEach(m => materialProps[m.name] = { E: m.e_MPa, nu: m.nu });
        } catch (e) {
                console.error('Materials load error', e);
        }
}

function parseNumber(value) {
	if (typeof value !== 'string') return Number.NaN;
	const normalized = value.replace(',', '.').replace(/\s+/g, '');
	return Number(normalized);
}

async function findAllowableStress(material, temperatureC) {
        const res = await fetch('/api/materials/allowable-stress', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ material, temperatureC })
        });
        if (!res.ok) throw new Error('allowable stress error');
        const data = await res.json();
        return { sigma: data.sigmaAllow_MPa, exceeded: data.exceeded, tLimit: data.tLimitC };
}

async function calcThicknessInternalByDi(payload) {
        const res = await fetch('/api/pressure/internal/thickness', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('internal thickness error');
        return res.json();
}

async function calcAllowablePressureByDi(payload) {
        const res = await fetch('/api/pressure/internal/allowable', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('internal allowable error');
        const data = await res.json();
        return data.Pallow_MPa;
}

async function calcThicknessExternalByDo(payload) {
        const res = await fetch('/api/pressure/external/thickness', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('external thickness error');
        return res.json();
}

async function calcCriticalPressure(payload) {
        const res = await fetch('/api/pressure/external/critical', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('external critical error');
        const data = await res.json();
        return data.Pcr_MPa;
}

async function calcPipeResistance(payload) {
        const res = await fetch('/api/hydraulics/pipe-resistance', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('pipe resistance error');
        return res.json();
}

async function calcLiquidHeight(payload) {
        const res = await fetch('/api/liquid/height', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('liquid height error');
        return res.json();
}

function formatNumber(value, digits = 3) {
	if (!isFinite(value)) return '—';
	return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}


const pipeFluids = {
        water: { tMin: 0.1, tMax: 99 },
        diesel: { tMin: -25, tMax: 150 },
        gasoline: { tMin: -30, tMax: 30 }
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
async function updateMaterialsComparisonTable(DiActual, T, P, c, phi) {
const tbody = document.getElementById('materials-tbody');
if (!tbody) return;
if (![DiActual, T, P, c, phi].every(isFinite)) return;
let html = '';
for (const materialName of materialsOrder) {
    const stress = await findAllowableStress(materialName, T);
    const sigma = stress.sigma;
    const isApplicable = !stress.exceeded && isFinite(sigma) && sigma > 0;
    let thickness = '—';
    let status = '';
    if (isApplicable) {
        const { tRequired_mm } = await calcThicknessInternalByDi({
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
    html += `<tr><td class="material-name">${materialName}</td><td class="material-stress">${isApplicable ? formatNumber(sigma,0) : '—'}</td><td class="material-thickness">${thickness}</td><td class="material-status">${status}</td></tr>`;
}
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

const doCalc = async () => {
const DiActual = parseNumber(form.Di_actual.value);
const T = parseNumber(form.temperature.value);
const tActual = parseNumber(form.t_actual.value);
const P = parseNumber(form.pressure.value);
const c = parseNumber(form.corrosion.value || '0');
const phi = parseNumber(form.weld_eff.value || '1');
const material = form.material.value;

const stress = await findAllowableStress(material, T);
const sigma = stress.sigma;
const { tRequired_mm, tTotal_mm } = await calcThicknessInternalByDi({
Di_mm: DiActual,
P_MPa: P,
sigmaAllow_MPa: sigma,
weldEfficiency: phi,
corrosion_mm: c,
});
const Pallow = await calcAllowablePressureByDi({
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

await updateMaterialsComparisonTable(DiActual, T, P, c, phi);

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

const doCalc = async () => {
const DoActual = parseNumber(form.Do_actual.value);
const T = parseNumber(form.temperature.value);
const tActual = parseNumber(form.t_actual.value);
const P = parseNumber(form.pressure.value);
const c = parseNumber(form.corrosion.value || '0');
const length = parseNumber(form.length.value);
const material = form.material.value;

const stress = await findAllowableStress(material, T);
const sigma = stress.sigma;
const props = materialProps[material] || { E: 2.06e5, nu: 0.3 };

const { tRequired_mm, tTotal_mm, longCylinder } = await calcThicknessExternalByDo({
Do_mm: DoActual,
P_MPa: P,
E_MPa: props.E,
nu: props.nu,
length_mm: length,
corrosion_mm: c,
});

const Pcr = await calcCriticalPressure({ Do_mm: DoActual, tActual_mm: tActual, corrosion_mm: c, length_mm: length, E_MPa: props.E, nu: props.nu });
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

        const doCalc = async () => {
                const fluid = fluidSelect.value;
                const T = parseNumber(tempInput.value);
                const L = parseNumber(form.length.value);
                const D = parseNumber(form.diameter.value) / 1000;
                const roughType = form.roughness.value;
                const eps = roughnessValues[roughType];
                const Q = parseNumber(form.flow.value);
                try {
                        const data = await calcPipeResistance({ fluidId: fluid, T_C: T, L_m: L, D_m: D, eps_m: eps, Q_m3h: Q });
                        const { rho_kg_m3, mu_Pa_s, velocity_m_s, Re, lambda, relativeRoughness, deltaP_Pa } = data;
                        resDensity.textContent = formatNumber(rho_kg_m3, 1);
                        resViscosity.textContent = formatNumber(mu_Pa_s, 6);
                        resVelocity.textContent = formatNumber(velocity_m_s, 3);
                        resRe.textContent = formatNumber(Re, 0);
                        resLambda.textContent = formatNumber(lambda, 5);
                        resRelative.textContent = formatNumber(relativeRoughness, 6);
                        resDeltaP.textContent = formatNumber(deltaP_Pa, 2);
                        const reportHTML = buildPipeResistanceReportHTML({
                                fluidName: pipeFluidNames[fluid], T, L, D,
                                roughnessName: roughnessNames[roughType], roughnessValue: eps,
                                flow: Q, velocity: velocity_m_s, rho: rho_kg_m3, mu: mu_Pa_s, Re, lambda, relativeRoughness, deltaP: deltaP_Pa
                        });
                        const exportHTML = buildPipeResistanceExportHTML({
                                fluidName: pipeFluidNames[fluid], T, L, D,
                                roughnessName: roughnessNames[roughType], roughnessValue: eps,
                                flow: Q, velocity: velocity_m_s, rho: rho_kg_m3, mu: mu_Pa_s, Re, lambda, relativeRoughness, deltaP: deltaP_Pa
                        });
                        report.innerHTML = reportHTML;
                        printSource.innerHTML = exportHTML;
                        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([report, printSource]).catch(() => {});
                } catch (e) {
                        alert('Ошибка: ' + e.message);
                }
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

        const doCalc = async () => {
                const flow = parseNumber(form.flow.value);
                const diameter = parseNumber(form.diameter.value);
                const holes = parseNumber(form.holes.value);
                try {
                        const data = await calcLiquidHeight({ flow_m3_h: flow, diameter_mm: diameter, holes });
                        const height = data.height_m;
                        const velocity = data.velocity_m_s;
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
                } catch (e) {
                        alert('Ошибка: ' + e.message);
                }
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

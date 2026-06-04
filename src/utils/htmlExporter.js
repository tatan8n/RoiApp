import { EQUIPMENT_MODELS, SERVICE_TYPES } from './constants.js'

export function generateHTML(formData, results, logoDataUrl = '') {
  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'
  const isContratoMarco = isService && formData.serviceType === 'contrato_marco'
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === formData.equipment?.modelId)
  const selectedService = SERVICE_TYPES.find(s => s.id === formData.serviceType)

  const esc = (v) =>
    (v || '').toString()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;')

  const getItemName = () => {
    if (isProduct) return selectedModel?.name || 'Personalizado'
    if (isContratoMarco) return 'Contrato Marco'
    return selectedService?.name || 'Servicio'
  }
  const getItemLabel = () => isProduct ? 'Equipo Seleccionado' : 'Servicio'

  const currency = formData.currency || 'COP'
  const fmt = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (!isFinite(value) || isNaN(value)) return value < 0 ? '-∞' : '∞'
    if (currency === 'USD') {
      return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' USD'
    }
    const m = value / 1_000_000
    return '$' + m.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' MM'
  }

  const isNil = (v) => v === null || v === undefined
  const roiHtml    = isNil(results.roi)               ? 'N/A' : results.roi.toFixed(1) + '%'
  const paybackHtml= isNil(results.payback)           ? 'N/A' : String(results.payback)
  const bcrHtml    = isNil(results.benefitCostRatio)  ? 'N/A' : results.benefitCostRatio.toFixed(2)
  const tirHtml    = isNil(results.tir)               ? 'N/A' : results.tir.toFixed(1) + '%'
  const discountPct = ((formData.financial?.discountRate ?? 0.12) * 100)
  const discountLabel = discountPct.toFixed(0)

  // Semantic colors
  const roiColor     = isNil(results.roi)              ? '#94A3B8' : results.roi > 0               ? '#27AE60' : '#C0392B'
  const vanColor     = isNil(results.van)              ? '#94A3B8' : results.van > 0               ? '#27AE60' : '#C0392B'
  const bcrColor     = isNil(results.benefitCostRatio) ? '#94A3B8' : results.benefitCostRatio > 1  ? '#27AE60' : '#F39C12'
  const tirColor     = isNil(results.tir)              ? '#94A3B8' : results.tir > discountPct     ? '#27AE60' : '#F39C12'
  const paybackColor = isNil(results.payback)          ? '#C0392B' : '#00579B'

  const iconBg = (c) => ({ '#27AE60': '#dcfce7', '#C0392B': '#fee2e2', '#00579B': '#dbeafe', '#F39C12': '#fef3c7', '#94A3B8': '#f1f5f9' }[c] || '#f1f5f9')

  const certColor = results.certainty >= 80 ? '#27AE60' : results.certainty >= 50 ? '#F39C12' : '#C0392B'
  const certLabel = results.certainty >= 80 ? 'Alta' : results.certainty >= 50 ? 'Media' : 'Baja'
  const certBg    = results.certainty >= 80 ? '#dcfce7' : results.certainty >= 50 ? '#fef3c7' : '#fee2e2'

  const typeLabel = isProduct
    ? 'Producto: ' + (selectedModel?.name || 'Personalizado')
    : isContratoMarco ? 'Contrato Marco' : 'Análisis Rotodinámico'

  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
  const year  = new Date().getFullYear()

  // Chart data
  const factorsData = Object.values(results.factors || {})
    .filter(f => f && f.answered)
    .sort((a, b) => (b.savings || 0) - (a.savings || 0))
  const projection = results.projection || []

  let paybackYearIdx = -1
  for (let i = 0; i < projection.length; i++) {
    if (projection[i].cumulative >= 0 && (i === 0 || projection[i - 1].cumulative < 0)) {
      paybackYearIdx = i; break
    }
  }

  const factorLabels   = JSON.stringify(factorsData.map(f => f.name || ''))
  const factorSavings  = JSON.stringify(factorsData.map(f => f.savings || 0))
  const projLabels     = JSON.stringify(projection.map(p => 'Año ' + (p.year || '')))
  const projCumulative = JSON.stringify(projection.map(p => p.cumulative || 0))
  const projAnnual     = JSON.stringify(projection.map(p => p.annualSavings || 0))
  const currSuffix     = currency === 'USD' ? ' USD' : ' COP'
  const currLabel      = currency === 'USD' ? 'USD'  : 'MM COP'

  // ── Factor rows ──
  const factorRows = factorsData.map(f => {
    const pct   = results.totalSavings > 0 ? (f.savings / results.totalSavings * 100) : 0
    const isDom = (results.dominantFactors || []).some(df => df.name === f.name)
    return `
    <tr>
      <td>
        <div class="fn">${esc(f.name || '')}${isDom ? '<span class="dom">↑ Dominante</span>' : ''}</div>
        ${f.description ? `<div class="fd">${esc(f.description)}</div>` : ''}
      </td>
      <td class="r muted">${fmt(f.baseValue)}</td>
      <td class="r">
        <span class="green">${fmt(f.savings)}</span><br>
        <span class="tiny muted">${fmt(f.savings / 12)}/mes</span>
      </td>
      <td class="r">
        <span class="pct-num">${pct.toFixed(0)}%</span>
        <div class="pbar"><div class="pfill" style="width:${Math.min(100, pct).toFixed(1)}%"></div></div>
      </td>
    </tr>`
  }).join('')

  // ── Projection rows ──
  const projRows = projection.map((p, idx) => {
    const isPayback = idx === paybackYearIdx
    return `
    <tr${isPayback ? ' class="pb-row"' : ''}>
      <td>Año ${p.year || ''}${isPayback ? '<span class="pb-pill">✓ Payback</span>' : ''}</td>
      <td class="r">${fmt(p.annualSavings)}</td>
      <td class="r green">${fmt(p.cumulative)}</td>
      <td class="r" style="font-weight:700;color:${(p.roi || 0) >= 0 ? '#27AE60' : '#C0392B'}">${(p.roi || 0).toFixed(1)}%</td>
    </tr>`
  }).join('')

  // ── Alert helpers ──
  const alertHtml = (type, icon, title, body) => `
  <div class="alert alert-${type}">
    <span class="ai">${icon}</span>
    <div><strong>${title}</strong><p>${body}</p></div>
  </div>`

  const alerts = [
    results.roiWarning && alertHtml(
      results.roiSeverity === 'danger' ? 'danger' : 'warn',
      results.roiSeverity === 'danger' ? '🚨' : '⚠️',
      results.roiSeverity === 'danger' ? 'Resultados poco realistas — verifique los datos' : 'Resultados posiblemente sobreestimados',
      results.roiSeverity === 'danger'
        ? 'El ROI supera el 500%, muy poco probable para mantenimiento predictivo. Revise los datos ingresados.'
        : 'El ROI supera el 300%, lo cual puede indicar que algunos datos producen ahorros poco realistas.'
    ),
    results.savingsOverCap && alertHtml('warn', '⚠️', 'Ahorro total desproporcionado',
      `El ahorro anual representa el ${results.savingsCapPct}% de la facturación anual, superando el tope del 30% típico. Verifique los datos ingresados.`),
    (results.dominantFactors?.length || 0) > 0 && alertHtml('warn', '📊',
      'Factor' + (results.dominantFactors.length > 1 ? 'es dominantes detectados' : ' dominante detectado'),
      results.dominantFactors.map(df => `${df.name} (${df.ratio}% del ahorro total)`).join(', ') + '. Un factor concentra gran parte del resultado.'),
    (results.warnings?.length || 0) > 0 && alertHtml('info', '💡', 'Verificación de datos',
      results.warnings.map(w => esc(w.message)).join('<br>'))
  ].filter(Boolean).join('\n')

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Reporte ROI — ${esc(formData.client?.companyName || 'Cliente')} | A-MAQ</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
:root{
  --n9:#002B5C;--n8:#003366;--n7:#004080;--n6:#00579B;--n5:#0066B3;--n4:#3380BF;--n1:#D6E9F8;--n0:#EBF4FA;
  --ok:#27AE60;--ok0:#f0fdf4;--warn:#F39C12;--warn0:#fffbeb;--err:#C0392B;--err0:#fef2f2;
  --info:#0066B3;--info0:#EBF4FA;
  --tx:#0F172A;--tx2:#334155;--txm:#64748B;--bg:#F0F4F8;--wh:#FFFFFF;--bd:#E2E8F0;
  --sh:0 1px 3px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.05);
  --sh2:0 4px 6px rgba(0,0,0,.04),0 12px 30px rgba(0,0,0,.08);
  --r:12px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',system-ui,sans-serif;background:var(--bg);color:var(--tx);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased}

/* ── BAR ── */
.topbar{background:var(--wh);border-bottom:1px solid var(--bd);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:99;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.topbar-l{font-size:12px;color:var(--txm)}
.btn-p{display:inline-flex;align-items:center;gap:7px;background:var(--n8);color:#fff;border:none;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s}
.btn-p:hover{background:var(--n7)}
.btn-p svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}

/* ── PAGE ── */
.page{max-width:960px;margin:0 auto;padding:20px 20px 56px}

/* ── HEADER ── */
.hdr{background:linear-gradient(135deg,var(--n9) 0%,var(--n7) 55%,var(--n6) 100%);border-radius:var(--r);overflow:hidden;position:relative;margin-bottom:20px;color:#fff}
.hdr-geo{position:absolute;inset:0;overflow:hidden;pointer-events:none;opacity:.055}
.hdr-geo svg{width:100%;height:100%}
.hdr-top{position:relative;z-index:1;display:grid;grid-template-columns:1fr auto;gap:24px;padding:36px 40px 24px;align-items:start}
.hdr-brand{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.hdr-mark{width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.28);display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;font-size:22px;font-weight:800}
.hdr-logo{height:44px;width:auto;object-fit:contain;filter:brightness(0) invert(1);opacity:.95}
.hdr-mname{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.9}
.hdr-mtag{font-size:11px;opacity:.55;letter-spacing:.04em}
.hdr-co{font-family:'DM Sans',sans-serif;font-size:32px;font-weight:800;line-height:1.15;margin-bottom:6px;letter-spacing:-.3px}
.hdr-sub{font-size:14px;opacity:.75;font-weight:400}
.hdr-right{text-align:right;min-width:156px}
.hdr-dl{font-size:10px;opacity:.5;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;margin-top:12px}
.hdr-dv{font-size:14px;font-weight:600}
.cert-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.04em;border:1.5px solid;margin-top:12px}
.cert-dot{width:7px;height:7px;border-radius:50%;background:currentColor;flex-shrink:0}
.hdr-chips{position:relative;z-index:1;padding:12px 40px;background:rgba(0,0,0,.18);border-top:1px solid rgba(255,255,255,.07);display:flex;flex-wrap:wrap;gap:7px}
.chip{background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.17);color:rgba(255,255,255,.88);padding:3px 12px;border-radius:20px;font-size:11px;font-weight:500}

/* ── SECTION LABEL ── */
.sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txm);margin:24px 0 10px;display:flex;align-items:center;gap:8px}
.sl::after{content:'';flex:1;height:1px;background:var(--bd)}

/* ── KPI GRID ── */
.kgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.kcard{background:var(--wh);border-radius:var(--r);padding:18px 14px 14px;box-shadow:var(--sh);border-top:4px solid var(--kc,var(--n5));transition:transform .15s,box-shadow .15s}
.kcard:hover{transform:translateY(-2px);box-shadow:var(--sh2)}
.kico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
.kico svg{width:15px;height:15px;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;fill:none}
.kval{font-family:'DM Sans',sans-serif;font-size:26px;font-weight:800;line-height:1.1;color:var(--kc,var(--tx));letter-spacing:-.5px}
.kval.na{font-size:20px;color:var(--txm)}
.klbl{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--txm);margin-top:3px}
.ksub{font-size:11px;color:var(--txm);margin-top:2px}

/* ── CERT BAR ── */
.cert-row{background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);padding:14px 22px;display:flex;align-items:center;gap:16px}
.cert-lbl{font-size:11px;font-weight:700;color:var(--txm);white-space:nowrap}
.cert-track{flex:1;height:7px;background:var(--bd);border-radius:4px;overflow:hidden}
.cert-fill{height:100%;border-radius:4px}
.cert-val{font-size:14px;font-weight:700;white-space:nowrap}
.cert-miss{font-size:11px;color:var(--txm)}

/* ── ALERTS ── */
.alert{border-radius:10px;padding:13px 16px;display:flex;gap:12px;align-items:flex-start;margin-top:10px;border-left:4px solid}
.alert-warn{background:var(--warn0);border-color:var(--warn);color:#78350f}
.alert-danger{background:var(--err0);border-color:var(--err);color:#7f1d1d}
.alert-info{background:var(--info0);border-color:var(--info);color:#1e3a5f}
.alert .ai{font-size:17px;flex-shrink:0;margin-top:1px}
.alert strong{font-size:13px;font-weight:700;display:block;margin-bottom:2px}
.alert p{font-size:12px;opacity:.85;margin:0}

/* ── SUMMARY STRIP ── */
.sstrip{background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);display:grid;grid-template-columns:repeat(3,1fr);overflow:hidden}
.si{padding:20px 24px;position:relative}
.si+.si::before{content:'';position:absolute;left:0;top:18%;bottom:18%;width:1px;background:var(--bd)}
.si-lbl{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--txm);margin-bottom:6px}
.si-val{font-family:'DM Sans',sans-serif;font-size:22px;font-weight:800;line-height:1.1;letter-spacing:-.3px}
.si-sub{font-size:11px;color:var(--txm);margin-top:4px}

/* ── CHARTS ── */
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ccard{background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden}
.ch{padding:15px 20px 12px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
.ch h3{font-size:13px;font-weight:700}
.ch span{font-size:11px;color:var(--txm)}
.cw{padding:14px 16px 16px;height:256px;position:relative}

/* ── CARD ── */
.card{background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden}
.cardh{padding:15px 20px 13px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
.cardh h3{font-size:13px;font-weight:700}
.cardb{padding:20px 24px}

/* ── TABLES ── */
table{width:100%;border-collapse:collapse}
thead tr{border-bottom:2px solid var(--bd)}
th{padding:9px 14px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--txm);background:#fafbfc;text-align:left}
th.r{text-align:right}
td{padding:11px 14px;font-size:13px;border-bottom:1px solid var(--bd);vertical-align:middle}
td.r{text-align:right;font-variant-numeric:tabular-nums}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--n0)}
.fn{font-weight:600;color:var(--tx);font-size:13px}
.fd{font-size:11px;color:var(--txm);margin-top:1px}
.dom{display:inline-flex;align-items:center;background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;border:1px solid #f59e0b;margin-left:7px}
.green{color:var(--ok);font-weight:700}
.muted{color:var(--txm)}
.tiny{font-size:11px}
.pct-num{font-size:12px;font-weight:700;color:var(--n6)}
.pbar{width:72px;height:4px;background:var(--bd);border-radius:2px;overflow:hidden;margin-top:4px;float:right}
.pfill{height:100%;border-radius:2px;background:var(--ok)}
.total-row td{background:var(--n0)!important;font-weight:700;border-top:2px solid var(--bd)}
.pb-row td{background:#f0fdf4!important}
.pb-pill{display:inline-flex;align-items:center;background:var(--ok);color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px}

/* ── INTERPRETATION ── */
.itoggle{width:100%;display:flex;align-items:center;justify-content:space-between;background:none;border:none;cursor:pointer;font-family:inherit;padding:0}
.itoggle h3{font-size:13px;font-weight:700;color:var(--tx)}
.iicon{color:var(--txm);font-size:16px;transition:transform .2s}
.iicon.open{transform:rotate(180deg)}
.ibody{margin-top:16px}
.igrid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.iitem{display:flex;gap:12px}
.iicobox{width:36px;height:36px;background:var(--n0);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;margin-top:1px}
.ilbl{font-size:12px;font-weight:700;color:var(--n8);margin-bottom:3px}
.itxt{font-size:12px;color:var(--txm);line-height:1.55}
.disc{font-size:11px;color:var(--txm);margin-top:14px;padding-top:12px;border-top:1px solid var(--bd);line-height:1.6}

/* ── FOOTER ── */
.ftr{margin-top:32px;padding:22px 0 0;border-top:2px solid var(--bd);display:flex;align-items:center;justify-content:space-between;gap:16px}
.ftr-l{display:flex;align-items:center;gap:12px}
.ftr-mark{width:36px;height:36px;background:var(--n8);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'DM Sans',sans-serif;font-size:18px}
.ftr-co{font-size:13px;font-weight:700;color:var(--n8)}
.ftr-sub{font-size:11px;color:var(--txm)}
.ftr-r{text-align:right;font-size:11px;color:var(--txm);line-height:1.8}

/* ── PRINT ── */
@media print{
  @page{size:A4;margin:1.4cm 1.4cm 2cm}
  .topbar{display:none!important}
  body{background:#fff;font-size:12px}
  .page{padding:0;max-width:100%}
  .hdr{margin:0 0 14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .kcard,.card,.ccard,.cert-row,.sstrip{box-shadow:none;border:1px solid #e2e8f0;break-inside:avoid}
  .kcard{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .cert-fill,.pfill{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .cgrid{break-inside:avoid}
  .ibody{display:block!important}
  .iicon{display:none}
  .ftr{break-inside:avoid}
  .section{break-inside:avoid}
}
@media(max-width:680px){
  .kgrid{grid-template-columns:repeat(2,1fr)}
  .cgrid,.igrid,.sstrip{grid-template-columns:1fr}
  .hdr-top{grid-template-columns:1fr}
  .hdr-right{text-align:left}
  .si+.si::before{display:none}
}
</style>
</head>
<body>

<div class="topbar">
  <span class="topbar-l">Reporte ROI &mdash; ${esc(formData.client?.companyName || 'Cliente')} | A-MAQ</span>
  <button class="btn-p" onclick="window.print()">
    <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    Imprimir / Guardar PDF
  </button>
</div>

<div class="page">

  <!-- HEADER -->
  <div class="hdr">
    <div class="hdr-geo" aria-hidden="true">
      <svg viewBox="0 0 960 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <circle cx="820" cy="30"  r="160" fill="none" stroke="white" stroke-width="38"/>
        <circle cx="920" cy="200" r="100" fill="none" stroke="white" stroke-width="22"/>
        <circle cx="680" cy="180" r="70"  fill="none" stroke="white" stroke-width="14"/>
        <line x1="550" y1="0" x2="960" y2="220" stroke="white" stroke-width="1.2"/>
        <line x1="600" y1="0" x2="960" y2="180" stroke="white" stroke-width=".7"/>
        <rect x="700" y="50" width="55" height="55" fill="none" stroke="white" stroke-width="2" transform="rotate(18 727 77)"/>
      </svg>
    </div>
    <div class="hdr-top">
      <div>
        <div class="hdr-brand">
          ${logoDataUrl
            ? `<img src="${logoDataUrl}" alt="A-MAQ" class="hdr-logo">`
            : '<div class="hdr-mark">A</div>'
          }
          <div>
            <div class="hdr-mname">A-MAQ</div>
            <div class="hdr-mtag">Mantenimiento Industrial Predictivo</div>
          </div>
        </div>
        <div class="hdr-co">${esc(formData.client?.companyName || 'Cliente')}</div>
        <div class="hdr-sub">Análisis de Retorno de Inversión &mdash; Reporte Ejecutivo</div>
      </div>
      <div class="hdr-right">
        <div class="hdr-dl">Fecha</div>
        <div class="hdr-dv">${today}</div>
        ${formData.client?.contactName ? `<div class="hdr-dl">Contacto</div><div class="hdr-dv">${esc(formData.client.contactName)}</div>` : ''}
        <div class="cert-badge" style="color:${certColor};border-color:${certColor};background:rgba(255,255,255,.08)">
          <span class="cert-dot"></span>
          Certeza ${certLabel} &bull; ${results.certainty}%
        </div>
      </div>
    </div>
    <div class="hdr-chips">
      ${formData.client?.sector ? `<span class="chip">&#128205; ${esc(formData.client.sector)}</span>` : ''}
      <span class="chip">&#128203; ${esc(typeLabel)}</span>
      <span class="chip">&#128178; ${currency === 'USD' ? 'USD' : 'COP (Millones)'}</span>
      <span class="chip">&#128197; ${results.projectionYears || 5} a&ntilde;os proyecci&oacute;n</span>
      <span class="chip">&#128200; Tasa descuento: ${discountLabel}%</span>
    </div>
  </div>

  <!-- KPIs -->
  <div class="sl">Indicadores Clave</div>
  <div class="kgrid">

    <div class="kcard" style="--kc:${roiColor}">
      <div class="kico" style="background:${iconBg(roiColor)}">
        <svg viewBox="0 0 24 24" stroke="${roiColor}"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
      </div>
      <div class="kval${isNil(results.roi) ? ' na' : ''}">${roiHtml}</div>
      <div class="klbl">ROI</div>
      <div class="ksub">Retorno en ${results.projectionYears || 5} a&ntilde;os</div>
    </div>

    <div class="kcard" style="--kc:${paybackColor}">
      <div class="kico" style="background:${iconBg(paybackColor)}">
        <svg viewBox="0 0 24 24" stroke="${paybackColor}"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <div class="kval${isNil(results.payback) ? ' na' : ''}">${paybackHtml}</div>
      <div class="klbl">Payback</div>
      <div class="ksub">${isNil(results.payback) ? 'No se recupera' : 'meses'}</div>
    </div>

    <div class="kcard" style="--kc:${bcrColor}">
      <div class="kico" style="background:${iconBg(bcrColor)}">
        <svg viewBox="0 0 24 24" stroke="${bcrColor}"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      </div>
      <div class="kval${isNil(results.benefitCostRatio) ? ' na' : ''}">${bcrHtml}</div>
      <div class="klbl">Beneficio/Costo</div>
      <div class="ksub">B/C &gt; 1 = favorable</div>
    </div>

    <div class="kcard" style="--kc:${vanColor}">
      <div class="kico" style="background:${iconBg(vanColor)}">
        <svg viewBox="0 0 24 24" stroke="${vanColor}"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div class="kval${isNil(results.van) ? ' na' : ''}" style="font-size:${results.van && Math.abs(results.van) > 9e11 ? '17px' : '24px'}">${fmt(results.van)}</div>
      <div class="klbl">VAN</div>
      <div class="ksub">Valor Actual Neto</div>
    </div>

    <div class="kcard" style="--kc:${tirColor}">
      <div class="kico" style="background:${iconBg(tirColor)}">
        <svg viewBox="0 0 24 24" stroke="${tirColor}"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div class="kval${isNil(results.tir) ? ' na' : ''}">${tirHtml}</div>
      <div class="klbl">TIR</div>
      <div class="ksub">Tasa Int. de Retorno</div>
    </div>

  </div>

  <!-- CERTEZA -->
  <div style="margin-top:12px">
    <div class="cert-row">
      <span class="cert-lbl">Certeza del an&aacute;lisis</span>
      <div class="cert-track">
        <div class="cert-fill" style="width:${results.certainty}%;background:${certColor}"></div>
      </div>
      <span class="cert-val" style="color:${certColor}">${certLabel} &ndash; ${results.certainty}%</span>
      ${(results.missingFields?.length || 0) > 0 ? `<span class="cert-miss">(${results.missingFields.length} campo${results.missingFields.length !== 1 ? 's' : ''} incompleto${results.missingFields.length !== 1 ? 's' : ''})</span>` : ''}
    </div>
  </div>

  <!-- ALERTS -->
  ${alerts}

  <!-- SUMMARY -->
  <div class="sl">Resumen Financiero</div>
  <div class="sstrip">
    <div class="si">
      <div class="si-lbl">${isContratoMarco ? 'Valor Anual del Contrato' : 'Inversi&oacute;n'}</div>
      <div class="si-val" style="color:var(--n8)">${fmt(results.investment)}</div>
      <div class="si-sub">${isContratoMarco ? 'Pago recurrente anual' : 'Desembolso inicial'}</div>
    </div>
    <div class="si">
      <div class="si-lbl">Ahorro Anual Estimado</div>
      <div class="si-val" style="color:var(--ok)">${fmt(results.totalSavings)}</div>
      <div class="si-sub">${fmt(results.monthlySavings)} / mes</div>
    </div>
    <div class="si">
      <div class="si-lbl">Valor Actual Neto</div>
      <div class="si-val" style="color:${vanColor}">${fmt(results.van)}</div>
      <div class="si-sub">Descontado al ${discountLabel}% anual</div>
    </div>
  </div>

  <!-- CHARTS -->
  <div class="sl">Visualizaci&oacute;n</div>
  <div class="cgrid">
    <div class="ccard">
      <div class="ch"><h3>Ahorro por Factor</h3><span>${currLabel}</span></div>
      <div class="cw"><canvas id="cf"></canvas></div>
    </div>
    <div class="ccard">
      <div class="ch"><h3>Beneficio Acumulado</h3><span>${currLabel}</span></div>
      <div class="cw"><canvas id="ct"></canvas></div>
    </div>
  </div>

  <!-- FACTORS TABLE -->
  <div class="sl">Detalle de Factores de Ahorro</div>
  <div class="card">
    <table>
      <thead><tr>
        <th style="width:38%">Factor</th>
        <th class="r">Situaci&oacute;n Actual</th>
        <th class="r">Ahorro Anual</th>
        <th class="r" style="width:110px">% del Total</th>
      </tr></thead>
      <tbody>
        ${factorRows}
        <tr class="total-row">
          <td>TOTAL</td>
          <td class="r">—</td>
          <td class="r green">${fmt(results.totalSavings)}</td>
          <td class="r" style="color:var(--n6);font-size:12px">100%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PROJECTION TABLE -->
  <div class="sl">Proyecci&oacute;n Anual</div>
  <div class="card">
    <table>
      <thead><tr>
        <th>A&ntilde;o</th>
        <th class="r">Ahorro Anual</th>
        <th class="r">Beneficio Acumulado</th>
        <th class="r">ROI Acumulado</th>
      </tr></thead>
      <tbody>${projRows}</tbody>
    </table>
  </div>

  <!-- INTERPRETATION -->
  <div class="sl">Gu&iacute;a de Interpretaci&oacute;n</div>
  <div class="card">
    <div class="cardh">
      <button class="itoggle" onclick="toggleI(this)" aria-expanded="true">
        <h3>C&oacute;mo interpretar estos resultados</h3>
        <span class="iicon open" id="iic">&#9660;</span>
      </button>
    </div>
    <div class="cardb" id="ibd">
      <div class="ibody">
        <div class="igrid">
          <div class="iitem"><div class="iicobox">&#128200;</div>
            <div><div class="ilbl">ROI (Retorno de la Inversi&oacute;n)</div>
            <div class="itxt">Cuánto ganas en total frente a lo invertido en ${results.projectionYears || 5} años. Favorable: &gt; 0%. Excelente: &gt; 100%. Si supera ~300%, revisa los datos.</div></div></div>
          <div class="iitem"><div class="iicobox">&#9201;</div>
            <div><div class="ilbl">Payback (Per&iacute;odo de Recuperaci&oacute;n)</div>
            <div class="itxt">Meses para recuperar la inversión. "N/A" indica que los ahorros no cubren el costo en el horizonte analizado.</div></div></div>
          <div class="iitem"><div class="iicobox">&#9878;</div>
            <div><div class="ilbl">Ratio Beneficio/Costo</div>
            <div class="itxt">Pesos de beneficio por cada peso invertido. Favorable: &gt; 1. Muy atractivo: &gt; 2.</div></div></div>
          <div class="iitem"><div class="iicobox">&#128176;</div>
            <div><div class="ilbl">VAN (Valor Actual Neto)</div>
            <div class="itxt">Ahorros futuros traídos a pesos de hoy (descontados al ${discountLabel}% anual) menos la inversión. Favorable cuando es positivo.</div></div></div>
          <div class="iitem"><div class="iicobox">&#128202;</div>
            <div><div class="ilbl">TIR (Tasa Interna de Retorno)</div>
            <div class="itxt">Rentabilidad anual intrínseca. Favorable si supera la tasa de descuento (${discountLabel}%). "N/A" cuando no es calculable matemáticamente.</div></div></div>
          <div class="iitem"><div class="iicobox">&#127919;</div>
            <div><div class="ilbl">Certeza del An&aacute;lisis</div>
            <div class="itxt">Completa más campos para mejorarla. Alta ≥ 80%. Media 50–79%. Baja &lt; 50% — interpreta con cautela.</div></div></div>
        </div>
        <p class="disc">Estimaciones basadas en los datos ingresados y benchmarks de industria (DOE, SMRP, EPRI, McKinsey). Este reporte es orientativo. A-MAQ recomienda evaluar el conjunto de indicadores y la certeza del análisis antes de tomar decisiones de inversión.</p>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="ftr">
    <div class="ftr-l">
      <div class="ftr-mark">A</div>
      <div>
        <div class="ftr-co">A-MAQ S.A.</div>
        <div class="ftr-sub">Mantenimiento Industrial Predictivo</div>
      </div>
    </div>
    <div class="ftr-r">
      <div>Reporte generado el ${today}</div>
      <div>Documento confidencial &mdash; uso exclusivo del cliente</div>
      <div>ROI Calculator A-MAQ &mdash; &copy; ${year}</div>
    </div>
  </div>

</div><!-- /page -->

<script>
(function(){
  var FL = ${factorLabels};
  var FS = ${factorSavings};
  var PL = ${projLabels};
  var PC = ${projCumulative};
  var PA = ${projAnnual};
  var PBI = ${paybackYearIdx};
  var CS = '${currSuffix.replace(/'/g, "\\'")}';

  function fk(v){
    if(v===null||v===undefined)return'N/A';
    var a=Math.abs(v);
    if(a>=1e12)return(v/1e12).toFixed(1)+'T';
    if(a>=1e9) return(v/1e9).toFixed(1)+'G';
    if(a>=1e6) return(v/1e6).toFixed(1)+'M';
    if(a>=1e3) return(v/1e3).toFixed(0)+'K';
    return v.toFixed(0);
  }

  var NAV = ['#003366','#00579B','#0066B3','#3380BF','#27AE60','#1d8a4e','#6699CC','#004080'];

  /* factors chart — horizontal bar */
  var cf = document.getElementById('cf');
  if(cf && FL.length){
    new Chart(cf,{
      type:'bar',
      data:{
        labels:FL,
        datasets:[{
          label:'Ahorro anual',
          data:FS,
          backgroundColor:FS.map(function(_,i){return NAV[i%NAV.length]+'CC';}),
          borderColor:FS.map(function(_,i){return NAV[i%NAV.length];}),
          borderWidth:1.5,
          borderRadius:5,
          borderSkipped:false
        }]
      },
      options:{
        indexAxis:'y',
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          legend:{display:false},
          tooltip:{callbacks:{label:function(c){return' '+new Intl.NumberFormat('es-CO').format(c.raw)+CS;}}}
        },
        scales:{
          x:{grid:{color:'rgba(0,0,0,.06)'},ticks:{color:'#64748B',font:{size:10},callback:function(v){return fk(v);}}},
          y:{grid:{display:false},ticks:{color:'#334155',font:{size:11,weight:'600'},
            callback:function(val){var l=this.getLabelForValue(val);return l.length>20?l.slice(0,20)+'…':l;}
          }}
        }
      }
    });
  }

  /* timeline chart */
  var ct = document.getElementById('ct');
  if(ct && PL.length){
    var ptColors = PC.map(function(v,i){return i===PBI?'#27AE60':v>=0?'#003366':'#C0392B';});
    var ptRadius = PC.map(function(_,i){return i===PBI?8:4;});

    var zeroPlugin = {
      id:'zl',
      beforeDraw:function(chart){
        var y=chart.scales.y;
        if(!y)return;
        var y0=y.getPixelForValue(0);
        if(y0<chart.chartArea.top||y0>chart.chartArea.bottom)return;
        var ctx=chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(chart.chartArea.left,y0);
        ctx.lineTo(chart.chartArea.right,y0);
        ctx.strokeStyle='rgba(192,57,43,.3)';
        ctx.lineWidth=1.5;
        ctx.setLineDash([6,4]);
        ctx.stroke();
        ctx.restore();
      }
    };

    new Chart(ct,{
      type:'line',
      data:{
        labels:PL,
        datasets:[
          {
            label:'Beneficio Acumulado',
            data:PC,
            borderColor:'#003366',
            backgroundColor:'rgba(0,51,102,.07)',
            fill:true,tension:.35,borderWidth:2.5,
            pointBackgroundColor:ptColors,pointBorderColor:ptColors,
            pointRadius:ptRadius,pointHoverRadius:8
          },
          {
            label:'Ahorro Anual',
            data:PA,
            borderColor:'#27AE60',
            backgroundColor:'transparent',
            fill:false,tension:.2,borderWidth:1.5,
            borderDash:[5,4],
            pointBackgroundColor:'#27AE60',pointRadius:4
          }
        ]
      },
      plugins:[zeroPlugin],
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          legend:{display:true,position:'bottom',labels:{font:{size:11},color:'#64748B',usePointStyle:true,pointStyleWidth:12,padding:12}},
          tooltip:{callbacks:{label:function(c){return' '+c.dataset.label+': '+new Intl.NumberFormat('es-CO').format(c.raw)+CS;}}}
        },
        scales:{
          x:{grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#64748B',font:{size:11}}},
          y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#64748B',font:{size:10},callback:function(v){return fk(v);}}}
        }
      }
    });
  }
})();

function toggleI(btn){
  var b=document.getElementById('ibd');
  var ic=document.getElementById('iic');
  var open=b.style.display!=='none';
  b.style.display=open?'none':'block';
  ic.classList.toggle('open',!open);
  btn.setAttribute('aria-expanded',String(!open));
}
</script>
</body>
</html>`
}

async function loadLogoAsBase64() {
  try {
    const { default: logoUrl } = await import('../assets/logo-amaq-white.png')
    const response = await fetch(logoUrl)
    if (!response.ok) return ''
    const blob = await response.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result || '')
      reader.onerror = () => resolve('')
      reader.readAsDataURL(blob)
    })
  } catch {
    return ''
  }
}

export async function downloadHTML(formData, results, filename = 'reporte_roi.html') {
  try {
    const logoDataUrl = await loadLogoAsBase64()
    const html = generateHTML(formData, results, logoDataUrl)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      if (a.parentNode) document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 1000)
  } catch (err) {
    console.error('Error al exportar HTML:', err)
    alert('Ocurrió un error al exportar el HTML. Por favor intente de nuevo.')
  }
}

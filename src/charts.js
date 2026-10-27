import { money,integer,shortDate,percent } from './format.js';
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function lineChart(points,key,id,label,unit,color) {
  if(!points.length)return '<p class="chart-empty">Sem observações neste período.</p>';
  const width=560,height=180,left=54,right=12,top=14,bottom=35;
  const raw=points.map(p=>key==='spendCents'?p[key]/100:p[key]);
  const max=Math.max(...raw,1),ceiling=key==='conversions'?Math.max(1,Math.ceil(max/4)*4):Math.ceil(max/10)*10;
  const x=i=>left+i*(width-left-right)/Math.max(points.length-1,1);
  const y=value=>height-bottom-value/ceiling*(height-top-bottom);
  const path=raw.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  const ticks=[0,.5,1].map(f=>{const v=ceiling*f;return `<line x1="${left}" x2="${width-right}" y1="${y(v)}" y2="${y(v)}" class="grid-line"/><text x="${left-9}" y="${y(v)+4}" text-anchor="end">${integer(v)}</text>`;}).join('');
  const indices=[...new Set([0,Math.floor((points.length-1)/2),points.length-1])];
  return `<svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escapeHtml(label)} (${unit})</title><desc id="${id}-desc">Dados fictícios. ${points.length} dias. Valores exactos na tabela de dados diários.</desc>${ticks}<path d="${path}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>${raw.length===1?`<circle cx="${x(0)}" cy="${y(raw[0])}" r="4" fill="${color}"/>`:''}${indices.map(i=>`<text x="${x(i)}" y="${height-9}" text-anchor="${i===0?'start':i===points.length-1?'end':'middle'}">${shortDate(points[i].date)}</text>`).join('')}</svg>`;
}
export function channelBars(rows) {
  const max=Math.max(1,...rows.map(r=>r.spendCents));
  return rows.map(row=>`<div class="channel-row"><div class="channel-label"><span class="dot" style="--channel:${row.color}"></span>${escapeHtml(row.name)}<span>${money(row.spendCents/100)}</span></div><div class="bar-track"><div class="bar-fill" style="--channel:${row.color};width:${row.spendCents/max*100}%"></div></div><p>${integer(row.clicks)} cliques <span>·</span> ${integer(row.conversions)} conversões</p></div>`).join('');
}
export function distribution(rows) {
  const total=rows.reduce((s,r)=>s+r.spendCents,0);
  if(total===0)return '<p class="chart-empty">Sem investimento para distribuir.</p>';
  return `<div class="distribution-bar" aria-hidden="true">${rows.map(r=>`<span style="background:${r.color};width:${r.spendCents/total*100}%"></span>`).join('')}</div><ul class="distribution-legend">${rows.map(r=>`<li><span class="dot" style="--channel:${r.color}"></span><span>${escapeHtml(r.name)}</span><strong>${percent(r.spendCents/total*100)}</strong></li>`).join('')}</ul><p class="subtle">Percentagem do investimento seleccionado. Os valores podem diferir de 100% por arredondamento.</p>`;
}

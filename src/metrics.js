export const numericKeys = Object.freeze(['spendCents','impressions','clicks','conversions']);
const ratio = (numerator, denominator, factor=1) => denominator === 0 ? null : numerator/denominator*factor;
export function metrics(totals) {
  return { ...totals,
    ctr: ratio(totals.clicks,totals.impressions,100),
    cpc: ratio(totals.spendCents/100,totals.clicks),
    conversionRate: ratio(totals.conversions,totals.clicks,100),
    costPerConversion: ratio(totals.spendCents/100,totals.conversions),
  };
}
export function aggregate(rows) {
  const totals = Object.fromEntries(numericKeys.map(key=>[key,0]));
  for (const row of rows) for (const key of numericKeys) totals[key]+=row[key];
  return metrics(totals);
}
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value+'T00:00:00Z');
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0,10)===value;
}
export function filterError(filters) {
  if (!validDate(filters.start)||!validDate(filters.end)) return 'Indique uma data inicial e uma data final válidas.';
  if (filters.start>filters.end) return 'A data inicial deve ser anterior ou igual à data final.';
  return null;
}
export function validateDataset(campaigns, rows) {
  const ids=new Set(campaigns.map(c=>c.id));
  if (ids.size!==campaigns.length) throw new Error('Campanhas duplicadas.');
  const keys=new Set();
  for (const row of rows) {
    const key=row.date+':'+row.campaignId;
    if (!ids.has(row.campaignId)||!validDate(row.date)||keys.has(key)) throw new Error('Observação inválida ou duplicada.');
    keys.add(key);
    if (numericKeys.some(k=>!Number.isSafeInteger(row[k])||row[k]<0)||row.clicks>row.impressions||row.conversions>row.clicks) throw new Error('Métricas de origem inválidas.');
  }
}
export function selectRows(campaigns, rows, filters) {
  const error=filterError(filters); if (error) throw new Error(error);
  const selected=new Set(campaigns.filter(c=>(filters.channel==='all'||c.channel===filters.channel)&&(filters.campaign==='all'||c.id===filters.campaign)&&(filters.status==='all'||c.status===filters.status)).map(c=>c.id));
  return rows.filter(r=>selected.has(r.campaignId)&&r.date>=filters.start&&r.date<=filters.end);
}
export function campaignSummaries(campaigns, rows) {
  return campaigns.flatMap(c=>{const group=rows.filter(r=>r.campaignId===c.id);return group.length?[{...c,...aggregate(group)}]:[];});
}
export function channelSummaries(channels, rows, campaigns) {
  const map=new Map(campaigns.map(c=>[c.id,c.channel]));
  return channels.map(channel=>({...channel,...aggregate(rows.filter(r=>map.get(r.campaignId)===channel.id))}));
}
export function dailySummaries(rows) {
  return [...new Set(rows.map(r=>r.date))].sort().map(date=>({date,...aggregate(rows.filter(r=>r.date===date))}));
}
const allowedSorts=['name','channel','status','spendCents','impressions','clicks','conversions','ctr','cpc','conversionRate','costPerConversion'];
export function sortCampaigns(rows, key='spendCents', direction='desc') {
  if (!allowedSorts.includes(key)||!['asc','desc'].includes(direction)) throw new Error('Ordenação inválida.');
  return [...rows].sort((a,b)=>{
    if(a[key]===null&&b[key]!==null)return 1;
    if(b[key]===null&&a[key]!==null)return -1;
    const order=typeof a[key]==='string'?a[key].localeCompare(b[key],'pt'):((a[key]??0)-(b[key]??0));
    return (direction==='asc'?order:-order)||a.name.localeCompare(b.name,'pt');
  });
}
export function buildView(campaigns, observations, channels, filters, sort={key:'spendCents',direction:'desc'}) {
  const rows=selectRows(campaigns,observations,filters);
  return {totals:aggregate(rows),campaigns:sortCampaigns(campaignSummaries(campaigns,rows),sort.key,sort.direction),channels:channelSummaries(channels,rows,campaigns),daily:dailySummaries(rows),observationCount:rows.length,empty:rows.length===0};
}

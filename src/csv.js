export function csvCell(value) {
  let text=String(value??'');
  if (typeof value==='string' && (/^[\s\uFEFF]*[=+@-]/.test(text)||/^[\t\r\n]/.test(text))) text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
}
export function exportCsv(rows, filters, channels) {
  const names=new Map(channels.map(c=>[c.id,c.name]));
  const number=value=>value===null?'':value.toFixed(2).replace('.',',');
  const header=['Origem','Início','Fim','Campanha','Canal','Estado','Investimento EUR','Impressões','Cliques','Conversões','CTR %','CPC EUR','Taxa de conversão %','Custo por conversão EUR'];
  const values=rows.map(r=>['Dados fictícios',filters.start,filters.end,r.name,names.get(r.channel)??r.channel,r.status,number(r.spendCents/100),r.impressions,r.clicks,r.conversions,number(r.ctr),number(r.cpc),number(r.conversionRate),number(r.costPerConversion)]);
  return '\uFEFF'+[header,...values].map(row=>row.map(csvCell).join(';')).join('\r\n')+'\r\n';
}

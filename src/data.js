export const channels = Object.freeze([
  { id: 'search', name: 'Pesquisa paga', color: '#6950cf' },
  { id: 'social', name: 'Social pago', color: '#087e8b' },
  { id: 'display', name: 'Display', color: '#c37715' },
]);

export const campaigns = Object.freeze([
  { id: 'c1', name: 'Marca · Sempre presente', channel: 'search', status: 'Activa' },
  { id: 'c2', name: 'Colecção · Intenção de compra', channel: 'search', status: 'Activa' },
  { id: 'c3', name: 'Novidades · Descoberta', channel: 'social', status: 'Activa' },
  { id: 'c4', name: 'Guia · Novos públicos', channel: 'social', status: 'Concluída' },
  { id: 'c5', name: 'Alcance · Contextos relevantes', channel: 'display', status: 'Activa' },
  { id: 'c6', name: 'Teste · Apenas impressões', channel: 'display', status: 'Pausada' },
  { id: 'c7', name: 'Rascunho · Sem actividade', channel: 'social', status: 'Pausada' },
].map(Object.freeze));

// Dados inteiramente sintéticos, determinísticos e locais. Não são resultados históricos.
export const observations = Object.freeze(Array.from({length:30}, (_, day) => {
  const date = `2026-09-${String(day+1).padStart(2,'0')}`;
  return campaigns.map((campaign, index) => {
    if (campaign.id === 'c7') return Object.freeze({date,campaignId:campaign.id,spendCents:0,impressions:0,clicks:0,conversions:0});
    if (campaign.id === 'c6') return Object.freeze({date,campaignId:campaign.id,spendCents:150+day*3,impressions:450+day*5,clicks:0,conversions:0});
    const variation = 80 + ((day*11+index*17)%45);
    const spendCents = Math.round([6900,9200,5900,3800,2700][index]*variation/100);
    const impressions = (index+3)*430 + ((day*173+index*271)%1100);
    const clicks = Math.floor(impressions*([.067,.043,.032,.024,.013][index]) + day%7);
    const conversions = campaign.id === 'c5' ? 0 : Math.floor(clicks*([.086,.061,.046,.039][index]));
    return Object.freeze({date,campaignId:campaign.id,spendCents,impressions,clicks,conversions});
  });
}).flat());

export const defaultFilters = Object.freeze({start:'2026-09-01',end:'2026-09-30',channel:'all',campaign:'all',status:'all'});

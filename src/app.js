import { campaigns,channels,observations,defaultFilters } from './data.js';
import { buildView,filterError,validateDataset } from './metrics.js';
import { exportCsv } from './csv.js';
import { renderDashboard } from './view.js';
import { integer } from './format.js';

const form=document.querySelector('#filters');
const region=document.querySelector('#dashboard');
const errorBox=document.querySelector('#filter-error');
const status=document.querySelector('#view-status');
const exportButton=document.querySelector('#export-csv');
let sort={key:'spendCents',direction:'desc'};
let current=null;
let filters={...defaultFilters};

function updateNavigation(target) {
  for (const link of document.querySelectorAll('[data-section]')) link.setAttribute('href', target ? '#'+target : '#'+link.dataset.section);
}
function update({announce=true}={}) {
  filters=Object.fromEntries(new FormData(form));
  const error=filterError(filters);
  document.querySelector('#start').setAttribute('aria-invalid',String(Boolean(error)));
  document.querySelector('#end').setAttribute('aria-invalid',String(Boolean(error)));
  errorBox.textContent=error??'';
  errorBox.hidden=!error;
  exportButton.disabled=true;
  if(error){updateNavigation('filter-error');current=null;region.hidden=true;status.textContent='Corrija o período para apresentar dados.';return;}
  try {
    current=buildView(campaigns,observations,channels,filters,sort);
    region.innerHTML=renderDashboard(current,filters,sort,channels);
    region.hidden=false;
    updateNavigation(current.empty ? 'empty-title' : null);
    exportButton.disabled=current.empty;
    if(announce)status.textContent=current.empty?'Sem dados para os filtros seleccionados.':`${current.campaigns.length} campanhas. ${integer(current.totals.clicks)} cliques e ${integer(current.totals.conversions)} conversões fictícias. Indicadores, gráficos e tabela actualizados.`;
  } catch {
    updateNavigation('filter-error');current=null;region.hidden=true;errorBox.textContent='Não foi possível preparar os dados locais. Recarregue a página para tentar novamente.';errorBox.hidden=false;
  }
}
function resetFilters(){for(const [key,value] of Object.entries(defaultFilters))form.elements.namedItem(key).value=value;sort={key:'spendCents',direction:'desc'};update();}
form.addEventListener('submit',event=>{event.preventDefault();update();});
form.addEventListener('change',()=>update());
form.addEventListener('reset',event=>{event.preventDefault();resetFilters();});
document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  if(event.target.closest('[data-reset]')){resetFilters();form.elements.namedItem('start').focus();}
  const button=event.target.closest('[data-sort]');
  if(button){const key=button.getAttribute('data-sort');sort={key,direction:sort.key===key ? (sort.direction==='desc'?'asc':'desc') : (['name','channel','status'].includes(key)?'asc':'desc')};update({announce:false});region.querySelector(`[data-sort="${key}"]`).focus();status.textContent=`Tabela ordenada por ${button.textContent.trim()}, ordem ${sort.direction==='asc'?'crescente':'decrescente'}.`;}
  const shortcut=event.target.closest('[data-range]');
  if(shortcut){const ranges={month:['2026-09-01','2026-09-30'],first:['2026-09-01','2026-09-15'],last:['2026-09-24','2026-09-30']};const [start,end]=ranges[shortcut.getAttribute('data-range')];form.elements.namedItem('start').value=start;form.elements.namedItem('end').value=end;update();}
});
exportButton.addEventListener('click',()=>{
  if(!current||current.empty)return;
  let url;
  try{url=URL.createObjectURL(new Blob([exportCsv(current.campaigns,filters,channels)],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`prisma-demonstracao-${filters.start}-${filters.end}.csv`;document.body.append(link);link.click();link.remove();status.textContent='Foi pedido ao navegador para descarregar o CSV filtrado. O ficheiro contém apenas dados fictícios.';}
  catch{status.textContent='Não foi possível iniciar a descarga. Pode consultar os valores nas tabelas.';}
  finally{if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}
});

try {
  validateDataset(campaigns,observations);
  for(const c of channels){const option=document.createElement('option');option.value=c.id;option.textContent=c.name;form.elements.namedItem('channel').append(option);}
  for(const c of campaigns){const option=document.createElement('option');option.value=c.id;option.textContent=c.name;form.elements.namedItem('campaign').append(option);}
  document.querySelector('#boot-note').hidden=true;
  form.hidden=false;
  document.querySelector('#shortcuts').hidden=false;
  resetFilters();
} catch {document.querySelector('#boot-note').textContent='Não foi possível validar o conjunto local de demonstração. Actualize a página para tentar novamente.';}

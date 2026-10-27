const euros=new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2});
const integers=new Intl.NumberFormat('pt-PT',{maximumFractionDigits:0});
const decimals=new Intl.NumberFormat('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2});
export const integer=value=>integers.format(value);
export const money=value=>value===null?'—':euros.format(value);
export const percent=value=>value===null?'—':decimals.format(value)+'%';
export const shortDate=value=>value.slice(8,10)+'/'+value.slice(5,7);
export const displayDate=value=>shortDate(value)+'/'+value.slice(0,4);

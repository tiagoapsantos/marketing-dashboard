# Evidências para estudo de caso futuro / Future case-study evidence

27/10/2026. Documento preparatório, não estudo de caso definitivo. Ver `verification.md` para resultados efectivamente executados.

## PT — Problema, arquitectura e implementação

Transformar um resumo conceptual num dashboard verificável para explorar métricas de marketing. Aplicação independente com dados sintéticos locais, cálculos puros, SVG acessível e interface de filtros. O modelo separa sete campanhas de 210 observações diárias, com investimento em cêntimos. Oito indicadores, taxas sobre totais, denominador zero explícito, duas séries temporais, comparação/distribuição por canal, tabela ordenável e exportação CSV filtrada. Não existem integrações ou resultados profissionais a reivindicar.

## EN — Problem, architecture and implementation

Turn a conceptual summary into a verifiable dashboard for exploring marketing metrics. Standalone app with local synthetic data, pure calculations, accessible SVG charts and filter controls. The model separates seven campaigns from 210 daily observations and stores spend in integer cents. Eight metrics, ratios calculated from totals, explicit zero-denominator handling, two time series, channel comparison/allocation, a sortable table and filtered CSV export. There are no platform integrations or professional campaign results to claim.

## Decisões / Decisions

Zero dependências para manter execução simples; gráficos SVG com tabelas alternativas; dados e cálculos separados da interface; CSV com protecção contra fórmulas. A identidade PRISMA e os dados são fictícios, criados nesta tarefa com assistência de IA. Não representam trabalho comercial anterior. / Zero dependencies for simple execution; SVG charts with tabular alternatives; data and calculations separated from the UI; CSV formula protection. PRISMA and its data are fictional and were created in this task with AI assistance, not as prior client work.

## Material a recolher / Capture plan

- Visão geral desktop e mobile com rótulo de dados fictícios. / Desktop and mobile overview with the synthetic-data notice.
- Canal ou campanha filtrada com métricas e gráficos coerentes. / Filtered channel/campaign with consistent metrics and charts.
- Estado vazio, caso sem actividade e erro de datas. / Empty state, zero-activity case and invalid date range.
- Ordenação e CSV real de uma selecção fictícia. / Sorting and a real CSV download from a synthetic selection.

## Limites / Limits

Sem dados reais, plataformas, atribuição real, receita ou métricas de negócio a apresentar como evidência de desempenho. Resultados de testes técnicos não equivalem a resultados de marketing. / No real data, platforms, production attribution, revenue or business metrics to use as performance evidence. Technical test results are not marketing outcomes.

## Resultados técnicos confirmados / Verified technical outcomes

PT: build e sintaxe aprovados; 19 testes automatizados aprovados. Filtros, ordenação, CSV real, datas inválidas, ausência de dados e actividade zero foram verificados no browser. Responsividade medida a 320, 390, 768 e 1440 píxeis sem deslocamento horizontal da página. Sem erros de consola observados. A tabela tem deslocamento próprio e alternativa diária aos gráficos. Os testes não demonstram resultados comerciais ou conformidade integral de acessibilidade.

EN: production build and syntax checks passed, with 19 automated tests passing. Filters, sorting, an actual CSV download, invalid dates, empty selections and zero activity were checked in the browser. Layout widths of 320, 390, 768 and 1440 pixels were measured without page-level horizontal overflow. No console errors were observed. Tables scroll independently and daily values provide an alternative to the charts. These checks do not establish business results or complete accessibility compliance.

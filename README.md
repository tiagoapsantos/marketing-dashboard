# PRISMA — Marketing Dashboard

Aplicação local demonstrativa e independente do portfolio e do Business Website. **Todos os dados são fictícios**, construídos para testar a interface e os cálculos. Não há campanhas reais, integrações, contas ligadas, resultados profissionais, receita ou prova de desempenho comercial.

## Repositório e publicação

- Repositório destinado à publicação: https://github.com/tiagoapsantos/marketing-dashboard
- Endereço previsto da demonstração: https://tiagoapsantos.github.io/marketing-dashboard/
- Um único workflow, `.github/workflows/deploy.yml`, executa sintaxe, os 19 testes e build com BASE_PATH=/marketing-dashboard/ em push para main. Só o conteúdo de dist é publicado, por acções oficiais do Pages. Não são instaladas dependências.
- O job de build tem apenas leitura de conteúdo. O deploy usa pages: write e id-token: write, no ambiente github-pages.
- Execuções e resultado efectivo: https://github.com/tiagoapsantos/marketing-dashboard/actions

## Auditoria, hipóteses e produto

O conceito do portfolio apenas descrevia a organização de métricas e tarefas de marketing, sem público-alvo, modelo, código ou cálculos definidos. Foram lidos os dois resumos e a auditoria. Não foi encontrado código do Marketing Dashboard entre as pastas de projectos directamente acessíveis nem numa pesquisa de pastas com nomes marketing/dashboard/painel até dois níveis em Desktop, Documents e OneDrive. Isto não equivale a pesquisar todo o disco.

Decisões assumidas a partir do pedido actual: ferramenta PT-PT para um profissional de marketing explorar investimento e conversões, sete campanhas, três canais genéricos, observações diárias de Setembro de 2026, EUR e estado fixo por campanha. Não se implementa gestão de tarefas: esse tema do resumo original fica fora do âmbito analítico agora pedido.

**Critérios de aceitação:** indicadores, gráficos, canais e campanhas usam exactamente a mesma selecção; taxas ponderadas pelos totais; zero não produz NaN ou Infinity; datas inválidas mostram erro e impedem exportação; selecção sem observações mostra estado vazio; actividade zero mantém métricas com zero e taxas não calculáveis; tabela ordenável e CSV coincidente; gráficos com unidades e alternativa tabular; teclado, foco e layout verificados; testes e build aprovados.

## Indicadores e dados

| Indicador | Definição |
| --- | --- |
| Investimento | Soma de `spendCents` / 100, em EUR |
| Impressões, cliques e conversões | Soma das respectivas contagens |
| CTR | Cliques / impressões × 100 |
| CPC | Investimento em EUR / cliques |
| Taxa de conversão | Conversões / cliques × 100 |
| Custo por conversão | Investimento em EUR / conversões |

Com denominador zero, o cálculo devolve `null` e a interface apresenta “—”. Numerador zero com denominador válido produz zero. Os agregados são calculados **depois de somar** valores absolutos, sem fazer média das taxas individuais. O arredondamento é apenas de apresentação/exportação; investimento de origem é inteiro em cêntimos.

`src/data.js` contém metadados de campanhas (`id`, `name`, `channel`, `status`) e 210 observações (`date`, `campaignId`, `spendCents`, `impressions`, `clicks`, `conversions`). São 30 dias × 7 campanhas e três canais: pesquisa paga, social pago e display. A geração é determinística, sem aleatoriedade ou fonte externa. Há campanhas activas, pausadas e concluídas; o estado é fixo no cenário, não um histórico de estados.

Uma campanha tem apenas impressões e investimento; outra tem observações completamente a zero; uma campanha display tem cliques sem conversões. Estes casos verificam denominadores zero. Períodos fora de Setembro ou filtros incompatíveis produzem ausência de observações. Dias não observados não são inventados como actividade zero nos gráficos. Conversão é uma acção fictícia atribuída ao mesmo dia/campanha, não uma definição universal de publicidade: não se modelam atribuição, pessoas únicas, deduplicação ou conversões entre dispositivos.

## Funcionalidades

- Oito indicadores e duas séries temporais SVG com escalas independentes (EUR/dia e conversões/dia).
- Comparação por canal e distribuição percentual do investimento, com valores textuais e tabela diária alternativa aos gráficos.
- Filtros por datas inclusivas, canal, campanha e estado; atalhos de período e reposição. As escolhas intersectam-se; uma combinação incompatível apresenta estado vazio, sem alterar silenciosamente outros filtros.
- Tabela de campanhas com todas as métricas, ordenação por 11 colunas, indicação `aria-sort`, ordem estável e nulos no fim em ambas as direcções. Sem paginação/pesquisa: existem apenas sete campanhas.
- CSV das campanhas filtradas, na ordem visível, com período e rótulo de dados fictícios em cada linha. UTF-8 com BOM, ponto e vírgula, decimais com vírgula, campos delimitados por aspas e neutralização de textos que possam ser fórmulas. Não é uma integração. Sem dados ou intervalo válido, a exportação está desactivada.
- Mensagens de estado acessíveis, erros de período e inicialização, foco visível, região de tabela com deslocamento horizontal e redução de movimento.

## Stack e estrutura

HTML, CSS e JavaScript ES modules, sem framework, biblioteca de gráficos ou dependências npm. Os SVG são gerados a partir de valores locais validados e usam títulos, descrições e alternativa tabular. Node nativo serve o preview, copia a saída de produção e executa testes. A separação em funções puras/testes é suficiente para este âmbito; não se adicionou compilador TypeScript. Não são necessárias fontes, imagens, credenciais ou serviços externos.

- `src/data.js`: cenário sintético e valores iniciais.
- `src/metrics.js`: integridade, datas, filtros, agregação, séries e ordenação, sem DOM.
- `src/format.js`: formatação pt-PT.
- `src/csv.js`: exportação e neutralização de fórmulas.
- `src/charts.js`: gráficos SVG e barras; `src/view.js`: apresentação comum das métricas, tabela e estados.
- `src/app.js`: eventos, filtros, estado da ordenação e download.
- `src/index.html` e `src/styles.css`: estrutura acessível e identidade própria do dashboard.
- `scripts/`: build, sintaxe e servidor estático local.
- `tests/`: cálculos, dados, coerência das vistas, CSV, formatação e servidor.
- `docs/verification.md`: resultados realmente executados; `docs/evidence-for-portfolio.md`: factos PT/EN preparatórios.

## Executar, testar e gerar

Requisitos: Node.js 22+ e npm. Desenvolvido com Node 24. Não precisa de conta, Internet, `npm install` ou chaves.

```powershell
cd 'caminho/para/marketing-dashboard'
npm.cmd run dev
```

Abrir http://127.0.0.1:4174/. `dev` executa o build antes de servir; não há hot reload. Após editar, repetir o build e actualizar o browser.

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

Os testes geram builds isolados em pastas temporárias e não dependem de dist. O preview requer um build prévio. Saída: `dist`. O servidor ouve apenas em 127.0.0.1; Ctrl+C termina-o. Para outra porta: `$env:PORT = '4175'` e depois `npm.cmd run preview`.

## Limites e futuro

Só dados locais fictícios; sem importação, edição, backend, persistência, recolha de dados pessoais ou chamadas de rede. Os filtros são temporários e repostos ao recarregar. Não há sincronização, login, tarefas, tradução EN da interface, atribuição de publicidade, ROAS ou resultados comerciais. A preparação é síncrona: não se simula um carregamento remoto.

O HTML de apresentação escapa texto e usa apenas dados conhecidos; a CSP bloqueia ligações de dados e submissões. `style-src` permite estilos inline para as larguras/cor das barras calculadas; scripts inline continuam bloqueados. Estes controlos não são uma auditoria de segurança completa. Uma futura importação exigiria validação de schema e revisão de segurança. Os testes de acessibilidade básica não substituem ensaios com leitores de ecrã/utilizadores.

Possíveis próximos passos **não implementados**: importação de ficheiro validado, comparação com período anterior, tradução EN e ensaios de acessibilidade. Não se justifica ligar plataformas reais nesta fase. A fase de preparação não incluiu Git ou publicação. A publicação agora autorizada está configurada no workflow acima. O portfolio e o Business Website foram preservados.

## Build para GitHub Pages

O build está preparado para a subpasta `/marketing-dashboard/`. Usar o mesmo BASE_PATH no build e no preview:

```powershell
$env:BASE_PATH = '/marketing-dashboard/'
npm.cmd run check
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

Abrir http://127.0.0.1:4174/marketing-dashboard/. PORT continua configurável se a porta estiver ocupada. O prefixo por omissão é `/`; para voltar à raiz em comandos seguintes, remover a variável BASE_PATH. São aceites apenas segmentos locais com letras ASCII, números, hífen ou underscore; URLs, queries, fragmentos e travessias são rejeitados. Mudar o nome da futura subpasta exige regenerar o build.

A saída de produção é **o conteúdo de dist**, sem criar outra pasta marketing-dashboard dentro dela: index.html, 404.html, sete módulos JavaScript, styles.css, favicon.svg e .nojekyll (12 ficheiros). Node é usado para build, preview e testes; não existe servidor Node necessário em produção. Os imports entre módulos continuam relativos. As âncoras internas mantêm-se na página. A 404 usa caminhos prefixados, incluindo quando apresentada num endereço inexistente profundo.

A política CSP acompanha os HTML estáticos, incluindo o bloqueio de ligações de dados e submissões. A permissão de estilos inline necessária às barras mantém-se; scripts inline não são permitidos. Os cabeçalhos exclusivos do servidor local, como frame-ancestors, não são transportados por ficheiros estáticos.

O build não apaga ficheiros adicionais em dist; a saída deve ser revista antes de qualquer publicação futura, preferencialmente gerada num ambiente limpo. Na fase inicial de preparação não houve operações GitHub ou publicação. O workflow actual e os destinos estão indicados na secção de publicação; o seu resultado deve ser confirmado no GitHub Actions antes de se considerar a demonstração disponível.

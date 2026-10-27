# Verificação do Marketing Dashboard

Data: 27/10/2026. Ambiente: Windows, Node.js 24.22.1. Aplicação independente em C:\Users\Tiago\marketing-dashboard. Todos os dados usados são fictícios.

## Comandos executados

- `npm.cmd run check`: aprovado, sintaxe dos módulos verificada.
- `npm.cmd run build`: aprovado, dashboard estático, módulos, CSS, favicon e página 404 em `dist`.
- `npm.cmd test`: 19 testes aprovados, zero falhas. Repetidos depois dos ajustes de legibilidade, ordenação textual e navegação dos estados vazio/erro.
- `npm.cmd run preview`: executado em http://127.0.0.1:4174/ durante QA. O servidor de QA foi terminado no final; executar `npm.cmd run dev` para nova revisão. Não é um deploy.

## Testes automatizados

1. Fórmulas exactas de CTR, CPC, taxa de conversão e custo por conversão.
2. Denominadores zero devolvem null; numerador zero com denominador válido devolve zero.
3. Agregação por totais, sem média de taxas.
4. Integridade e duplicados: 7 campanhas, 210 observações, 30 dias, contagens e custos válidos.
5. Datas reais, intervalo inválido e extremos inclusivos.
6. Intersecção dos filtros de canal, campanha e estado.
7. Coerência dos totais de cartões, canais, séries e campanhas após filtrar.
8. Distinção entre ausência de observações e observações com actividade zero.
9. Caso só com impressões e sem cliques/conversões.
10. Ordenação numérica, textual e nulos no fim, sem alterar os dados originais.
11. Servidor: dashboard e módulos com MIME correcto.
12. Servidor: 404, bloqueio de caminho fora de dist, HEAD e recusa de POST.
13. Labels e estados acessíveis no HTML; ausência de envio e persistência no código do cliente.
14. Formatação pt-PT, duas casas decimais e ausência de NaN/Infinity nos casos verificados.
15. CSV: cabeçalhos, período, selecção, ordem e total de investimento.
16. CSV: aspas, separadores, novas linhas e neutralização de fórmulas, incluindo prefixos de espaços/BOM.
17. HTML de cartões, gráficos e tabela reage à mesma selecção.
18. Estado vazio sem cartões, gráficos ou tabelas com valores antigos.
19. Gráfico com um ponto/zeros finito e escape de texto em SVG/HTML.

## Verificações efectivamente executadas no browser

| Caso | Resultado observado |
| --- | --- |
| Arranque | Oito indicadores, dois gráficos temporais e sete campanhas apresentados; aviso de dados fictícios visível |
| Filtro Pesquisa paga | Reduziu para duas campanhas; cartões, trajectos SVG e tabela mudaram |
| Últimos sete dias + Pesquisa paga | Período 24–30/09/2026; sete linhas diárias; investimento fictício 1139,65 EUR e 112 conversões, coerentes com o CSV verificado |
| Ordenação | Campanha em ordem crescente e decrescente; linhas e aria-sort actualizados; foco mantido no botão do cabeçalho |
| Exportação | Download real observado e ficheiro lido: UTF-8/BOM, 14 cabeçalhos, duas campanhas, datas/canal/ordem seleccionados e totais correctos. Não houve integração externa |
| Filtros incompatíveis | Pesquisa paga + campanha Display: estado vazio; zero gráficos/cartões; CSV desactivado |
| Período sem dados | Agosto de 2026: estado vazio visível em mobile, sem métricas antigas |
| Repor filtros | Datas, canal, campanha, estado e ordenação regressaram aos valores iniciais; sete campanhas; reposição a partir do estado vazio colocou foco no início dos filtros |
| Campanha sem actividade | Valores absolutos zero e taxas “—”; gráficos finitos; distribuição mostrou ausência de investimento. Não foi confundida com ausência de observações |
| Campanha só com impressões | CTR 0,00%; CPC, taxa de conversão e custo por conversão “—”; investimento e impressões mantidos |
| Estado Pausada | Mostrou as duas campanhas classificadas como pausadas no conjunto fictício |
| Datas invertidas | Erro visível e aria-invalid nas datas; dashboard escondido e CSV desactivado; reposição recuperou o estado válido |
| Navegação em estados vazio/erro | Ligações das secções apontaram para o estado relevante, sem âncoras em falta |
| Dados diários | Alternativa tabular abriu e mostrou 30 linhas no período completo |
| Teclado | Skip link visível por Tab e activado por Enter; foco visível; região da tabela deslocou-se com ArrowRight |
| Responsividade | 320, 390, 768 e 1440 píxeis verificados; a largura do documento não excedeu a viewport. A tabela pode deslocar-se dentro da própria região |
| Inspecção visual | Vista desktop, mobile, gráficos, tabela e estado vazio revistos |
| Consola | Não foram observados avisos ou erros nos registos consultados durante QA |

## Contraste, segurança e limites da verificação

Cálculo das combinações principais do CSS: texto/fundo 13,21:1; texto secundário/branco 5,50:1; botão 6,56:1; navegação 9,99:1; aviso 6,06:1; estado activo 6,22:1; estado pausado 5,74:1; estado concluído 5,86:1; linha roxa/branco 5,75:1; linha teal/branco 4,81:1; barra Display/branco 3,52:1. Foi aplicado o limiar 4,5:1 para texto e 3:1 para a barra sem texto. Não constitui auditoria completa de todas as cores/estados ou de acessibilidade.

Não foram instalados axe, Playwright ou outras dependências. Não há suite automatizada de browser: a execução de interacções foi feita através das ferramentas de browser disponíveis. Não foram testados leitores de ecrã, utilizadores reais, todos os browsers/dispositivos, falha simulada de download, importação de dados ou JavaScript desactivado. O tratamento de erro de inicialização foi inspeccionado no código, não provocado num browser. Sem backend ou plataforma real, não existem testes de integrações, atribuição de publicidade ou resultados comerciais a reivindicar.

O código foi revisto quanto a chamadas de rede, armazenamento e credenciais; usa dados locais, sem tokens ou dados pessoais. Os estilos inline das barras são permitidos na CSP; scripts inline e ligações de dados continuam bloqueados. Não é uma auditoria de segurança completa. Os cálculos só foram validados contra as definições explícitas deste modelo fictício, não contra plataformas de publicidade.

## Preservação e Git

Portfolio: comparação SHA-256 dos 39 ficheiros de trabalho, excluindo dependências, controlo Git e saídas geradas; estado Git comparado com o início. Business Website: comparação dos 27 ficheiros existentes, incluindo dist. Ambos permaneceram inalterados. Nenhum Git foi inicializado no Marketing Dashboard. Não houve instalação de dependências, criação de repositório GitHub, commit, push ou deploy.

## Preparação estática sob /marketing-dashboard/ — 27/10/2026

- Alterados apenas build, preview, configuração estática partilhada, testes de servidor e documentação. Nenhum ficheiro de src foi alterado: indicadores, dados fictícios, filtros, gráficos, ordenação e CSV mantêm a implementação existente.
- BASE_PATH reescreve os URLs locais no HTML gerado e na 404; imports ES relativos preservados. Acrescentados .nojekyll e CSP nos HTML, mantendo style-src com estilos inline para as barras.
- `npm run check`, build com BASE_PATH=/marketing-dashboard/ e os **19 testes existentes** passaram. Os três testes de servidor foram alargados para builds isolados na raiz e numa subpasta física, incluindo módulos/imports/MIME, recursos, 404 profunda e prefixos inválidos. A recusa de caminhos aceita 403/404 conforme o sistema operativo, verificando também a não exposição do ficheiro.
- Build final: 12 ficheiros, incluindo index.html, 404.html, sete módulos, CSS, favicon e .nojekyll. Nenhum ficheiro do servidor ou documentação entra em dist.
- Browser servido em /marketing-dashboard/: oito indicadores e sete campanhas no arranque; navegação para Evolução e Campanhas manteve a subpasta; filtros Pesquisa paga + Últimos 7 dias produziram 1139,65 EUR e 112 conversões; ordenação por campanha crescente/decrescente actualizou linhas e aria-sort.
- Download real lido: CSV UTF-8 com BOM, 14 colunas, duas campanhas de Pesquisa paga, período 24–30/09/2026, ordem coincidente com a tabela, investimento 494,73 + 644,92 EUR e conversões 73 + 39. Linhas identificadas como Dados fictícios.
- Campanha incompatível com canal: estado vazio sem indicadores antigos, exportação desactivada e âncoras válidas. Datas invertidas: erro visível, dashboard escondido e exportação desactivada. Reposição e refresh recuperaram os oito indicadores e sete campanhas. Barras com os estilos calculados presentes; sem avisos/erros de consola nas verificações observadas.
- Verificação HTTP da subpasta física feita sem reescritas específicas do dashboard. No browser foi usado o preview local com o mesmo prefixo. Não houve verificação no domínio público, publicação, instalação de dependências ou acesso ao GitHub; não se afirma funcionamento de uma implantação ainda inexistente. Outros browsers, leitores de ecrã e uma nova revisão mobile não foram testados nesta alteração; estilos e código do cliente não mudaram.
- O build final está preparado para alojamento estático no GitHub Pages, mas o nome/prefixo e o artefacto deverão ser confirmados numa futura publicação autorizada. Sem bloqueio técnico conhecido nas verificações efectuadas.

## Publicação autorizada no GitHub Pages

Após a preparação local, foi autorizada a criação do repositório público independente tiagoapsantos/marketing-dashboard. O único workflow em .github/workflows/deploy.yml verifica sintaxe, executa os 19 testes, gera o build com BASE_PATH=/marketing-dashboard/ e publica exclusivamente dist através das acções oficiais. Não há instalação de dependências ou alterações do código funcional. As referências acima a ausência de Git/publicação descrevem as fases anteriores. O resultado do deploy e das verificações online será confirmado no GitHub Actions e no relatório final do chat.

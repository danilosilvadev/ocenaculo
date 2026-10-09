# O Cenáculo

Os clássicos anotados à margem. O livro corre na página, em tipografia de volume impresso; a leitura fica na margem, presa ao texto por sublinhados, círculos, colchetes e setas, como lápis de vinho num exemplar de papel.

O primeiro volume é *O Idiota*, de Dostoiévski. A tradução para o português do Brasil é do Cenáculo, feita a partir do original russo em domínio público. Não se usa nenhuma tradução publicada.

## O que está na página

- Parte I, capítulo I (o vagão), traduzido e anotado frase a frase.
- Os outros capítulos aparecem na navegação como «em breve».
- Cada parágrafo pode mostrar o russo da edição citada.
- No telefone o texto ocupa a largura; o toque numa marca abre a nota num painel inferior.

## Edição russa

F. M. Dostoiévski, *Идиот*, in *Собрание сочинений в 15 томах*, т. 6. Leningrado: Nauka, filial de Leningrado, 1989, pp. 5–616.

Publicação eletrônica: [Русская виртуальная библиотека](https://rvb.ru/dostoevski/01text/vol6/28.htm), versão 3.0, de 27 de janeiro de 2017.

- Capítulo I, o vagão: [28-01.htm](https://rvb.ru/dostoevski/01text/vol6/28-01.htm)

O russo no site é o dessa edição, com os parágrafos partidos por número de página reunidos de novo.

## Como rodar

```bash
npm install
npm run dev
```

O servidor de desenvolvimento sobe em [http://127.0.0.1:43123/ocenaculo/](http://127.0.0.1:43123/ocenaculo/). As rotas usam hash (`/#/livro/o-idiota`), para o site estático funcionar no GitHub Pages sob o caminho `/ocenaculo/`.

```bash
npm test
npm run build
npm run preview
```

`VITE_BASE` define o caminho base (o padrão é `/ocenaculo/`). O build copia `dist/index.html` para `dist/404.html`, que é o fallback do GitHub Pages.

## Anotações e o editor

O texto do capítulo I está em `src/content/o-idiota/parte-1-capitulo-1.text.json`. As marcas ficam em `public/data/o-idiota/parte-1-capitulo-1.annotations.json` e o leitor busca esse arquivo em tempo de execução (`/ocenaculo/data/o-idiota/parte-1-capitulo-1.annotations.json`). Se o pedido falhar, a página usa a cópia que entrou no build.

Cada anotação tem `id`, `anchor` (`paragraphId`, `start`, `end`, `quote`), `mark` (`sublinhado`, `circulo`, `colchete`, `realce`, `traco`, `seta`), `note`, `expanded`, `russian` opcional e `order`. O `quote` serve para reencontrar o trecho se os deslocamentos mudarem.

O editor fica em `#/editor`. Não entra no menu; o rodapé tem o atalho «Editar a margem». O leitor público continua só de leitura. O rascunho grava sozinho em `localStorage` (`ocenaculo.draft.parte-1-capitulo-1`) e não aparece no leitor público. Na barra: Exportar JSON, Importar JSON, Descartar rascunho, Publicar no GitHub.

## Publicar no GitHub

O site no ar é o branch `gh-pages`, com o `dist` já construído. Por isso publicar não dispara um build: grava o mesmo JSON em dois lugares, pela API de conteúdos do GitHub (GET do `sha`, depois PUT).

- Branch `main`, caminho `public/data/o-idiota/parte-1-capitulo-1.annotations.json` — a fonte do próximo build.
- Branch `gh-pages`, caminho `data/o-idiota/parte-1-capitulo-1.annotations.json` — o arquivo que a página já publicada busca.

O token é fino, só com Contents de leitura e escrita em `danilosilvadev/ocenaculo`. O editor pede uma vez e guarda apenas em `localStorage` (`ocenaculo.github.token`). «Esquecer token» apaga essa chave. Um 401 mostra que o token foi recusado e não grava nada. Um 409 (o `sha` mudou) pede confirmação: «Publicar por cima» lê o `sha` de novo e grava o rascunho por cima.

Para servir na raiz de um domínio local:

```bash
VITE_BASE=/ npm run dev
```

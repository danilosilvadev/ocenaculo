# O Cenáculo

Primeiros capítulos, anotados à margem. O texto corre na coluna da esquerda; a leitura fica na direita, presa por sublinhado, círculo, colchete, realce, traço e seta, como lápis de vinho num exemplar de papel. Um alfinete de mapa abre o lugar da frase. Um esquema fechado, «Esquema: …», abre um diagrama quando a frase pede.

Cada livro entra só com a abertura. O resto fica na edição pública citada no fim do capítulo.

## Os quatro

- **O Idiota**, Dostoiévski, 1868–69. Parte I, capítulo I, o vagão da estrada Petersburgo–Varsóvia. Tradução do Cenáculo a partir do russo. A margem mostra o original.
- **Frankenstein**, Mary Shelley, 1818. A Carta I, não o capítulo de Victor: as cartas de Walton são o começo verdadeiro do livro de 1818. Tradução do Cenáculo a partir do inglês. A margem mostra o original.
- **Memórias Póstumas de Brás Cubas**, Machado de Assis, 1881. Dedicatória, «Ao leitor» e capítulo I, «Óbito do autor». O texto é o português da edição, sem tradução.
- **Vidas Secas**, Graciliano Ramos, 1938. Capítulo «Mudança». Português da 2ª edição (1947), a transcrição pública que dá para conferir. Sem tradução.

## Edições

**O Idiota.** F. M. Dostoiévski, *Идиот*, in *Собрание сочинений в 15 томах*, т. 6. Leningrado: Nauka, filial de Leningrado, 1989, pp. 5–616. Eletrônico: [Русская виртуальная библиотека](https://rvb.ru/dostoevski/01text/vol6/28.htm), versão 3.0, 27 de janeiro de 2017. Capítulo I: [28-01.htm](https://rvb.ru/dostoevski/01text/vol6/28-01.htm).

**Frankenstein.** Mary Wollstonecraft Shelley, *Frankenstein; or, The Modern Prometheus*. Londres: Lackington, Hughes, Harding, Mavor & Jones, 1818. Usamos o texto de 1818 (Project Gutenberg, eBook [41445](https://www.gutenberg.org/ebooks/41445)), não o de 1831: a revisão de 1831 reescreve passagens das cartas e acrescenta a introdução. A tradução portuguesa é do Cenáculo. Não se usa tradução publicada.

**Brás Cubas.** Machado de Assis, *Memorias Posthumas de Braz Cubas*. Rio de Janeiro: Typographia Nacional, 1881. Texto da [Wikisource](https://pt.wikisource.org/wiki/Memórias_Póstumas_de_Brás_Cubas), com a grafia dessa edição (Catumby, melancholia, escripto). Dedicatória e «Ao leitor» (pp. v–vi), capítulo I (pp. 9–12).

**Vidas Secas.** Graciliano Ramos, *Vidas Sêcas*, 2ª ed. São Paulo: Livraria José Olympio, 1947, pp. 7–17 (capítulo «Mudança»). A primeira edição é do Rio, José Olympio, 1938. A transcrição está na [Wikisource](https://pt.wikisource.org/wiki/Vidas_Sêcas/Mudança), grafia da impressão de 1947 (juàzeiros, sêca, bôca). Palavra partida por número de página foi reunida («roupa», «pouco»). Graciliano morre em 1953; no Brasil a obra entra em domínio público em 1º de janeiro de 2024 (Lei 9.610/98). Noutros países o prazo pode ser outro.

Nada do texto da esquerda foi inventado ou parafraseado.

## Como rodar

```bash
npm install
npm run dev
```

O servidor sobe em [http://127.0.0.1:43123/ocenaculo/](http://127.0.0.1:43123/ocenaculo/). As rotas usam hash (`/#/livro/o-idiota`), para o site estático no GitHub Pages sob `/ocenaculo/`.

```bash
npm test
npm run build
npm run preview
```

`VITE_BASE` define o caminho base (o padrão é `/ocenaculo/`). O build copia `dist/index.html` para `dist/404.html`.

## Anotações

O texto de cada abertura está em `src/content/<livro>/<capítulo>.text.json`. As marcas, os lugares e os esquemas estão em `public/data/<livro>/<capítulo>.annotations.json`. O leitor busca esse JSON em tempo de execução. Se o pedido falhar, usa a cópia do build.

Cada anotação tem `id`, `anchor` (`paragraphId`, `start`, `end`, `quote`), `mark` (`sublinhado`, `circulo`, `colchete`, `realce`, `traco`, `seta`, `lugar`), `note`, `expanded`, `order`. `lugar` exige `place` (`lat`, `lng`, `label`). `gloss` (ou o campo antigo `russian`) é uma nota da língua original, quando há. Os esquemas ficam em `widgets`: `title`, `paragraphId`, `text` e `diagram` (`boxes`, `arrows`).

O mapa usa `public/maps/countries-50m.json` (Natural Earth, via world-atlas), `brazil-states.json` e `sao-francisco.json`, no próprio site, sem pedido externo. Os rótulos se afastam quando colidem. O minimapa de um lugar mostra costa, uma cidade de referência e, quando a região é aproximada, uma mancha em vez de um ponto.

## Editor

`#/editor` e `#/editor/<livro>`. O atalho «Editar a margem» está no rodapé. Dá para trocar de livro na barra. O rascunho grava em `localStorage` (`ocenaculo.draft.<capítulo>`) e não aparece no leitor público. Selecionar texto cria marca; clicar numa marca edita. Lugar pede latitude, longitude e nome. O esquema abre um painel com título, parágrafo, texto e o JSON do diagrama.

Publicar grava o mesmo JSON em dois ramos, pela API de conteúdos (GET do `sha`, depois PUT):

- `main`: `public/data/<livro>/<capítulo>.annotations.json`
- `gh-pages`: `data/<livro>/<capítulo>.annotations.json`

O token é fino, só Contents de leitura e escrita em `danilosilvadev/ocenaculo`, guardado em `ocenaculo.github.token`. 401 não grava. 409 pede «Publicar por cima».

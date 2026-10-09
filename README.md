# O Cenáculo

Os clássicos anotados à margem. O livro corre na página, em tipografia de volume impresso; a leitura fica na margem, presa ao texto por sublinhados, círculos, colchetes e setas, como lápis de vinho num exemplar de papel.

O primeiro volume é *O Idiota*, de Dostoiévski. A tradução para o português do Brasil é do Cenáculo, feita a partir do original russo em domínio público. Não se usa nenhuma tradução publicada.

## O que está na página

- Parte I, capítulo I (o vagão) e capítulo II (a antecâmara), traduzidos e anotados frase a frase.
- Os capítulos seguintes da parte I aparecem na navegação como «em breve».
- Cada parágrafo pode mostrar o russo da edição citada.
- No telefone o texto ocupa a largura; o toque numa marca abre a nota num painel inferior.

## Edição russa

F. M. Dostoiévski, *Идиот*, in *Собрание сочинений в 15 томах*, т. 6. Leningrado: Nauka, filial de Leningrado, 1989, pp. 5–616.

Publicação eletrônica: [Русская виртуальная библиотека](https://rvb.ru/dostoevski/01text/vol6/28.htm), versão 3.0, de 27 de janeiro de 2017.

- Capítulo I: [28-01.htm](https://rvb.ru/dostoevski/01text/vol6/28-01.htm)
- Capítulo II: [28-02.htm](https://rvb.ru/dostoevski/01text/vol6/28-02.htm)

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

Para servir na raiz de um domínio local:

```bash
VITE_BASE=/ npm run dev
```

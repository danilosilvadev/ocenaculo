import type { MarkKind, SentenceNote } from "../types";

function n(mark: MarkKind, m: string, x: string): SentenceNote {
  return { mark, m, x };
}

/** Notas das frases que vinham coladas à anterior. A primeira de cada trecho já está no capítulo. */
export const sentenceNotes: Record<string, SentenceNote[]> = {
  p5: [
    n(
      "underline",
      "O frio responde pela geada.",
      "O condicional «que seria» desaba no indicativo. «Não imaginava» confessa o estrangeiro antes do nome: a Rússia entra pela pele. «Tanto frio» mede a volta inteira.",
    ),
  ],
  p10: [
    n(
      "circle",
      "A negativa é a piada.",
      "A pergunta «curaram?» só existe para esta resposta dobrada: «não, não curaram». A repetição é o riso do moreno e o diagnóstico do romance. A cura falhou, e o fracasso é dito duas vezes, com prazer.",
    ),
  ],
  p12: [
    n(
      "sideline",
      "O corpo entra antes do nome.",
      "O travessão abre um retrato de ofício: mal vestido, escrevente, quarenta anos, nariz vermelho, espinhas. Liébedev chega como tipo, não como pessoa. O narrador o encarquilha na sintaxe antes de lhe dar voz.",
    ),
  ],
  p14: [
    n(
      "underline",
      "O verbo não olha para ele.",
      "«Perguntou o moreno» chega depois da pergunta já feita. O verbo de dizer não nomeia o ouvinte: Rogójin pergunta ao ar, e o príncipe é quem tem de se reconhecer na conta. A cortesia ainda não existe.",
    ),
  ],
  p15: [
    n(
      "highlight",
      "«Assim» resume uma vida.",
      "Depois da carta sem resposta, uma frase curta fecha a biografia: «E foi assim que vim». O advérbio engole morte, Suíça e silêncio. A chegada não tem plano; tem um resumo.",
    ),
  ],
  p17: [
    n(
      "circle",
      "As reticências são o endereço.",
      "«Ainda não sei, palavra... assim...» não completa o plano. A palavra de honra ocupa o lugar da pensão. As reticências são o quarto que ele não tem. O futuro cabe num gesto vago.",
    ),
  ],
  p20: [
    n(
      "underline",
      "A pergunta já é o veredito.",
      "«Perguntou o moreno» confirma o que o tom já fez: a aposta não espera resposta. O verbo chega tarde, como quem já abriu o fardel com os olhos. O fardo é a pessoa.",
    ),
  ],
  p23: [
    n(
      "sideline",
      "O insulto hesita de propósito.",
      "«Coisa muito, muito própria de um homem, digamos...» alonga o advérbio para adiar o golpe. A repetição de «muito» é oral, quase amável. «Digamos» finge que a injúria ainda é hipótese.",
    ),
    n(
      "highlight",
      "A imaginação vira culpa.",
      "«Por excesso de imaginação» é o diagnóstico que o livro inteiro vai disputar. Liébedev chama de distração o que é, no príncipe, uma maneira de ver. A frase fecha o insulto com um termo de salão.",
    ),
  ],
  p24: [
    n(
      "underline",
      "Ele já tinha ensaiado o silêncio.",
      "«Eu já esperava isso» aceita a carta sem resposta como fato antigo. Não há mágoa nova. O pretérito tira o drama da ofensa e deixa o príncipe mais só do que se ele se queixasse.",
    ),
  ],
  p25: [
    n(
      "circle",
      "O elogio vem com um «hum».",
      "«Simples e sincero» parece prêmio, e o «hum» o retira. Liébedev louva o que pode usar. A sinceridade, aqui, é uma qualidade de arquivo: serve para classificar o homem, não para o acolher.",
    ),
    n(
      "sideline",
      "Quatro mil almas fecham a ficha.",
      "A Crimeia, o primo vivo, o morto respeitável e as quatro mil almas entram como itens. «Almas» ainda é unidade de terra e de gente. O saber de Liébedev é um cadastro: quem teve, quem morreu, quem resta.",
    ),
  ],
  p28: [
    n(
      "highlight",
      "O corpo vira o vocativo.",
      "Ele não diz o nome. Volta-se «para o moço louro do fardel». O fardo substitui o título. «De repente» marca a hora em que o funcionário decide que o louro pode ser útil. O retrato vira endereço.",
    ),
  ],
  p30: [
    n(
      "circle",
      "O nome próprio é um teste.",
      "«Liév Nikoláievitch?» isola o patronímico, como numa chamada. Não é intimidade. É a segunda chave de um arquivo que ele finge não ter. A pergunta quer ouvir o nome de novo, para medi-lo.",
    ),
    n(
      "underline",
      "A negativa cabe em duas palavras.",
      "«Não conheço» é seco demais para quem acaba de recitar o nome inteiro. A brevidade mente. Entre o nome histórico e a pessoa, ele escolhe o vazio, e o vazio já é um jogo.",
    ),
    n(
      "bracket",
      "Karamzin fica; o homem some.",
      "A vírgula de ofício separa o nome, que «pode e deve» estar na História, da pessoa, de quem «até o rumor se calou». O verbo impessoal apaga a linhagem. Míchkin sobrevive como verbete e morre como casa.",
    ),
  ],
  p31: [
    n(
      "highlight",
      "«O último» sai sem trocadilho.",
      "Ele responde depressa e se inclui: «salvo eu». «Parece-me» é a modéstia que não vê a piada. O último da linhagem fala como quem conta uma família, não como quem se oferece ao riso.",
    ),
    n(
      "underline",
      "O pai desce de posto.",
      "Depois dos avós sem terra, o pai é subtenente, «vindo dos junkers». A genealogia não sobe. Cada oração abaixa o brasão. O príncipe entrega a queda como informação, sem vergonha e sem pose.",
    ),
  ],
  p32: [
    n(
      "circle",
      "A risada explica a própria piada.",
      "«A última no seu gênero!» repete o trocadilho para não perdê-lo, e o «he-he» o sublinha. Liébedev ri do que o príncipe disse sem querer. O riso é didático: ele ensina a sala a achar graça.",
    ),
    n(
      "sideline",
      "O elogio é de forma, não de sangue.",
      "«Como o senhor virou isso» admira o dito, não o homem. «Deu uma risadinha» diminui o funcionário no mesmo instante em que ele se acha espirituoso. O narrador não ri com ele.",
    ),
  ],
  p33: [
    n(
      "underline",
      "Ele percebe o trocadilho tarde.",
      "O louro «admirou-se um pouco» de si. O narrador acrescenta «bastante ruim, aliás» e fica do lado de fora da graça. A ironia não é do príncipe. É de quem já leu a frase e a acha pobre.",
    ),
  ],
  p36: [
    n(
      "highlight",
      "«De repente» muda o alvo.",
      "O advérbio é a virada de Rogójin: a doença alheia deixa de ser anedota e vira pergunta. «Perguntou de repente» acorda o moreno para o outro corpo no banco. O interesse nasce sem motivo dito.",
    ),
  ],
  p39: [
    n(
      "sideline",
      "A doença barra o método.",
      "«Não achavam possível» põe a decisão nos outros. «Com sistema» é a pedagogia que a epilepsia interrompe. Ele pede desculpa por ter estudado aos pedaços. O saber entra já como falta.",
    ),
  ],
  p40: [
    n(
      "circle",
      "O nome sai como uma isca.",
      "«Perguntou depressa» aperta o tempo. «Conhece os Rogójin?» não é conversa: é um teste de Petersburgo. O plural já é clã. O príncipe, que não conhece ninguém, vai ter de falhar.",
    ),
  ],
  p41: [
    n(
      "underline",
      "A Rússia cabe em «pouquíssima».",
      "A negativa se explica por uma frase inteira de exílio. «Pouquíssima gente» é o superlativo da ausência. Ele não conhece os Rogójin porque não conhece o país. A ignorância é geográfica.",
    ),
    n(
      "highlight",
      "A cortesia devolve o nome.",
      "«O senhor é que é Rogójin?» transforma o teste em apresentação. O «é que» destaca a pessoa sentada. Pela primeira vez o moreno pode ser um nome, não um clã. A pergunta é um presente.",
    ),
  ],
  p43: [
    n(
      "circle",
      "O sobrenome acende o arquivo.",
      "«Mas não será daqueles mesmos» é o modo de quem já achou a ficha e finge conferir. As reticências seguram o dote, o escândalo, o dinheiro. Liébedev reconhece antes de ser convidado.",
    ),
    n(
      "sideline",
      "A gravidade é um disfarce.",
      "«Começava» no imperfeito: a frase não chega a acabar. «Gravidade reforçada» é o narrador desmentindo o tom. Ele se compõe para subir de categoria. O corpo do escrevente veste o respeito.",
    ),
  ],
  p45: [
    n(
      "bracket",
      "O rosto troca de máscara.",
      "O espanto vira reverência, a reverência vira subserviência, a subserviência vira medo. Três «de» escalam no mesmo rosto. O travessão não fecha a tempo: a fisionomia muda mais depressa do que a frase.",
    ),
  ],
  p46: [
    n(
      "underline",
      "Ele corta e não olha.",
      "«Sem se dignar, também desta vez, a olhar» repete o desprezo como hábito. O ты da pergunta já feriu; o corpo confirma. O funcionário é falado, não encarado. O príncipe é o único testemunho.",
    ),
    n(
      "circle",
      "O parêntese escolhe o príncipe.",
      "A piscadela tira Liébedev da conversa e põe Míchkin no lugar de cúmplice. «Como cola» é a metáfora do parasita. A pergunta não quer resposta: quer plateia. O piscar é a verdadeira sintaxe.",
    ),
    n(
      "highlight",
      "Três ausências, e um «nada».",
      "Irmão, mãe, dinheiro, aviso: a enumeração desce até «nada!». «Canalha» cabe entre vírgulas, como um aparte que é o centro. A família entra já como quem não escreveu. A ofensa é postal.",
    ),
    n(
      "sideline",
      "O símile é uma palavra só.",
      "«Como a um cão!» não desenvolve a imagem. A exclamação basta. Rogójin mede o parentesco pelo tratamento, e o tratamento é o do animal. A frase é curta porque a raiva não argumenta.",
    ),
    n(
      "underline",
      "A febre fica em Pskov.",
      "Depois do grito, o fato: um mês de cama. O lugar se repete para cravar o exílio dentro da Rússia. A doença não é metáfora ainda. É o corpo que a herança encontrou deitado.",
    ),
  ],
  p47: [
    n(
      "circle",
      "As palmas cobram o milhão.",
      "O verbo do narrador, «bateu palmas», faz de Liébedev um público de feira. A exclamação religiosa e o gesto baixo chegam juntos. Ele celebra o dinheiro alheio com o corpo. A devoção é auditiva.",
    ),
  ],
  p48: [
    n(
      "highlight",
      "O copeque é o refrão.",
      "«Não lhe dou um copeque» já é a lei da cena, dita com o dedo. «Ainda que você ande de cabeça para baixo» transforma o pedido em palhaçada. A raiva escolhe a imagem mais baixa e a fixa.",
    ),
  ],
  p50: [
    n(
      "underline",
      "«Não dou» duas vezes, e a dança.",
      "A repetição «não dou, não dou» é o compasso. A semana de dança responde ao corpo que Liébedev ofereceu. Rogójin transforma a súplica em espetáculo e se recusa a pagar o ingresso.",
    ),
  ],
  p51: [
    n(
      "circle",
      "Ele aceita o papel.",
      "«É o que me cabe; não dê!» transforma a recusa em deixa. O ponto e vírgula cola o destino ao imperativo. Liébedev não discute o copeque. Entra no jogo que Rogójin descreveu.",
    ),
    n(
      "highlight",
      "O futuro é um verbo só.",
      "«E eu vou dançar» é curto de propósito. Não há música nem lugar. O anúncio basta para baixar a própria dignidade. A frase cabe numa ameaça de palco.",
    ),
    n(
      "sideline",
      "A família entra como o que se joga.",
      "Mulher e filhos pequenos são o objeto direto de «largo». A enumeração do íntimo serve para aumentar o preço da humilhação. Ele oferece o que não devia oferecer. O leitor mede o abismo.",
    ),
    n(
      "underline",
      "O verbo muda de pessoa.",
      "«Adula, adula!» sai do futuro e vira ordem, ou canto. A repetição é o estribilho do parasita. Não se sabe se ele manda Rogójin bajular ou se nomeia o próprio ofício. A ambiguidade é o ofício.",
    ),
  ],
  p52: [
    n(
      "bracket",
      "O fardel vira senha de irmão.",
      "«Como o senhor» aproxima o milionário do príncipe pelo mesmo substantivo pobre: o fardel. A fuga, a tia, a febre e a morte do pai cabem numa só oração. A vírgula não dá descanso. A herança chega sem o filho.",
    ),
    n(
      "highlight",
      "A bênção e o quase-crime.",
      "«Memória eterna ao morto» é fórmula de igreja, e «por um triz ele não me matou» a desmente no mesmo fôlego. A vírgula não separa o bastante. Rogójin reza e acusa com a mesma linha.",
    ),
    n(
      "circle",
      "O juramento escolhe o príncipe.",
      "«Acredita, príncipe, por Deus!» muda de ouvinte no meio da raiva. O vocativo tira Liébedev da cena. O que era briga de herança torna-se confissão. Só o louro é digno do «por Deus».",
    ),
    n(
      "sideline",
      "O condicional é uma faca.",
      "«Se eu não tivesse fugido, ele me matava» usa o imperfeito no lugar do condicional: fato, não hipótese. A fuga salva a vida e o condena a chegar tarde. A frase é a moral que ele aceita.",
    ),
  ],
  p53: [
    n(
      "circle",
      "O narrador cola os dois títulos.",
      "«Milionário de tulup» é o oxímoro do narrador, não do príncipe. A curiosidade «um tanto especial» já lê o casaco como o capital. O olhar do louro e o julgamento de quem conta chegam no mesmo verbo.",
    ),
  ],
  p54: [
    n(
      "underline",
      "A desculpa cabe em três palavras.",
      "«A gente entende!» é oral e impessoal. Não explica o irmão; pede que o príncipe complete. A exclamação substitui o motivo. Rogójin confia que a omissão já é clara.",
    ),
    n(
      "highlight",
      "A memória falta no pretérito.",
      "«Eu estava então sem memória» nomeia o branco sem metáfora. O advérbio «então» prende a falha àqueles dias. A febre não é desculpa florida. É a ausência do sujeito na própria história.",
    ),
    n(
      "sideline",
      "O boato traz o telegrama.",
      "«Também dizem» afasta o fato para a voz dos outros. O telegrama entra como rumor, não como papel visto. Rogójin não pode jurar o que não leu. A notícia da morte chega já de segunda mão.",
    ),
    n(
      "circle",
      "O papel erra a casa.",
      "«Foi e chegou» soa a destino de objeto. A casa da tia é o endereço errado que decide a cena. A conjunção «mas» não corrige nada: registra o desvio. O aviso existiu e não o encontrou.",
    ),
    n(
      "underline",
      "A freira é o grau mais baixo.",
      "«Freira não é, e é pior do que freira» define por negação e por excesso. O comparativo não descreve a fé: descreve o medo. A tia entra como caricatura, e por ela entra a palavra iuródivy.",
    ),
    n(
      "highlight",
      "O ouro do morto é a primeira cena.",
      "A noite, o caixão, o brocado e as borlas fundidas formam um quadro antes do verbo do irmão. O discurso citado reduz o luto a preço: «olhe quanto dinheiro valem». O escândalo começa no tecido.",
    ),
    n(
      "sideline",
      "O vocativo já é o insulto.",
      "«Voltou-se para o funcionário» encena o gesto que a frase seguinte vai chamar de espantalho. O narrador marca o alvo antes do nome. Liébedev deixa de ser comparsa e vira consultor jurídico à força.",
    ),
    n(
      "circle",
      "A lei é uma pergunta de uma palavra.",
      "«Como é pela lei: sacrilégio?» reduz o código a um verbete. Rogójin não quer o artigo. Quer a palavra que ameaça a Sibéria. O ponto de interrogação entrega o julgamento a quem ele despreza.",
    ),
  ],
  p55: [
    n(
      "highlight",
      "O eco é o ofício.",
      "A segunda «Sacrilégio!» não acrescenta informação. Repete, como um sino de cartório. Liébedev confirma o crime pelo volume. A palavra jurídica vira grito de acordo.",
    ),
    n(
      "underline",
      "«Logo» mede a pressa do ofício.",
      "«Acudiu logo» é o advérbio do escrevente: a resposta estava pronta antes da pergunta acabar. Ele vive de chegar primeiro ao termo certo. O narrador cronometra a subserviência.",
    ),
  ],
  p57: [
    n(
      "circle",
      "O lugar vira sentença.",
      "«Já para a Sibéria!» tira o verbo. Não há sujeito nem processo. O advérbio «já» antecipa a pena. Três vezes o nome da terra, e esta é a que condena. O mapa substitui o tribunal.",
    ),
  ],
  p58: [
    n(
      "highlight",
      "O nome dela cai sem apresentação.",
      "Nastássia Filíppovna entra como causa, não como retrato. «Isso é verdade» isola a culpa numa frase que se confirma sozinha. O pai foi irritado por um nome que o leitor ainda não viu.",
    ),
    n(
      "underline",
      "O sujeito se separa do irmão.",
      "«Aí, sim, fui eu só» usa o «sim» como carimbo. As outras ofensas eram do irmão; esta ele reclama. O advérbio «só» é o orgulho dentro da culpa. Ele quer a autoria do escândalo.",
    ),
    n(
      "sideline",
      "O pecado é um agente.",
      "«O pecado me embaralhou» tira a ação do homem e a dá ao substantivo. «Запутал» é emaranhar, não apenas tentar. A frase é curta porque a teologia de Rogójin não explica: empurra.",
    ),
  ],
  p59: [
    n(
      "circle",
      "O murmúrio já combina o preço.",
      "«Subserviente, como quem começa a combinar alguma coisa» é o narrador lendo o futuro no tom. O nome dela acende o segundo arquivo. Liébedev não pergunta: orça.",
    ),
  ],
  p60: [
    n(
      "highlight",
      "O grito protege o relato.",
      "«Gritou-lhe, impaciente» aumenta o volume para tapar a boca do outro. «Mas você não sabe!» precisa do corpo. A impaciência é o medo de que a história seja contada por quem a venderia.",
    ),
  ],
  p61: [
    n(
      "underline",
      "O triunfo cabe no advérbio.",
      "«Respondeu o funcionário, triunfante» desmente a ignorância que Rogójin acaba de gritar. O adjetivo do narrador é a vitória do arquivo sobre o dono da história. Liébedev já sabe, e o sabe em voz alta.",
    ),
  ],
  p62: [
    n(
      "circle",
      "O plural tenta apagar a única.",
      "«Como se houvesse poucas» finge que o nome é comum. O plural Nastássias Filíppovnas é a defesa e o insulto. Rogójin sabe que não há poucas. Há uma, e o outro a reconheceu.",
    ),
    n(
      "sideline",
      "O insulto volta ao corpo.",
      "«Bicho atrevido» desce Liébedev de pessoa a animal, de novo. «Eu lhe digo» é ameaça de continuação, não informação. A frase não fecha o assunto: marca o território.",
    ),
    n(
      "underline",
      "O parêntese moral escolhe o príncipe.",
      "«Continuou ele, para o príncipe» vira o corpo no meio da raiva. O que segue não é para o funcionário. O narrador marca o verdadeiro ouvinte, como já fizera com a piscadela.",
    ),
  ],
  p63: [
    n(
      "highlight",
      "O corpo não fica quieto.",
      "«Mexia-se o funcionário» põe a agitação no verbo, antes do que ele diz. O saber não cabe nele. O narrador o mostra inquieto, como quem já gasta a informação.",
    ),
    n(
      "circle",
      "O nome próprio vira firma.",
      "«Liébedev sabe!» fala de si na terceira pessoa, como um cartaz. A exclamação é anúncio de profissão. Ele se oferece como o homem que conhece a cidade por dentro.",
    ),
  ],
  p64: [
    n(
      "sideline",
      "O espanto chega atrasado.",
      "«Por fim» admite que Rogójin resistiu. «Espantou-se de verdade» separa este susto dos anteriores, que eram raiva. O arquivo de Liébedev venceu. O narrador registra a derrota no advérbio.",
    ),
    n(
      "underline",
      "O juramento confirma o derrotado.",
      "«Cruzes, diabo, mas ele sabe mesmo» mistura o sacro e o baixo, como Rogójin mistura tudo. O «mas» é a concessão. A frase não pede prova. Entrega o ponto.",
    ),
  ],
  p65: [
    n(
      "highlight",
      "A repetição é o letreiro.",
      "«Liébedev sabe tudo!» sobe de «sabe» para «tudo». O nome outra vez na terceira pessoa. Não é ênfase: é marca de casa. Ele grava o serviço na orelha de quem pode pagar.",
    ),
    n(
      "bracket",
      "A autobiografia é um anúncio.",
      "Likhatchov, a morte do pai, «todos os cantos e becos»: a lista é o currículo. «Vossa claridade» sobe o tratamento no meio da lama. Sem ele, diz, o outro não dava um passo. O saber pede emprego.",
    ),
  ],
  p66: [
    n(
      "circle",
      "A pergunta treme nas reticências.",
      "«E ela andava com o Likhatchov?...» junta o nome dela ao do libertino e não aguenta o ponto final. As reticências são o ciúme sem frase. A pergunta já é a cena.",
    ),
    n(
      "highlight",
      "A boca empalidece antes da voz.",
      "O narrador não dá a resposta. Dá o corpo: olhar mau, lábios brancos, tremor. A frase de Rogójin acaba no rosto. O ciúme é descrito por fora, e por isso dói mais.",
    ),
  ],
  p67: [
    n(
      "sideline",
      "O corpo corrige a boca.",
      "«Caiu em si e se apressou» é o narrador vendo o medo voltar. O travessão corta a gagueira no gesto. Liébedev entende que falou demais e corre atrás da própria frase.",
    ),
    n(
      "underline",
      "O nome da outra serve de escudo.",
      "«Não é como a Armance» traz uma segunda mulher para desviar a primeira. A comparação não explica: apaga. Ele troca o escândalo de endereço, depressa.",
    ),
    n(
      "circle",
      "Tótski reduz o quarto a um homem.",
      "«Aqui é só o Tótski» fecha a lista com um advérbio de exclusão. O protetor substitui o libertino. A frase é curta para parecer definitiva. O boato fica, mesmo negado.",
    ),
    n(
      "bracket",
      "O boato é citado para ficar.",
      "Os oficiais «não podem provar nada», e mesmo assim a frase deles é reproduzida: «esta é aquela mesma». A negação carrega o nome. «E quanto ao resto — nada!» protesta alto demais.",
    ),
    n(
      "highlight",
      "A segunda negativa confessa.",
      "«Porque também não há nada» explica a frase anterior e a enfraquece. Quem repete o vazio teme o cheio. A causalidade é de quem limpa a mesa às pressas. O leitor guarda o nome.",
    ),
  ],
  p68: [
    n(
      "underline",
      "A voz troca de dono nas aspas.",
      "«Eu, quero dizer» corrige o sujeito no meio da entrada. Quem fala a Nastássia não é Rogójin: é Zaliójiev, e o discurso citado o denuncia. «Digne-se aceitar» é fórmula de salão na boca do outro.",
    ),
    n(
      "sideline",
      "A morte é uma frase que não se cumpre.",
      "«E se fui embora» explica a sobrevivência por um pensamento citado: «não volto vivo». Ele sai justamente porque espera morrer. A lógica é de criança e de sentença. O corpo desobedece ao dito.",
    ),
    n(
      "bracket",
      "Dois corpos, e ela escolhe o errado.",
      "Baixo, lacaio, calado, vergonha, contra pomada, cabelo armado, gravata xadrez. A enumeração é o ciúme. «Com certeza ela o tomou por mim» é o centro da ofensa: o amigo vestiu o gesto.",
    ),
    n(
      "highlight",
      "A resposta volta ao pai.",
      "O riso de Zaliójiev não fala dela. Fala de Semion Parfiónitch. O amigo mede a coragem pela prestação de contas. O amor acaba numa frase de contabilidade doméstica.",
    ),
  ],
  p70: [
    n(
      "circle",
      "O verbo é devolvido com aspas.",
      "«Repetiu Rogójin» isola o «mandava» que ele não aceita. Repetir é tirar o direito da palavra. O narrador marca o eco como golpe, não como confirmação.",
    ),
    n(
      "underline",
      "A pergunta fecha a porta.",
      "«O que é que você sabe?» não quer informação. Quer calar. O «você» volta o desprezo. Entre o eco e esta frase, Liébedev é empurrado para fora do relato.",
    ),
    n(
      "sideline",
      "A lição é uma hora, não um conteúdo.",
      "Três verbos do pai — pegou, trancou, deu lição — e nenhum objeto ensinado. «Por uma hora inteira» mede a surra no relógio. A educação de Rogójin é duração e chave.",
    ),
    n(
      "bracket",
      "Ela devolve a caixa e fica com o preço.",
      "O velho se curva, suplica, chora; ela atira a caixa. O discurso citado chama-o «barba velha» e multiplica o custo por dez. Os brincos voltam. A humilhação fica com a casa.",
    ),
    n(
      "highlight",
      "A volta à consciência é uma frase.",
      "Depois da lista de tabernas, cães e febre, «Mal voltei a mim» resume a noite num verbo. «Еле очнулся»: quase não acordou. A brevidade é o corpo no limite. A herança o encontra assim.",
    ),
  ],
  p71: [
    n(
      "circle",
      "A risadinha já gasta o ouro.",
      "«Esfregando as mãos, dava risadinhas» é o gesto do negociante antes do contrato. «Agora, senhor, que brincos!» transforma a joia em futuro. O narrador o diminui no diminutivo do riso.",
    ),
    n(
      "sideline",
      "O «nós» se inclui na fortuna.",
      "«Agora nós vamos recompensar» mete Liébedev no sujeito. As reticências deixam o preço em aberto. Ele não pede: conjuga. O brinco alheio vira sociedade.",
    ),
  ],
  p73: [
    n(
      "underline",
      "O açoite vira assinatura.",
      "«Açoitou, e com isso mesmo selou» faz do particípio um contrato. As reticências guardam o que foi selado: a não rejeição. A dor entra como cláusula. Liébedev entende o castigo melhor do que o afeto.",
    ),
    n(
      "highlight",
      "A estação corta o negócio.",
      "«E eis que chegamos!» muda de tempo e de lugar no meio da metáfora. O «eis» é oral, de quem aponta a plataforma. O vagão acaba a frase que o dinheiro não acabou.",
    ),
  ],
  p74: [
    n(
      "sideline",
      "O «quieto» já era mentira.",
      "«Embora dissesse» desmente Rogójin com o fato: já o esperavam. A concessão é do narrador, não do personagem. A partida secreta tinha plateia. O boato correu mais do que o trem.",
    ),
    n(
      "circle",
      "Os gorros são o coro.",
      "«Gritavam e acenavam» não nomeia as pessoas, nomeia o gesto. Os gorros fazem a corte do herdeiro. A frase é curta porque o espetáculo dispensa adjetivos. A cidade começa assim.",
    ),
  ],
  p75: [
    n(
      "highlight",
      "O sorriso do retrato volta.",
      "Triunfante e «até como que maldoso» recupera o sorriso do primeiro parágrafo. «De repente voltou-se» escolhe o príncipe diante da plateia. O advérbio é a eleição. Zaliójiev fica no fundo.",
    ),
    n(
      "underline",
      "A causa da afeição é ignorância.",
      "«Talvez porque» oferece um motivo e o estraga com o parêntese: também encontrou Liébedev, e desse não gostou. O encontro no minuto certo vale mais do que o caráter. A simpatia é circunstância.",
    ),
    n(
      "bracket",
      "A lista desfaz o capuz suíço.",
      "Polainas, marta, fraque, colete, bolsos de dinheiro: o inventário veste o príncipe de outro romance. O «e...» suspende o resto. A generosidade é uma enumeração, e a enumeração é uma ordem.",
    ),
    n(
      "circle",
      "O nome dela é o destino da lista.",
      "«Vamos à casa de Nastássia Filíppovna!» gasta a roupa inteira numa direção. A exclamação não convida: arrasta. O príncipe seria o testemunho bem vestido de uma entrada.",
    ),
    n(
      "sideline",
      "A pergunta final é um desafio.",
      "«O senhor vem ou não?» reduz o convite a uma alternativa seca. O «ou não» admite a recusa e a provoca. Rogójin precisa da resposta no mesmo fôlego da extravagância.",
    ),
  ],
  p76: [
    n(
      "underline",
      "Dois adjetivos, dois Liébedev.",
      "«Insinuante e solene» não combinam, e o narrador os cola. O tom de profeta barato usa a solenidade para vender. O vocativo do príncipe já preparava o conselho. O corpo o entrega.",
    ),
    n(
      "highlight",
      "O conselho é uma interjeição.",
      "«Ai, não perca!» não diz o que se perde. O objeto fica de fora. A pressa é o argumento. Liébedev empurra o príncipe para a casa de Rogójin com um grito de feira.",
    ),
    n(
      "circle",
      "A repetição e as reticências.",
      "A segunda «Ai, não perca!..» não acrescenta. Alonga. As reticências são o lucro não dito. Quem repete a pressa tem parte no negócio. O ponto não chega.",
    ),
  ],
  p78: [
    n(
      "underline",
      "O tempo fica condicional.",
      "«Talvez até hoje mesmo, se der tempo» aceita o afeto e adia a visita. Duas restrições numa frase curta. A gratidão não assina o programa. O príncipe guarda a própria hora.",
    ),
    n(
      "highlight",
      "O copeque recusa a metáfora.",
      "Ele agradece a roupa e separa o dinheiro. «Quase nenhum copeque» responde, sem querer, ao copeque que Rogójin negou a Liébedev. A pobreza é dita com precisão, não com vergonha.",
    ),
  ],
  p81: [
    n(
      "circle",
      "«Diga antes» baixa o convite a tarifa.",
      "O imperativo corta a delicadeza. «Antes» pede o dado bruto: se ele é «caçador» do sexo feminino. A pergunta anterior já era grossa; esta exige a resposta no ato. Rogójin não sabe perguntar de outro modo.",
    ),
  ],
  p82: [
    n(
      "sideline",
      "A doença ocupa o lugar do desejo.",
      "«O senhor talvez não saiba» pede licença para a confissão. «De nascença» tira a escolha. «Até nem conheço mulher nenhuma» é absoluto, e o «até» empurra o absoluto mais longe. A frase é clara, e por isso pesa.",
    ),
  ],
  p87: [
    n(
      "underline",
      "O século empurra o adjetivo.",
      "«Até russo e cordial» chega depois do travessão, como um acréscimo de moda. «Aonde não vai o século?» finge espanto. Ser russo e cordial é a última máscara do general, e o narrador a põe entre parênteses irônicos.",
    ),
  ],
  p88: [
    n(
      "circle",
      "A segunda pergunta não espera.",
      "«A que se agarrar, senão à família?» responde a si mesma. O «senão» fecha o mundo. Não é a voz do narrador neutro: é o lema do general, em estilo de discurso. A família vira o único substantivo permitido.",
    ),
  ],
  p89: [
    n(
      "highlight",
      "O horror é uma quantidade.",
      "«Com horror dizia-se» é impessoal: a cidade fala. O espanto não é o conteúdo dos livros, é «quantos». A leitura das filhas entra como escândalo numérico. O narrador empresta o tom e não o assina.",
    ),
  ],
  p93: [
    n(
      "underline",
      "Ele precisa saber o endereço do corpo.",
      "«É ao próprio general que o senhor vem?» usa a ênfase «é... que» para separar casa e dono. O criado não hospeda sem destinatário. A pergunta põe o príncipe no mapa da antecâmara.",
    ),
  ],
  p95: [
    n(
      "sideline",
      "O verbo de dizer não chega ao assunto.",
      "«Começou o príncipe» promete uma frase e a corta nas reticências anteriores. O narrador registra o esforço, não o conteúdo. O assunto ainda não tem nome. O início já é o embaraço.",
    ),
  ],
  p96: [
    n(
      "circle",
      "A regra se repete para valer.",
      "«Já disse» transforma o secretário em lei. Sem ele, não há anúncio. A frase fecha a conversa com um ofício. O criado não quer o assunto: quer o protocolo que o protege.",
    ),
  ],
  p98: [
    n(
      "highlight",
      "A pergunta se parte no meio.",
      "«Do estrangeiro?» continua um «mas o senhor é mesmo...» que não ousou o título. A quebra da linha é a quebra da coragem. O criado confere a origem porque o aspecto não confere com o nome.",
    ),
    n(
      "bracket",
      "O narrador diz a frase não dita.",
      "«Sem querer», «atrapalhou-se», «queria, talvez»: três hesitações, e só então a pergunta verdadeira, entre aspas. «É mesmo o príncipe Míchkin?» é o que a casa inteira pensa. O narrador a completa por ele.",
    ),
  ],
  p99: [
    n(
      "underline",
      "Ele ouve a frase em voz alta.",
      "«Parece-me que o senhor queria perguntar» devolve ao criado o pensamento. A cortesia do príncipe é uma leitura. Ele formula o que o outro calou, e o faz sem ironia visível.",
    ),
    n(
      "circle",
      "A polidez é o motivo, e é pouca.",
      "«E não perguntou, por polidez» fecha com uma causal curta. O príncipe elogia o silêncio e, ao nomeá-lo, o desfaz. A frase é um sorriso. O criado fica nu na própria educação.",
    ),
  ],
  p101: [
    n(
      "sideline",
      "O fardel é explicado, não escondido.",
      "«Não há nada para admirar» antecipa o olhar do outro. «Aspecto» e «fardel» entram juntos. «Não são lá muito airosas» é eufemismo de pobre, dito com calma. Ele tira o susto da roupa antes de pedir entrada.",
    ),
  ],
  p102: [
    n(
      "underline",
      "O «a menos» fica suspenso.",
      "«A menos que o senhor...» não completa a condição. As reticências são o medo de dizer «a menos que o senhor não seja ninguém». O criado cumpre o dever e deixa a exceção no ar.",
    ),
    n(
      "highlight",
      "O príncipe substantiva a hesitação.",
      "«Eis justamente isso, o «a menos»» pega a palavra no ar e a cita. O embaraço vira objeto. Pouca gente, nesta casa, escuta a sintaxe do criado. Ele escuta, e a devolve com precisão.",
    ),
  ],
  p103: [
    n(
      "circle",
      "O assunto continua vazio.",
      "«Tenho outro assunto» responde à suspeita sem dizer qual. «Outro» afasta a esmola e não põe nada no lugar. A frase é limpa demais. O vazio é o que inquieta o criado.",
    ),
  ],
  p104: [
    n(
      "sideline",
      "Dois secretários, e um coronel no meio.",
      "A espera ganha hierarquia: coronel primeiro, secretário depois, e as reticências confundem os cargos. O criado fala a mais para ganhar tempo. A casa é uma fila, e o príncipe está fora dela.",
    ),
    n(
      "underline",
      "«O da companhia» corrige o cargo.",
      "A frase solta especifica qual secretário, tarde. A precisão chega depois da confusão. Gânia ainda não tem nome. Tem função. O príncipe é colocado na fila da Companhia, não da família.",
    ),
  ],
  p105: [
    n(
      "highlight",
      "O cachimbo é dito com naturalidade.",
      "«Tenho cachimbo e tabaco comigo» justifica o pedido impossível com um inventário doméstico. Ele não percebe o escândalo. A frase é de quarto, dita na antecâmara. O objeto pobre vai ofender mais do que o fardel.",
    ),
  ],
  p106: [
    n(
      "bracket",
      "A vergonha é transferida.",
      "«Não pode» vira «devia ter vergonha até de ter isso nos pensamentos». O criado moraliza o fumo. «Eh...» é o resto do espanto, sem frase. O pensamento do príncipe já é, para ele, uma falta.",
    ),
    n(
      "circle",
      "A interjeição ocupa a sentença.",
      "«Que coisa!..» não tem verbo. O escândalo cabe numa exclamação e nuns pontos. O criado não argumenta mais. O corpo da frase é o próprio pasmo. A casa inteira está nesse «que coisa».",
    ),
  ],
  p108: [
    n(
      "underline",
      "«Quase sem querer» denuncia o medo.",
      "O murmúrio escapa, e o narrador marca que não era plano. «Sendo o senhor assim» já foi dito; o advérbio pede desculpa ao próprio ofício. O criado teme a frase que lhe saiu.",
    ),
    n(
      "sideline",
      "O fardel não deixa a frase em paz.",
      "«Acrescentou» cola uma segunda suspeita: morar aqui. O olhar de soslaio volta ao volume no chão. «Não lhe dava sossego» anima o objeto. A bagagem é o personagem que o criado não consegue calar.",
    ),
  ],
  p109: [
    n(
      "highlight",
      "O convite é recusado antes de existir.",
      "«Mesmo que me convidassem, eu não ficaria» responde a uma oferta que ninguém fez. O condicional mata o medo do criado. O príncipe não quer a cama. Quer outra coisa, e a frase ainda não a nomeia bem.",
    ),
    n(
      "underline",
      "«E mais nada» fecha cedo demais.",
      "«Só para travar conhecimento, e mais nada» insiste no vazio com dois limitadores, «só» e «mais nada». Nesta casa, conhecer sem assunto é a frase insensata. A repetição da falta é o que soa a loucura.",
    ),
  ],
  p110: [
    n(
      "circle",
      "A desconfiança é triplicada.",
      "O narrador numera o espanto: «triplicada». Não basta não entender. É preciso o grau. O criado sai do protocolo e entra na suspeita. O verbo «perguntou» carrega o advérbio como acusação.",
    ),
    n(
      "sideline",
      "Ele pega a contradição como um ladrão.",
      "«Como é que o senhor disse primeiro» cita a fala anterior como prova. O criado é bom de ata. Assunto e conhecimento não cabem juntos. A pergunta é uma acareação.",
    ),
  ],
  p111: [
    n(
      "bracket",
      "A genealogia vira credencial.",
      "O «isto é» desfaz o «quase não» e reconstrói o assunto: um conselho, mas sobretudo o nome. Ele e a generala são os últimos Míchkin. A frase é longa porque a linhagem é o único documento que ele trouxe.",
    ),
  ],
  p112: [
    n(
      "highlight",
      "O medo muda de sinal.",
      "«Sobressaltou-se» e «já quase de todo assustado» medem o novo susto: não é mais o fardel, é o parentesco. «Então o senhor ainda é parente?» acaba de ser dito. O corpo do lacaio acredita antes da casa.",
    ),
  ],
  p113: [
    n(
      "underline",
      "Ele estraga a credencial de novo.",
      "«Tão distantes que nem se pode contar» desmonta o parentesco no instante seguinte a tê-lo usado. «A bem dizer» é a honestidade que assusta. Ele não sabe guardar uma vantagem.",
    ),
    n(
      "circle",
      "A carta sem resposta vira dever.",
      "«Ainda assim» ignora o silêncio da generala. «Achei necessário» faz da visita uma obrigação, não uma mágoa. Ele não cobra a resposta. Cobra de si o gesto. A frase é teimosa e sem rancor.",
    ),
    n(
      "sideline",
      "«Talvez muito bem» aceita a porta.",
      "Receber é bom; não receber «também, talvez, muito bem». O advérbio tira o drama da recusa. Depois ele explica por que, mesmo assim, hão de abrir: a linhagem. A calma e a certeza dividem a mesma fala.",
    ),
  ],
  p116: [
    n(
      "highlight",
      "A lógica despede o secretário.",
      "«E agora, talvez» conclui o riso anterior: já que o medo tinha causa, o criado pode anunciar sozinho. «Nem valha a pena esperar» é uma proposta prática dita com alegria. Ele organiza a casa alheia.",
    ),
  ],
  p119: [
    n(
      "underline",
      "A Companhia empresta o nome.",
      "«Serve por conta própria na Companhia» explica Gavrila antes de o príncipe pedir. A maiúscula de casa faz do emprego um título. O criado situa o moço no organograma, não na família.",
    ),
    n(
      "circle",
      "O fardel ganha um canto.",
      "«Ponha ao menos o fardel aqui, ali» é concessão mínima. «Ao menos» e o «ali» vago não oferecem cadeira. Oferecem um chão menos visível. O objeto continua a mandar na cena.",
    ),
  ],
  p120: [
    n(
      "sideline",
      "A capa pede licença sozinha.",
      "«E, sabe, eu tiro também a capa?» junta o fardel ao casaco com um «também» tímido. A pergunta é de hóspede que não quer errar o gesto. O corpo suíço pede regra para cada peça.",
    ),
  ],
  p122: [
    n(
      "highlight",
      "A corrente atravessa o colete.",
      "«Pelo colete corria uma corrente de aço» é o primeiro sinal de ordem debaixo do capuz. O verbo «corria» anima o metal. O paletó gasto ganha um eixo. O narrador desce o olhar com método.",
    ),
    n(
      "circle",
      "Genebra cabe num relógio.",
      "«Apareceu» faz do objeto uma revelação. Prata, não ouro; Genebra, não Petersburgo. O relógio é a Suíça portátil, pequena e precisa. A cidade de onde ele veio cabe no bolso.",
    ),
  ],
  p124: [
    n(
      "underline",
      "Ele senta no mesmo lugar.",
      "«Sentando-se outra vez no mesmo lugar» anula o avanço. A pergunta sobre a generala não o move. O narrador marca a volta ao banco. A antecâmara ainda não o deixou passar.",
    ),
  ],
  p125: [
    n(
      "sideline",
      "A casa tem modos, não horários.",
      "«De modos diferentes, conforme a pessoa» recusa a regra única. O criado não diz a hora: diz a hierarquia. Receber é um juízo. O príncipe acaba de ouvir que não é uma categoria.",
    ),
    n(
      "circle",
      "A modista marca o relógio baixo.",
      "«Mesmo às onze» faz da costureira o exemplo do acesso fácil. O «mesmo» é desdém. O horário concreto aparece só para quem não pesa. A comparação humilha sem nomear o príncipe.",
    ),
    n(
      "highlight",
      "Gânia entra antes do café.",
      "O nome próprio sobe acima da modista: admitido mais cedo, até ao café. O criado entrega, sem querer, o mapa dos favoritos. O príncipe aprende a casa por exceções.",
    ),
  ],
  p130: [
    n(
      "underline",
      "Quatro anos cabem num campo.",
      "«Aliás» corrige a conta logo depois de dá-la. «Quase o tempo todo num lugar só» reduz o estrangeiro a um ponto. A Suíça não foi viagem. Foi um campo. A frase encolhe o mapa.",
    ),
  ],
  p132: [
    n(
      "highlight",
      "O espanto é linguístico.",
      "«Admira-me de mim mesmo» faz do russo uma surpresa do sujeito. Não ter esquecido é a alegria. A frase fala da língua como de um membro que podia ter morrido. Ele a encontra viva na própria boca.",
    ),
    n(
      "circle",
      "A causa da fala é a fala.",
      "«Talvez por isso eu fale tanto» explica o excesso do livro inteiro numa hipótese. O prazer de ouvir-se em russo produz a cena. A tagarelice deixa de ser defeito e vira método.",
    ),
    n(
      "sideline",
      "«Desde ontem» data o desejo.",
      "«Palavra» jura, e «desde ontem» marca a hora: o vagão. A vontade de falar russo nasce na fronteira. Não é saudade abstrata. É o dia anterior, ainda no corpo.",
    ),
  ],
  p133: [
    n(
      "bracket",
      "O parêntese entrega a derrota.",
      "O narrador abre o parêntese para dizer que o lacaio não conseguiu calar-se. «Tão cortês e educada» justifica a queda do cargo. A conversa venceu o protocolo. O parêntese é a rendição, dita à parte.",
    ),
  ],
  p134: [
    n(
      "underline",
      "«De passagem» mal pousa.",
      "«Quase nada, só de passagem» responde a Petersburgo com dois limitadores. Ele não finge intimidade com a cidade. A frase é honesta e curta. O criado esperava um passado; recebe um trânsito.",
    ),
    n(
      "sideline",
      "Quem sabia tem de reaprender.",
      "«Pelo que se ouve» e «dizem» empilham o boato. A novidade é tão grande que o conhecimento antigo não serve. Ele fala de uma cidade que ainda não viu, e a sintaxe é a de quem escuta na porta.",
    ),
    n(
      "highlight",
      "Os tribunais entram de ouvido.",
      "«Aqui agora fala-se muito dos tribunais» é impessoal e presente. A reforma judicial chega como assunto de antecâmara, não como ideia. Dessa frase vai nascer a guilhotina. O gancho é casual.",
    ),
  ],
  p135: [
    n(
      "circle",
      "A tautologia ganha tempo.",
      "«Os tribunais, é verdade que são os tribunais» não informa. Repete para segurar a cena. O criado, que não tem opinião, finge ter o tema. O eco é o embaraço de quem foi puxado para fora do ofício.",
    ),
    n(
      "underline",
      "A pergunta é séria, e é simples.",
      "«E então, lá é mais justo, ou não?» reduz a reforma a uma alternativa. «Ou não» admite o não sem ornamento. É a pergunta de quem não leu o jornal e mesmo assim acerta o centro.",
    ),
  ],
  p136: [
    n(
      "sideline",
      "O elogio vem de ouvido.",
      "«Do nosso eu ouvi falar muito bem» não diz «eu vi». O possessivo «nosso» adota o tribunal russo com cautela. Ele elogia o que não presenciou. A honestidade do «ouvi» prepara o contraste.",
    ),
    n(
      "highlight",
      "A pena de morte entra de lado.",
      "«Eis, outra vez» liga esta frase a algo já pensado, que o criado não ouviu. «Entre nós não há» é o alívio e o tema. A ausência da pena abre, sem aviso, o relato de Lyon. O «eis» aponta.",
    ),
  ],
  p138: [
    n(
      "circle",
      "O médico é o guia da cena.",
      "«Schneider me levou consigo» dá ao médico o verbo. O príncipe não foi ver a execução: foi levado. A frase curta tira a iniciativa e aumenta o fato. Alguém achou que ele devia olhar.",
    ),
  ],
  p142: [
    n(
      "underline",
      "A máquina ganha peso e nome.",
      "«Deitam o homem» é impessoal, e a faca «cai». Larga, pesada, forte: três adjetivos antes de a cabeça saltar. «Chama-se guilhotina» nomeia tarde, como quem traduz para o criado. O instrumento precede a palavra.",
    ),
    n(
      "highlight",
      "O piscar é a unidade de tempo.",
      "«A cabeça salta de um modo que você nem tem tempo de piscar» mede a morte no corpo de quem ouve. O «você» puxa o criado para debaixo da faca. A rapidez é o argumento, e ainda não é o horror.",
    ),
    n(
      "bracket",
      "Quatro verbos, e o terror neles.",
      "Anunciam, aprontam, amarram, levam: o assíndeto da preparação. «Aí é que é terrível» reserva o horror para antes da lâmina. A frase desmente a rapidez que ele mesmo acaba de elogiar.",
    ),
  ],
  p144: [
    n(
      "circle",
      "A segunda pergunta responde.",
      "«Não é um horror?» não espera o criado. A interrogação é a resposta. Ele pergunta para obrigar o outro a ver o que ele viu. O horror já está conjugado.",
    ),
    n(
      "sideline",
      "A idade recusa a criança.",
      "«Não uma criança» corrige o choro esperado, e «quarenta e cinco anos» crava o número. «Nunca tinha chorado» faz do pranto uma primeira vez. A frase acumula recusas até o homem não caber no medo.",
    ),
    n(
      "highlight",
      "Ultraje, não dor.",
      "«Um ultraje à alma, mais nada!» responde à própria pergunta sobre as convulsões. «Надругательство» não é sofrimento: é ofensa. «Mais nada» corta a teologia. A alma é insultada, e a frase se recusa a enfeitar.",
    ),
    n(
      "underline",
      "O «não» recusa a simetria.",
      "«Não, isso não pode ser» rejeita a lógica de matar quem matou. O «não» inicial é oral, de quem interrompe a si mesmo. A frase é curta porque a objeção não cabe em argumento. Cabe em recusa.",
    ),
    n(
      "circle",
      "O sonho devolve o fato ao corpo.",
      "«Umas cinco vezes eu sonhei» conta os retornos. O mês não arquivou a cena. O número modesto — cinco — torna o pesadelo um calendário. Ele ainda dorme debaixo daquela faca.",
    ),
  ],
  p147: [
    n(
      "highlight",
      "«Com calor» muda o registro.",
      "«Acudiu o príncipe, com calor» é o narrador marcando a temperatura da fala. Até aqui ele narrava; agora discute. O advérbio avisa que a tese vai doer. O criado acaba de virar plateia de um discurso.",
    ),
    n(
      "underline",
      "A máquina nasce do conforto de quem olha.",
      "«Todos notam exatamente como o senhor» generaliza o alívio do criado. «Inventada para isso» faz da guilhotina um produto do olhar, não da justiça. A rapidez que o outro elogiou é o crime do aparelho.",
    ),
    n(
      "sideline",
      "A segunda frase aperta a primeira.",
      "O paralelismo repete «desproporcionalmente» e troca o crime pelo bandido. A sentença pesa mais do que o assassinato sem ata. A repetição do advérbio é o martelo. A proporção é o tema, e ele a quebra.",
    ),
    n(
      "circle",
      "Só o perdoado poderia contar.",
      "«Esse homem, talvez, pudesse contar» é o condicional mais triste da página. A testemunha completa não existe, porque o perdão não veio. «Talvez» guarda uma vaga. O relato que lemos ocupa o lugar dela.",
    ),
  ],
  p149: [
    n(
      "underline",
      "A regra cede por medo do general.",
      "«Porque de repente ele pergunta, e o senhor não está» justifica o fumo com o pânico da ausência. A exceção nasce do cargo, não da bondade. O criado imagina a bronca e abre a porta.",
    ),
    n(
      "circle",
      "A topografia é um segredo.",
      "«Eis aqui, debaixo da escada, uma porta» aponta com o corpo. O lugar do proibido é concreto: escada, porta. A frase muda de tom, de moral para planta da casa. Ele conhece o cantinho.",
    ),
    n(
      "sideline",
      "O postigo salva o regulamento.",
      "«À direita um quartinho», «só abra o postigo», «porque não é da regra». Três instruções, e a última pede desculpa. O fumo cabe se a fumaça sair. A casa negocia com o próprio regulamento.",
    ),
  ],
  p150: [
    n(
      "highlight",
      "O outro homem entra com papéis.",
      "«De repente» corta o caminho do fumo. Um moço, papéis na mão: Gânia chega como função antes do nome. A frase é limpa, de narrador que muda de cena sem aviso. O príncipe não chegou a sair.",
    ),
    n(
      "underline",
      "O casaco de peles tem quem o tire.",
      "«Pôs-se a tirar-lhe o casaco» marca o serviço que o príncipe não recebeu. A pele é o contrário do capuz. O gesto do camareiro diz a hierarquia sem adjetivo. Um entra servido; o outro entrou só.",
    ),
    n(
      "circle",
      "O olhar de soslaio é o primeiro dado.",
      "«Olhou de soslaio» não é apresentação. É avaliação rápida, de quem já foi avisado no sussurro que ainda não lemos. O príncipe vira objeto antes de ser nome. O narrador guarda o nome para depois.",
    ),
  ],
  p152: [
    n(
      "sideline",
      "A curiosidade vence o relatório.",
      "Ele ouvia «com atenção» e olhava «com muita curiosidade», até «deixar de ouvir». O particípio «impaciente» fecha. O príncipe interessa mais do que o recado. Gânia escolhe o enigma no meio do ofício.",
    ),
  ],
  p153: [
    n(
      "underline",
      "A amabilidade é o primeiro dado, e o narrador desconfia.",
      "«Extremamente amável e polido» carrega o advérbio demais. O narrador já desconfia do tom. A pergunta do nome vem embrulhada numa cortesia que a antecâmara não usou com o fardel. O excesso é o caráter.",
    ),
  ],
  p155: [
    n(
      "circle",
      "A memória trabalha enquanto ele ouve.",
      "«Nesse meio-tempo» põe Gânia em outra cena, interna. «Parecia recordar» não diz o quê: a carta, o nome Míchkin, o boato. O narrador vê o esforço e não abre o arquivo. A reticência é dele.",
    ),
  ],
  p158: [
    n(
      "highlight",
      "A pergunta confirma o endereço.",
      "«O senhor vem a sua excelência?» já sabe a resposta e a formaliza. «Sua excelência» devolve o general ao centro. A cortesia de Gânia é também um encaminhamento. Ele toma o caso.",
    ),
    n(
      "underline",
      "«Já» e as reticências.",
      "«Eu anuncio já...» promete velocidade e não termina. As reticências escondem a condição que virá. O advérbio acalma o príncipe e reserva o porém. A frase é de quem já decidiu o trajeto.",
    ),
    n(
      "circle",
      "O general é um instante.",
      "«Ele vai ficar livre num instante» fala do poder como de uma agenda. O sujeito «ele» não precisa de nome. A casa inteira entende. O príncipe é posto na escala de um minuto.",
    ),
    n(
      "sideline",
      "O «só que» é a verdadeira frase.",
      "«Só que o senhor...» hesita exatamente onde o aspecto volta. As reticências repetem o embaraço do criado, agora em boca mais fina. Gânia não diz «fardel». Deixa o corpo do outro no vazio.",
    ),
    n(
      "bracket",
      "A recepção é o degrau.",
      "«Faria bem em passar, por enquanto, à recepção» é conselho e é ordem. «Por enquanto» não promete a sala. «Faria bem» finge opção. O príncipe sobe um degrau e continua fora.",
    ),
    n(
      "highlight",
      "O tom muda sem aviso.",
      "«Voltou-se ele, severo, para o camareiro» parte a mesma fala em dois públicos. Com o príncipe, a seda; com o criado, a severidade. O narrador marca o giro. O caráter cabe nesse advérbio.",
    ),
  ],
  p161: [
    n(
      "circle",
      "A ordem chega antes do corpo.",
      "«Entre aqui!» é o general ainda invisível. O imperativo curto corta o «você está aí, Gânia?». A casa se resume numa voz de gabinete. O capítulo empurra o príncipe para dentro com duas palavras.",
    ),
  ],
};

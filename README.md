# MachineSimulation

Sistema de simulação online das máquinas de tratamento da LS do Brasil.

Simulações das interfaces de operação (IHM TwinCAT / TE2000) para uso em treinamento.
**Tudo roda no navegador**: não há servidor, não há TwinCAT, não há CLP e nenhum comando
sai da máquina de quem acessa.

Publicado em GitHub Pages a partir da raiz deste repositório.

---

## Como funciona

O `TcHmiFramework.js` normalmente conversa com o **TwinCAT HMI Server** por duas portas:

1. `GET /Config/ServerState/v2` — via `XMLHttpRequest`
2. um **WebSocket** na mesma origem, por onde trafega todo o protocolo de símbolos

O GitHub Pages serve apenas arquivos estáticos e não pode atender nenhuma das duas. Por isso o
simulador **substitui as duas portas dentro da própria página** ([web/sim.js](web/sim.js)):
troca `window.XMLHttpRequest` e `window.WebSocket` por implementações locais que respondem ao
framework como o servidor real responderia.

Tudo que o servidor faria acontece em JavaScript, no cliente:

| Arquivo | Papel |
| :--- | :--- |
| [nucleo/esquema.js](nucleo/esquema.js) | Schemas de tipo: qual o tipo de um símbolo e qual o valor neutro dele |
| [nucleo/estado.js](nucleo/estado.js) | Armazém de valores, leitura e escrita por caminho, persistência |
| `maquinas/<id>/logica.js` | **Lógica do CLP emulada**, uma por máquina (ver aviso abaixo) |
| [nucleo/protocolo.js](nucleo/protocolo.js) | Protocolo do TcHmi Server: licença, definições, símbolos, inscrições |
| [web/sim.js](web/sim.js) | Liga o núcleo ao navegador e instala as duas substituições |
| [web/moldura.html](web/moldura.html) | Página que exibe a IHM dentro da foto do tablet |

O estado de cada pessoa fica no `localStorage` do navegador dela. Ninguém interfere em ninguém,
e abrir a simulação com `?reset=1` devolve tudo ao cenário inicial.

---

## ⚠️ Sobre `maquinas/<id>/logica.js`

Cada máquina tem a sua: o CLP de cada modelo é um software diferente, e nada de uma serve
para a outra. Esses arquivos são **cópias, em JavaScript, de lógica que roda no CLP**.

Na **LS-B130**, transcrita de:

- `POUs^Recipes^RecipesLogic` e suas ações (`RecipeValidation`, `RecipeNameDuplicate`,
  `TimeCalculation`, `LiquidsList`, `PowdersList`)
- `POUs^Start` (Ladder) — marcha, pré-marcha e comandos de lote
- `POUs^System^Alarms`, região "Alarme do header" — a mensagem do topo da tela

A marcha segue a sequência real da máquina: **passar para automático → carregar um lote →
apertar Marcha**, com 3 s de pré-marcha antes de `RunMode` subir, quando os botões de comando
aparecem. Apertar Marcha sem lote não faz nada, igual à máquina. `GeneralEMG` e
`AirPressureOK` são TRUE quando está tudo OK; quando `GeneralEMG` cai, o CLP derruba o modo
automático.

Na **LS-B300 DUO**, transcrita de `POU^Inicio` (Ladder) — marcha, pré-marcha de 3 s e carga
de lote. O CLP dela é outro software, em espanhol, sem nada em comum com o da B130.

Como há temporizador, o simulador roda um **scan periódico de 200 ms** (`protocolo.scan()`),
não só quando alguém clica.

A faixa no topo da tela (`EventText`) mostra `Alarms.HeaderText`, e `Alarms.HeaderTextValue`
define a cor: **0 deixa cinza** (informativo), qualquer outro valor **pinta de vermelho**. A
cadeia de 16 mensagens é a mesma do CLP, na mesma ordem, dirigida pelas mesmas variáveis —
para ver um alarme, derrube a condição em `valores.js` (há exemplos comentados lá).

**Se alguém alterar o ST no projeto do CLP, esse arquivo fica desatualizado em silêncio.**
Ele existe para que o treinamento se comporte como a máquina; nunca é fonte da verdade.
Ao mexer na lógica de receitas do CLP, revise aqui também.

---

## Moldura do tablet

Cada máquina abre em `<id>/index.html`, que mostra a IHM **dentro da foto do tablet real**
(na LS-B130, um Zebra ET40 10"). A IHM em si fica em `<id>/hmi.html`, no mesmo nível de pasta
para que os caminhos relativos dela continuem valendo, e é carregada num `<iframe>`.

O projeto TwinCAT usa `scaleMode: "None"`, ou seja, a IHM **não se escala sozinha**: numa
janela maior ela reflui e mostra um layout que não existe na máquina. Por isso o iframe é
fixado em **1280×800** (a resolução real do tablet) e quem escala é a moldura, com um
`transform: scale()` uniforme. A proporção nunca distorce, e o aluno vê exatamente a tela
da máquina nos dois modos:

- **Tablet** — a IHM no vão da tela da foto. O retângulo da tela foi medido pixel a pixel e
  está em `maquinas/<id>/maquina.json`, em porcentagem da imagem.
- **Tela cheia** — a mesma IHM escalada para preencher a janela, sem o tablet em volta.

Abaixo de `larguraMinima` × `alturaMinima` (1200×640 na LS-B130) a moldura deixaria a IHM
minúscula, então ela some automaticamente e só resta o modo tela cheia.

> A IHM é uma tela industrial de 1280×800. Num celular ela cabe, mas fica pequena demais para
> operar de verdade — o uso previsto é em computador ou tablet.

## Gerar o site de uma máquina

Requer Node.js e, **somente para gerar**, o TE2000 HMI Engineering instalado — os namespaces de
tipo `general` e `server` não existem na pasta publicada, só o TwinCAT os tem. O site gerado não
depende de nada disso.

```bash
node ferramentas/build.js ls-b130
```

O script:

1. lê a pasta `bin/` publicada pelo XAE e a config `TcHmiSrv.Config.default.json` do projeto;
2. monta os quatro namespaces de tipo e **reescreve os `$ref` relativos para absolutos** — sem
   isso o framework resolve só uma fração dos controles;
3. copia tudo para `<id>/`, injeta os scripts do simulador antes dos scripts do framework e
   grava `<id>/sim/dados.js` com os símbolos e schemas.

A configuração de cada máquina fica em `maquinas/<id>/maquina.json` (caminhos de origem) e o
cenário fictício em `maquinas/<id>/valores.js` (produtos, receitas, consumo).

## Conferir localmente

```bash
node ferramentas/servir.js
```

Serve a raiz do repositório em `http://127.0.0.1:8125/` exatamente como o Pages faria — apenas
arquivos, sem nenhuma lógica de servidor. Se funcionar aqui, funciona publicado.

## Adicionar uma máquina nova

1. Crie `maquinas/<id>/maquina.json` e `maquinas/<id>/valores.js`.
   Para a moldura, acrescente a seção `tablet` com a foto e o retângulo da tela em %
   (sem ela, a IHM vira a página principal, sem moldura).
2. Rode `node ferramentas/build.js <id>`.
3. Acrescente uma entrada no array `MAQUINAS` em [index.html](index.html).

---

## Máquinas de IHM não-web: o percurso

Nem toda IHM nossa é web. A **LS-B18** foi feita em **Vijeo Designer**, cujo projeto é
um binário fechado: não existe HTML para servir, nem variáveis para simular. Ela entra
na plataforma como **percurso**: imagens reais das telas, com áreas clicáveis por cima.
A navegação é fiel; os valores ficam parados.

```
maquinas/ls-b18/
  maquina.json     tipoSimulacao: "percurso" + a moldura do painel
  telas.json       as telas, o menu lateral e as áreas clicáveis
  telas/*.png      as telas capturadas, em 806x606
  painel.jpg       foto do Magelis HMIGTO6310, usada como moldura
  maquina.jpg      retrato da máquina para o card do portal
```

Gere com `node ferramentas/build-percurso.js ls-b18`. O script recusa publicar um mapa
quebrado: confere se a tela inicial tem imagem, se toda área aponta para uma tela que
existe e se todo arquivo declarado está na pasta.

### Como as telas foram capturadas

**Do simulador rodando, não do editor.** Com o projeto aberto no simulador do Vijeo e
ligado ao CLP simulado, a janela `Vijeo-Designer Runtime` é trazida para a frente,
fotografada pela área cliente e navegada por clique — conferindo a cada passo, pela
diferença de pixels, se a tela mudou de verdade.

Duas coisas a saber antes de repetir isso:

**O clique tem de ser real.** O Vijeo desenha numa janela filha MFC que ignora
`PostMessage`, tanto na janela principal quanto na filha. Só o clique sintético
funciona — ou seja, ele move o cursor e toma conta da máquina enquanto roda.

**Nem toda tela tem o menu lateral.** As telas de receita e a caixa adicional são
modais: saem por `return`, pelo X do canto ou por `Go back`. Clicar no menu nelas não
faz nada, e a captura seguinte sai errada sem avisar. Por isso o roteiro confere o
destino a cada passo.

O caminho alternativo, pelo editor (`Telas Base` → botão direito → **Report** →
**Single Panel Per Page** → imprimir em PDF), também sai na resolução nativa, mas tem
dois defeitos: compõe as telas mestre por cima — a tarja de emergência e os avisos de
dosagem saem *queimados*, cobrindo 29% da imagem e tapando o que está embaixo — e mostra
marcadores (`AaBbCcDd`, `123456`) no lugar dos valores. Em execução a tela mestre só
aparece quando o evento dispara, e os valores são os reais.

As coordenadas das áreas em `telas.json` estão em **porcentagem** da tela, para não
dependerem da escala em que a página desenha.

## Máquinas Rockwell: telas vetoriais + CLP emulado

A **LS-B18 Corteva** é a primeira máquina Rockwell da plataforma: CLP Studio 5000
e IHM FactoryTalk View ME. Nenhum software Rockwell foi usado, e não pode ser —
o curso roda no navegador de quem faz o treinamento.

As telas **não são capturas**. São redesenhadas em SVG a partir da definição
vetorial do próprio projeto, e ficam vivas: cada campo, cor e visibilidade vem
de uma tag, e as tags vêm do programa do CLP, que **roda de verdade**.

```
maquinas/ls-b18-corteva/
  maquina.json     tipoSimulacao: "vetorial"
  telas/*.json     as 14 telas: elementos desenháveis e ligações com o CLP
  imagens/*        as imagens do projeto, convertidas
  programa.json    o programa do CLP: 71 rotinas, 1735 blocos, na ordem de varredura
  planta.js        a parte física - a ÚNICA parte inventada
  valores.js       valores iniciais que o .ACD ainda não entrega
  _telas-gfx.md    o que há nas 33 telas que o .mer não publicou em vetorial
```

```bash
node ferramentas/rockwell/extrair-mer.js <arquivo.mer> ls-b18-corteva   # as telas
node ferramentas/rockwell/extrair-acd.js <arquivo.ACD> ls-b18-corteva   # o CLP
node ferramentas/build-vetorial.js ls-b18-corteva

# o que ha nas telas que o .mer nao publicou em vetorial
node ferramentas/rockwell/inventario-gfx.js <arquivo.mer> ls-b18-corteva
```

### Como os arquivos foram abertos

O `.mer` é um documento composto OLE2 cujos fluxos usam um **LZ77 próprio da
Rockwell**, sem documentação pública. O formato saiu comparando
`Datos Lote.strn`, que por sorte existe comprimido e cru dentro do mesmo
arquivo: com o par em mãos a decodificação fecha **byte a byte**. O 5º byte de
cada bloco diz se o conteúdo está comprimido ou guardado cru, o que dispensa
qualquer heurística de assinatura.

O `.ACD` é mais simples do que parece: tem uma tabela de regiões **no fim** do
arquivo, e cada região é **gzip comum**. O que não é simples é a ordem: o texto
dos rungs está embaralhado na gravação, e a ordem de varredura vem de uma lista
ligada em `RegnLink.Idx`. Sem ela, latch/unlatch e JMP dão resultado errado.

Duas descobertas fizeram a diferença:

- **O byte em `+0x302` do registro de uma tag diz se ela é parâmetro de AOI.**
  Sem isso, casar a chamada `EV_MonoEstable(valvula, PE, ZH, ZL, 2000, Y, STT, CNT)`
  com os parâmetros certos é chute. Com isso, a contagem bate exatamente nos
  **17 AOIs**, de 1 a 48 parâmetros cada.
- **Regiões vazias contam.** Descartá-las desloca o índice de todos os blocos
  seguintes da rotina.

### Abrindo o `.gfx`, o formato nativo das telas

Das 47 telas do projeto, só 14 saíram em XAML. O motivo estava no
`Raml/manifest.xml`: ele lista **exatamente essas 14**, todas com
`AddedToRAMLZip=true`, e as outras 33 não aparecem nele. Não ficaram de fora
por barreira técnica — ficaram porque **não foram marcadas para o cliente web**
quando o `.mer` foi gerado.

As 33 restantes só existem como `.gfx`, que é serialização MFC (`CArchive`) sem
formato publicado. Usando as 14 telas que existem nos **dois** formatos como
pedra de Roseta, o leitor em `ferramentas/rockwell/gfx.js` recupera:

| O quê | Acerto | Medido contra |
| :--- | ---: | :--- |
| nome de cada controle | 100% | 365 elementos, byte a byte |
| posição e tamanho | 99,7% | 364 de 365 |
| tipo do controle | — | vem do nome que o FactoryTalk gera sozinho |
| tags do CLP da tela | 100% | 236 tags, todas reais |

O retângulo aparece de três formas, e foi preciso as três:

- na maioria dos controles, 15 bytes antes do nome, em 16 bits;
- nos **textos**, entra uma cadeia de ligação entre o retângulo e o nome, e a
  distância deixa de ser fixa — mas logo depois do retângulo vem sempre um tag
  de objeto MFC (`0x80NN`), e é ele que ancora a busca para trás;
- nas **imagens**, o retângulo é de 32 bits e vem *depois* do nome, precedido de
  um zero e de um código pequeno.

As duas primeiras regras nunca erraram quando deram resposta. A terceira errou
uma vez em 365.

As tags só apareceram depois de descobrir que a cadeia de ligação usa **prefixo
de tamanho de 16 bits**, enquanto o nome do controle usa 8. Com o leitor
procurando só o prefixo de 8, toda tela reportava zero tags — o número estava
errado, não vazio.

### Por que isso vira inventário, e não tela navegável

O que o `.gfx` **não** entrega é a ligação entre cada controle e a tag dele. A
ordem das cadeias no arquivo não acompanha a ordem dos elementos: testado contra
o XAML, a atribuição acerta 1 de 255 tags e 0 de 271 legendas. Cor e fonte estão
lá, como RGB0, mas num bloco compartilhado longe do elemento.

Dá para desenhar as telas com os controles no lugar certo. Mas ligados na tag
errada — e uma tela em que o aluno aperta um botão e a máquina faz outra coisa é
pior do que tela nenhuma. Por isso o resultado sai em
`maquinas/<id>/_telas-gfx.md`: **o que existe em cada tela que faltou**, com
3263 controles posicionados e 1212 tags, sem fingir que é a tela.

E ela já serviu para conferir a simulação. A tela "Receita em Processo" revela o
registro de receita inteiro — nome, dose, ordem, tempo de injeção, demora,
velocidade do aspersor por linha, mais homogeneização e descarga — e bate com os
47 membros do tipo `RECETA` no `.ACD`: o formato que `valores.js` usa está
certo, só os números é que são estimados.

### O que roda, e o que é invenção

`ladder.js` não é transcrição: é um **interpretador**. O programa continua sendo
o do CLP; o que foi escrito uma vez só é o significado de cada instrução — 45
tipos, das comuns (XIC, OTE, MOV, TON) às de bloco funcional (SEL, SETD, MVMT,
OSRI) e ao PID. Zero instruções ignoradas.

`planta.js` **é a parte inventada**, e está marcada como tal. Um CLP sozinho não
faz nada: ele lê sensores, e aqui não há nenhum. As realimentações se montam
sozinhas a partir das chamadas de AOI que o extrator gravou — **29 válvulas, 13
motores e 9 inversores**, sem lista escrita à mão. O resto (semente, vazão) é
aproximação assumida.

A balança **não** é modelada: o próprio CLP tem a rotina
`MainProgram.SimulacionPeso`, que a fabricante usa para comissionar sem
semente. Deixar a dela trabalhar sai mais fiel.

### O que já se comporta como a máquina

Carregar lote → Marcha: sai o aviso acústico, corre a pré-marcha de 3 s,
`Run_Serv` sobe e os botões de comando aparecem na tela — eles estavam
escondidos porque as expressões de visibilidade exigem a máquina rodando.

Com Início, a máquina entra em **produção contínua**:

```
pesa até 204 kg  →  corta o grosso em 180, passa ao fino  →  descarrega no tambor
   →  dosa a L1 até 0,65 L  →  passa para a L2 (0,34 L)  →  passa para a L3 (0,16 L)
   →  próxima batelada
```

A ordem das linhas e a quantidade de cada uma saem da **receita**, que o CLP copia
de `RECETARIO[Indice_RecetaEnProceso]` para `RecetaEnProceso`. O alvo de cada
dose é o próprio CLP que calcula, no bloco funcional do `Control_Liquido`:

```
litros = (PesoSemilla / 100) × (Dosis / 1000) × (1 − Offset)
```

e a dose fecha quando o **medidor de vazão** passa desse alvo. É o medidor que
encerra a injeção e libera a próxima linha — não um temporizador.

E quando falta alguma coisa, a máquina se recusa, como deve. Ela não partia
porque as chaves de liberação estavam em zero; não carregava lote porque
`kg_a_Procesar` era zero, o que faz `Total_Procesado >= kg_a_Procesar` valer de
saída e acionar `Fin_Lote`; e não descarregava enquanto as três linhas da receita
não estivessem sem alarme.

### O que o interpretador precisou aprender

Cinco coisas que não se adivinham, e que erradas fazem o programa rodar ao
contrário em silêncio:

- **`IRD` inverte a linha.** É como o Studio 5000 escreve o `IF` e a atribuição
  ao converter ST para ladder: `cond IRD() JMP(fim)` salta quando a condição é
  falsa. Tratando como passagem, o bloco "salvar receita" rodava quando o
  comando estava desligado, e a máquina **apagava o receituário inteiro a cada
  varredura**.
- **Entrada, saída e entrada/saída são diferentes.** No Logix só o InOut é por
  referência; entrada e saída são copiadas. O byte em `+0x302` diz qual é qual
  (100, 104, 108). Passando tudo por referência, o `ONS(T1s)` do
  `ArranqueDirecto` zerava o relógio de 1 s do programa — e os 13 motores
  entravam em falha de giro, travando a descarga.
- **A ordem dos parâmetros vem do tipo de dados**, não da coleção de tags. As
  duas discordam em `RegistrosConsumo`, onde a coleção inverteria `Totalizador`
  com `Trigger`.
- **Membro de AOI mora em `<instância>.<tipo>.<membro>`.** São 51 instâncias
  referenciadas assim de fora. Sem o nível do tipo, o AOI grava num lugar e
  quem lê procura em outro — era por isso que a dose corrigida da linha 3 nunca
  chegava.
- **Bloco funcional só calcula quando o `EnableIn` dele deixa**, e o cálculo fica
  entre `start_block` e `end_block`. Ignorando isso, o `ADD` que guarda quantos
  litros a batelada precisa recalculava a cada varredura e o alvo fugia junto
  com o totalizador: a válvula abria e nunca mais fechava.

### Limites desta máquina

- **Das 47 telas do projeto, 14 são navegáveis.** As outras 33 só existem no
  `.gfx`: 7 são rascunhos que o programador deixou no projeto (prefixo `Z`,
  `ZZZ-`, `zzz`), 19 são cópias por linha de líquido de telas que já temos, e
  **7 são desenhos únicos** — Receituário, Lista de Líquidos, Parâmetros,
  Receita em Processo, Histórico de Pesagens, Líquido L1–L6 e Líquido Circuito.
  O conteúdo das 33 está lido e documentado em `_telas-gfx.md`; navegável não
  fica, pelo motivo acima. O caminho limpo para tê-las é republicar o `.mer` no
  FactoryTalk View Studio com todos os displays marcados: aí saem em XAML e
  passam pelo mesmo extrator que já funciona.
- **Os valores iniciais das tags não são lidos do `.ACD`.** Presets de
  temporizador, constantes de calibração e receitas moram num canto do arquivo
  que ainda não deciframos. 36 dos 100 temporizadores recebem preset do próprio
  programa; o resto está estimado em `valores.js`, declarado linha a linha.
- **A receita de exemplo é inventada.** `RECETARIO[1]` traz três linhas de
  líquido com dose, ordem e tempos plausíveis, mas não é a receita do cliente —
  ela também mora nos valores iniciais que não saem do `.ACD`. A **estrutura**
  está certa, confirmada pelo tipo `RECETA` e pela tela "Receita em Processo";
  são os valores que são estimados. O botão que carrega a receita fica na tela
  de Receituário, uma das que só existem no `.gfx`, então a simulação abre com
  ela já carregada.
- O PID é um PI discreto com os mesmos ganhos e limites, não o PID do Logix.
- `MainProgram.CalculoDensidade` e `MainProgram.IO_Mapping` são código morto:
  nenhum JSR aponta para elas.

---

## Limites conhecidos

- O gerenciador de usuários do cabeçalho fica inerte (é um recurso do servidor real).
- O visualizador de PDF e as listas que leem arquivos do disco do servidor não carregam.
- O controle de diagnóstico EtherCAT avisa que não há dispositivo configurado — correto, não há.
- Valores do CLP são fictícios: vêm de `valores.js` ou do valor neutro do tipo.

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
| [nucleo/logica.js](nucleo/logica.js) | **Lógica do CLP emulada** (ver aviso abaixo) |
| [nucleo/protocolo.js](nucleo/protocolo.js) | Protocolo do TcHmi Server: licença, definições, símbolos, inscrições |
| [web/sim.js](web/sim.js) | Liga o núcleo ao navegador e instala as duas substituições |
| [web/moldura.html](web/moldura.html) | Página que exibe a IHM dentro da foto do tablet |

O estado de cada pessoa fica no `localStorage` do navegador dela. Ninguém interfere em ninguém,
e abrir a simulação com `?reset=1` devolve tudo ao cenário inicial.

---

## ⚠️ Sobre `nucleo/logica.js`

Esse arquivo é uma **cópia, em JavaScript, de lógica que roda no CLP** — transcrita de:

- `POUs^Recipes^RecipesLogic` e suas ações (`RecipeValidation`, `RecipeNameDuplicate`,
  `TimeCalculation`, `LiquidsList`, `PowdersList`)
- `POUs^Start` (Ladder) — marcha, pré-marcha e comandos de lote

A marcha segue a sequência real da máquina: **passar para automático → carregar um lote →
apertar Marcha**, com 3 s de pré-marcha antes de `RunMode` subir, quando os botões de comando
aparecem. Apertar Marcha sem lote não faz nada, igual à máquina. `GeneralEMG` e
`AirPressureOK` são TRUE quando está tudo OK; quando `GeneralEMG` cai, o CLP derruba o modo
automático.

Como há temporizador, o simulador roda um **scan periódico de 200 ms** (`protocolo.scan()`),
não só quando alguém clica.

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

## Limites conhecidos

- O gerenciador de usuários do cabeçalho fica inerte (é um recurso do servidor real).
- O visualizador de PDF e as listas que leem arquivos do disco do servidor não carregam.
- O controle de diagnóstico EtherCAT avisa que não há dispositivo configurado — correto, não há.
- Valores do CLP são fictícios: vêm de `valores.js` ou do valor neutro do tipo.

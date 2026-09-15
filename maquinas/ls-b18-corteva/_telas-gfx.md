# Telas que só existem no `.gfx`

Gerado por `ferramentas/rockwell/inventario-gfx.js`. É um **inventário**, não
uma tela navegável — o porquê está no cabeçalho de `ferramentas/rockwell/gfx.js`.

O nome de cada controle e a posição dele saem do binário. O tipo vem do nome,
que o FactoryTalk gera sozinho. As tags são as que a tela inteira toca: o
arquivo não diz qual controle usa qual.

| Tela | Controles | Tags do CLP | Composição |
| :--- | ---: | ---: | :--- |
| Calibra Balanza Tk L3 | 16 | 5 | 7 texto, 3 forma, 2 numero, 2 botao, 1 imagem, 1 navegacao |
| Calibra Balanza Tk L4 | 16 | 5 | 7 texto, 3 forma, 2 numero, 2 botao, 1 imagem, 1 navegacao |
| Calibra Balanza Tk L5 | 16 | 5 | 7 texto, 3 forma, 2 numero, 2 botao, 1 imagem, 1 navegacao |
| Calibra Balanza Tk L6 | 16 | 5 | 7 texto, 3 forma, 2 numero, 2 botao, 1 imagem, 1 navegacao |
| Calibra Liquido 2 | 66 | 30 | 27 texto, 16 numero, 10 forma, 5 grupo, 3 botao, 2 indicador, 1 imagem, 1 texto_valor, 1 navegacao |
| Calibra Liquido 3 | 66 | 30 | 27 texto, 16 numero, 10 forma, 5 grupo, 3 botao, 2 indicador, 1 imagem, 1 texto_valor, 1 navegacao |
| Calibra Liquido 4 | 66 | 30 | 27 texto, 16 numero, 10 forma, 5 grupo, 3 botao, 2 indicador, 1 imagem, 1 texto_valor, 1 navegacao |
| Calibra Liquido 5 | 66 | 30 | 27 texto, 16 numero, 10 forma, 5 grupo, 3 botao, 2 indicador, 1 imagem, 1 texto_valor, 1 navegacao |
| Calibra Liquido 6 | 66 | 31 | 27 texto, 16 numero, 10 forma, 5 grupo, 3 botao, 2 indicador, 1 imagem, 1 texto_valor, 1 navegacao |
| Historia pesajes | 36 | 20 | 20 numero, 12 texto, 2 forma, 1 grupo, 1 navegacao |
| Liquido Circuito 2 | 22 | 17 | 11 navegacao, 4 desconhecido, 2 forma, 2 texto, 1 imagem, 1 indicador, 1 grupo |
| Liquido Circuito 3 | 22 | 17 | 11 navegacao, 4 desconhecido, 2 forma, 2 texto, 1 imagem, 1 indicador, 1 grupo |
| Liquido Circuito 4 | 22 | 17 | 11 navegacao, 4 desconhecido, 2 forma, 2 texto, 1 imagem, 1 indicador, 1 grupo |
| Liquido Circuito 5 | 22 | 17 | 11 navegacao, 4 desconhecido, 2 forma, 2 texto, 1 imagem, 1 indicador, 1 grupo |
| Liquido Circuito 6 | 22 | 17 | 11 navegacao, 4 desconhecido, 2 forma, 2 texto, 1 imagem, 1 indicador, 1 grupo |
| Liquido L1 | 196 | 62 | 78 forma, 28 imagem, 25 botao, 23 texto, 22 grupo, 12 navegacao, 7 numero, 1 indicador |
| Liquido L2 | 196 | 62 | 78 forma, 28 imagem, 25 botao, 23 texto, 22 grupo, 12 navegacao, 7 numero, 1 indicador |
| Liquido L3 | 196 | 62 | 78 forma, 28 imagem, 25 botao, 23 texto, 22 grupo, 12 navegacao, 7 numero, 1 indicador |
| Liquido L4 | 196 | 62 | 78 forma, 28 imagem, 25 botao, 23 texto, 22 grupo, 12 navegacao, 7 numero, 1 indicador |
| Liquido L5 | 196 | 59 | 78 forma, 28 imagem, 25 botao, 23 texto, 22 grupo, 12 navegacao, 7 numero, 1 indicador |
| Liquido L6 | 196 | 67 | 78 forma, 28 imagem, 25 botao, 23 texto, 22 grupo, 12 navegacao, 7 numero, 1 indicador |
| Liquido circuito 1 | 22 | 15 | 11 navegacao, 4 desconhecido, 2 forma, 2 texto, 1 imagem, 1 indicador, 1 grupo |
| Lista Liquidos | 137 | 124 | 60 botao, 40 numero, 20 texto_valor, 7 texto, 7 navegacao, 2 forma, 1 imagem |
| Parametros | 41 | 15 | 21 numero, 14 texto, 2 forma, 1 imagem, 1 grupo, 1 botao, 1 navegacao |
| Receta en proceso | 71 | 41 | 34 numero, 19 texto, 8 forma, 7 texto_valor, 2 navegacao, 1 imagem |
| Recetario | 91 | 6 | 34 numero, 32 texto, 10 navegacao, 7 texto_valor, 3 forma, 3 botao, 1 imagem, 1 indicador |

Fora da tabela, 7 telas com prefixo `Z`, `ZZZ-` ou `zzz`: são
versões antigas que o programador guardou dentro do projeto.

## Calibra Balanza Tk L3

Leva para: Liquido L2.

```
forma        Polygon4                        1,   2  1277x 76
imagem       Image4                       1133,  14   143x 63
texto        Text9                         333,  18   548x 42
forma        Polygon3                     1133,  78   144x718
forma        Polygon1                      252, 142   660x551
numero       NumericDisplay1               505, 193   120x 48
texto        Text16                        628, 202    33x 29
numero       NumericInputCursorPoint1      510, 326   113x 36
texto        Text2                         310, 331   103x 25
texto        Text5                         632, 337    21x 18
texto        Text3                         310, 410   265x 25
navegacao    GotoDisplayButton2           1137, 444   133x 62
botao        MomentaryPushButton1          697, 475   120x 48
texto        Text4                         310, 489   241x 25
botao        MomentaryPushButton2          697, 554   120x 48
texto        Text6                         310, 568   276x 25
```

Tags do CLP que esta tela usa (5):

```
MainProgram.Cmd_Calib_Tk_L2
MainProgram.Cmd_Cero_Tk_L3
MainProgram.Cmd_LPatron_Tk_L3
MainProgram.Peso_Patron_Tk_L3
MainProgram.Peso_Tk_L3
```

## Calibra Balanza Tk L4

Leva para: Liquido L2.

```
forma        Polygon4                        1,   2  1277x 76
imagem       Image4                       1133,  14   143x 63
texto        Text9                         333,  18   548x 42
forma        Polygon3                     1133,  78   144x718
forma        Polygon1                      252, 142   660x551
numero       NumericDisplay1               505, 193   120x 48
texto        Text16                        628, 202    33x 29
numero       NumericInputCursorPoint1      510, 326   113x 36
texto        Text2                         310, 331   103x 25
texto        Text5                         632, 337    21x 18
texto        Text3                         310, 410   265x 25
navegacao    GotoDisplayButton2           1137, 444   133x 62
botao        MomentaryPushButton1          697, 475   120x 48
texto        Text4                         310, 489   241x 25
botao        MomentaryPushButton2          697, 554   120x 48
texto        Text6                         310, 568   276x 25
```

Tags do CLP que esta tela usa (5):

```
MainProgram.Cmd_Calib_Tk_L4
MainProgram.Cmd_Cero_Tk_L4
MainProgram.Cmd_LPatron_Tk_L4
MainProgram.Peso_Patron_Tk_L4
MainProgram.Peso_Tk_L4
```

## Calibra Balanza Tk L5

Leva para: Liquido L2.

```
forma        Polygon4                        1,   2  1277x 76
imagem       Image4                       1133,  14   143x 63
texto        Text9                         333,  18   548x 42
forma        Polygon3                     1133,  78   144x718
forma        Polygon1                      252, 142   660x551
numero       NumericDisplay1               505, 193   120x 48
texto        Text16                        628, 202    33x 29
numero       NumericInputCursorPoint1      510, 326   113x 36
texto        Text2                         310, 331   103x 25
texto        Text5                         632, 337    21x 18
texto        Text3                         310, 410   265x 25
navegacao    GotoDisplayButton2           1137, 444   133x 62
botao        MomentaryPushButton1          697, 475   120x 48
texto        Text4                         310, 489   241x 25
botao        MomentaryPushButton2          697, 554   120x 48
texto        Text6                         310, 568   276x 25
```

Tags do CLP que esta tela usa (5):

```
MainProgram.Cmd_Calib_Tk_L5
MainProgram.Cmd_Cero_Tk_L5
MainProgram.Cmd_LPatron_Tk_L2
MainProgram.Peso_Patron_Tk_L2
MainProgram.Peso_Tk_L5
```

## Calibra Balanza Tk L6

Leva para: Liquido L2.

```
forma        Polygon4                        1,   2  1277x 76
imagem       Image4                       1133,  14   143x 63
texto        Text9                         333,  18   548x 42
forma        Polygon3                     1133,  78   144x718
forma        Polygon1                      252, 142   660x551
numero       NumericDisplay1               505, 193   120x 48
texto        Text16                        628, 202    33x 29
numero       NumericInputCursorPoint1      510, 326   113x 36
texto        Text2                         310, 331   103x 25
texto        Text5                         632, 337    21x 18
texto        Text3                         310, 410   265x 25
navegacao    GotoDisplayButton2           1137, 444   133x 62
botao        MomentaryPushButton1          697, 475   120x 48
texto        Text4                         310, 489   241x 25
botao        MomentaryPushButton2          697, 554   120x 48
texto        Text6                         310, 568   276x 25
```

Tags do CLP que esta tela usa (5):

```
MainProgram.Cmd_Calib_Tk_L6
MainProgram.Cmd_Cero_Tk_L6
MainProgram.Cmd_LPatron_Tk_L6
MainProgram.Peso_Patron_Tk_L6
MainProgram.Peso_Tk_L6
```

## Calibra Liquido 2


```
forma        Polygon2                        1,   2  1277x 76
imagem       Image2                       1133,  14   143x 63
texto        Text9                         333,  18   385x 42
forma        Polygon3                     1133,  78   144x718
texto_valor  StringDisplay1                364,  80   313x 45
numero       NumericDisplay6               744, 122    75x 26
numero       NumericDisplay4               227, 125    75x 26
texto        Text26                        824, 125    32x 18
texto        Text6                         654, 126    69x 18
texto        Text2                         105, 129   112x 18
texto        Text21                        308, 129    18x 18
numero       NumericDisplay16              744, 164    75x 26
texto        Text13                        684, 169    39x 18
numero       NumericDisplay5               227, 172    75x 26
texto        Text8                         138, 176    79x 18
texto        Text27                        308, 176    64x 18
texto        Text7                         617, 211   106x 36
numero       NumericDisplay14              744, 214    75x 26
texto        Text29                        824, 217    15x 18
numero       NumericDisplay8               227, 219    75x 26
texto        Text4                         166, 223    51x 18
texto        Text25                        308, 223    24x 18
numero       NumericInputCursorPoint2      227, 265    77x 28
texto        Text5                         150, 270    67x 18
texto        Text22                        308, 270    13x 18
texto        Text20                        383, 301    39x 36
numero       NumericDisplay7               434, 307    75x 26
texto        Text23                        512, 312    13x 18
texto        Text24                        669, 312   199x 36
botao        MaintainedPushButton1         105, 369   120x 48
botao        MaintainedPushButton2         931, 369   120x 48
botao        MomentaryPushButton1          518, 371   120x 46
forma        Polygon4                        1, 421  1134x173
navegacao    ReturntoDisplayButton1       1137, 444   133x 59
grupo        Group1                        108, 460   822x185
forma        Polygon5                      108, 460   822x185
texto        Text10                        148, 471   173x 21
texto        Text11                        460, 471   202x 33
texto        Text15                        171, 477   687x144
texto        Text17                        967, 485    97x 18
numero       NumericInputCursorPoint1      962, 509   107x 28
texto        Text12                        451, 528   220x 26
forma        Polygon1                     1002, 546    26x103
indicador    Scale1                       1004, 562    23x 75
indicador    BarGraph1                    1012, 564     7x 83
texto        Text16                        522, 579    79x 21
forma        Polygon21                     996, 649    38x  8
forma        Polygon22                     969, 655    92x  8
grupo        Group2                        979, 663    95x 23
numero       NumericDisplay1               979, 663    73x 23
texto        Text30                       1056, 665    18x 18
texto        Text14                        469, 668   143x 25
grupo        Group3                        414, 698    90x 30
numero       NumericDisplay2               414, 698    90x 30
forma        Polygon6                      414, 698    90x 30
forma        Polygon8                      506, 698    90x 30
grupo        Group5                        506, 698    90x 30
numero       NumericDisplay3               506, 698    90x 30
forma        Polygon7                      506, 698    90x 30
grupo        Group6                        598, 698    90x 30
numero       NumericDisplay9               598, 698    90x 30
texto        Text18                        206, 703   184x 25
numero       NumericDisplay10              414, 729    90x 30
numero       NumericDisplay11              506, 729    90x 30
numero       NumericDisplay12              598, 729    90x 30
texto        Text19                        206, 733   103x 25
```

Tags do CLP que esta tela usa (30):

```
M
MainProgram.AuxHs_R
MainProgram.CalibraLxP.ErrorCalibra_1_Ok
MainProgram.CalibraLxP.ErrorCalibra_2_Ok
MainProgram.CalibraLxP.ErrorCalibra_3_Ok
MainProgram.CalibraLxP.FinIniCal
MainProgram.CalibraLxP.Vol_dentroProbeta
MainProgram.Continuar_Cal_L
MainProgram.Dosis_
MainProgram.Dosis_L2_corregida
MainProgram.Error_Promedio_Cal_L
MainProgram.IniCalibrar_L2
MainProgram.Ini_Iny_L2
MainProgram.Inicio_Cal_L
MainProgram.OffsetL2
MainProgram.Pausa_Cal_LiqxPeso
MainProgram.PesoEspec[19]
MainProgram.PesoSemilla
MainProgram.RecetaEnProceso.Nombre_L2
MainProgram.RecetaEnProceso.T_inyeccion_L2
MainProgram.TablaTiempo_Cal_L[0]
MainProgram.TablaTiempo_Cal_L[1]
MainProgram.TablaTiempo_Cal_L[2]
MainProgram.TablaVol_Cal_L[0]
MainProgram.TablaVol_Cal_L[1]
MainProgram.TablaVol_Cal_L[2]
MainProgram.Tolerancia_Cal_L
MainProgram.Vaciar_Probeta
MainProgram.VolPedido_Cal_L
MainProgram.Vol_de_Probeta
```

Contas que a tela faz sobre essas tags (2):

```
B18_CORTEVA]Program:MainProgram.PesoSemilla}/100*{MainProgram.Dosis_
[B18_CORTEVA]Caudal_Nominal_Bomba_L2}*1.5 < ({MainProgram.VolPedido_Cal_L}/{M
```

## Calibra Liquido 3


```
forma        Polygon2                        1,   2  1277x 76
imagem       Image2                       1133,  14   143x 63
texto        Text9                         333,  18   385x 42
forma        Polygon3                     1133,  78   144x718
texto_valor  StringDisplay1                364,  80   313x 45
numero       NumericDisplay6               744, 122    75x 26
numero       NumericDisplay4               227, 125    75x 26
texto        Text26                        824, 125    32x 18
texto        Text6                         654, 126    69x 18
texto        Text2                         105, 129   112x 18
texto        Text21                        308, 129    18x 18
numero       NumericDisplay16              744, 164    75x 26
texto        Text13                        684, 169    39x 18
numero       NumericDisplay5               227, 172    75x 26
texto        Text8                         138, 176    79x 18
texto        Text27                        308, 176    64x 18
texto        Text7                         617, 211   106x 36
numero       NumericDisplay14              744, 214    75x 26
texto        Text29                        824, 217    15x 18
numero       NumericDisplay8               227, 219    75x 26
texto        Text4                         166, 223    51x 18
texto        Text25                        308, 223    24x 18
numero       NumericInputCursorPoint2      227, 265    77x 28
texto        Text5                         150, 270    67x 18
texto        Text22                        308, 270    13x 18
texto        Text20                        383, 301    39x 36
numero       NumericDisplay7               434, 307    75x 26
texto        Text23                        512, 312    13x 18
texto        Text24                        669, 312   199x 36
botao        MaintainedPushButton1         105, 369   120x 48
botao        MaintainedPushButton2         931, 369   120x 48
botao        MomentaryPushButton1          518, 371   120x 46
forma        Polygon4                        1, 421  1134x173
navegacao    ReturntoDisplayButton1       1137, 444   133x 59
grupo        Group1                         80, 452   822x185
forma        Polygon5                       80, 452   822x185
texto        Text15                        143, 469   687x144
texto        Text10                        148, 471   173x 21
texto        Text11                        460, 471   202x 33
texto        Text17                        967, 485    97x 18
numero       NumericInputCursorPoint1      962, 509   107x 28
texto        Text12                        451, 528   220x 26
forma        Polygon1                     1002, 546    26x103
indicador    Scale1                       1004, 562    23x 75
indicador    BarGraph1                    1012, 564     7x 83
texto        Text16                        522, 579    79x 21
forma        Polygon21                     996, 649    38x  8
forma        Polygon22                     969, 655    92x  8
grupo        Group2                        979, 663    95x 23
numero       NumericDisplay1               979, 663    73x 23
texto        Text30                       1056, 665    18x 18
texto        Text14                        469, 668   143x 25
grupo        Group3                        414, 698    90x 30
numero       NumericDisplay2               414, 698    90x 30
forma        Polygon6                      414, 698    90x 30
forma        Polygon8                      506, 698    90x 30
grupo        Group5                        506, 698    90x 30
numero       NumericDisplay3               506, 698    90x 30
forma        Polygon7                      506, 698    90x 30
grupo        Group6                        598, 698    90x 30
numero       NumericDisplay9               598, 698    90x 30
texto        Text18                        206, 703   184x 25
numero       NumericDisplay10              414, 729    90x 30
numero       NumericDisplay11              506, 729    90x 30
numero       NumericDisplay12              598, 729    90x 30
texto        Text19                        206, 733   103x 25
```

Tags do CLP que esta tela usa (30):

```
M
MainProgram.AuxHs_R
MainProgram.CalibraLxP.ErrorCalibra_1_Ok
MainProgram.CalibraLxP.ErrorCalibra_2_Ok
MainProgram.CalibraLxP.ErrorCalibra_3_Ok
MainProgram.CalibraLxP.FinIniCal
MainProgram.CalibraLxP.Vol_dentroProbeta
MainProgram.Continuar_Cal_L
MainProgram.Dosis_
MainProgram.Dosis_L3_corregida
MainProgram.Error_Promedio_Cal_L
MainProgram.IniCalibrar_L3
MainProgram.Ini_Iny_L3
MainProgram.Inicio_Cal_L
MainProgram.OffsetL3
MainProgram.Pausa_Cal_LiqxPeso
MainProgram.PesoEspec[19]
MainProgram.PesoSemilla
MainProgram.RecetaEnProceso.Nombre_L3
MainProgram.RecetaEnProceso.T_inyeccion_L3
MainProgram.TablaTiempo_Cal_L[0]
MainProgram.TablaTiempo_Cal_L[1]
MainProgram.TablaTiempo_Cal_L[2]
MainProgram.TablaVol_Cal_L[0]
MainProgram.TablaVol_Cal_L[1]
MainProgram.TablaVol_Cal_L[2]
MainProgram.Tolerancia_Cal_L
MainProgram.Vaciar_Probeta
MainProgram.VolPedido_Cal_L
MainProgram.Vol_de_Probeta
```

Contas que a tela faz sobre essas tags (2):

```
B18_CORTEVA]Program:MainProgram.PesoSemilla}/100*{MainProgram.Dosis_
[B18_CORTEVA]Caudal_Nominal_Bomba_L3}*1.5 < ({MainProgram.VolPedido_Cal_L}/{M
```

## Calibra Liquido 4


```
forma        Polygon2                        1,   2  1277x 76
imagem       Image2                       1133,  14   143x 63
texto        Text9                         333,  18   385x 42
forma        Polygon3                     1133,  78   144x718
texto_valor  StringDisplay1                364,  80   313x 45
numero       NumericDisplay6               744, 122    75x 26
numero       NumericDisplay4               227, 125    75x 26
texto        Text26                        824, 125    32x 18
texto        Text6                         654, 126    69x 18
texto        Text2                         105, 129   112x 18
texto        Text21                        308, 129    18x 18
numero       NumericDisplay16              744, 164    75x 26
texto        Text13                        684, 169    39x 18
numero       NumericDisplay5               227, 172    75x 26
texto        Text8                         138, 176    79x 18
texto        Text27                        308, 176    64x 18
texto        Text7                         617, 211   106x 36
numero       NumericDisplay14              744, 214    75x 26
texto        Text29                        824, 217    15x 18
numero       NumericDisplay8               227, 219    75x 26
texto        Text4                         166, 223    51x 18
texto        Text25                        308, 223    24x 18
numero       NumericInputCursorPoint2      227, 265    77x 28
texto        Text5                         150, 270    67x 18
texto        Text22                        308, 270    13x 18
texto        Text20                        383, 301    39x 36
numero       NumericDisplay7               434, 307    75x 26
texto        Text23                        512, 312    13x 18
texto        Text24                        669, 312   199x 36
botao        MaintainedPushButton1         105, 369   120x 48
botao        MaintainedPushButton2         931, 369   120x 48
botao        MomentaryPushButton1          518, 371   120x 46
forma        Polygon4                        1, 421  1134x173
navegacao    ReturntoDisplayButton1       1137, 444   133x 59
texto        Text10                        148, 471   173x 21
texto        Text11                        460, 471   202x 33
texto        Text17                        967, 485    97x 18
numero       NumericInputCursorPoint1      962, 509   107x 28
texto        Text12                        451, 528   220x 26
forma        Polygon1                     1002, 546    26x103
indicador    Scale1                       1004, 562    23x 75
indicador    BarGraph1                    1012, 564     7x 83
texto        Text16                        522, 579    79x 21
grupo        Group1                         90, 617   822x185
forma        Polygon5                       90, 617   822x185
texto        Text15                        153, 634   687x144
forma        Polygon21                     996, 649    38x  8
forma        Polygon22                     969, 655    92x  8
grupo        Group2                        979, 663    95x 23
numero       NumericDisplay1               979, 663    73x 23
texto        Text30                       1056, 665    18x 18
texto        Text14                        469, 668   143x 25
grupo        Group3                        414, 698    90x 30
numero       NumericDisplay2               414, 698    90x 30
forma        Polygon6                      414, 698    90x 30
forma        Polygon8                      506, 698    90x 30
grupo        Group5                        506, 698    90x 30
numero       NumericDisplay3               506, 698    90x 30
forma        Polygon7                      506, 698    90x 30
grupo        Group6                        598, 698    90x 30
numero       NumericDisplay9               598, 698    90x 30
texto        Text18                        206, 703   184x 25
numero       NumericDisplay10              414, 729    90x 30
numero       NumericDisplay11              506, 729    90x 30
numero       NumericDisplay12              598, 729    90x 30
texto        Text19                        206, 733   103x 25
```

Tags do CLP que esta tela usa (30):

```
M
MainProgram.AuxHs_R
MainProgram.CalibraLxP.ErrorCalibra_1_Ok
MainProgram.CalibraLxP.ErrorCalibra_2_Ok
MainProgram.CalibraLxP.ErrorCalibra_3_Ok
MainProgram.CalibraLxP.FinIniCal
MainProgram.CalibraLxP.Vol_dentroProbeta
MainProgram.Continuar_Cal_L
MainProgram.Dosis_
MainProgram.Dosis_L4_corregida
MainProgram.Error_Promedio_Cal_L
MainProgram.IniCalibrar_L4
MainProgram.Ini_Iny_L4
MainProgram.Inicio_Cal_L
MainProgram.OffsetL4
MainProgram.Pausa_Cal_LiqxPeso
MainProgram.PesoEspec[19]
MainProgram.PesoSemilla
MainProgram.RecetaEnProceso.Nombre_L4
MainProgram.RecetaEnProceso.T_inyeccion_L4
MainProgram.TablaTiempo_Cal_L[0]
MainProgram.TablaTiempo_Cal_L[1]
MainProgram.TablaTiempo_Cal_L[2]
MainProgram.TablaVol_Cal_L[0]
MainProgram.TablaVol_Cal_L[1]
MainProgram.TablaVol_Cal_L[2]
MainProgram.Tolerancia_Cal_L
MainProgram.Vaciar_Probeta
MainProgram.VolPedido_Cal_L
MainProgram.Vol_de_Probeta
```

Contas que a tela faz sobre essas tags (2):

```
B18_CORTEVA]Program:MainProgram.PesoSemilla}/100*{MainProgram.Dosis_
[B18_CORTEVA]Caudal_Nominal_Bomba_L4}*1.5 < ({MainProgram.VolPedido_Cal_L}/{M
```

## Calibra Liquido 5


```
forma        Polygon2                        1,   2  1277x 76
imagem       Image2                       1133,  14   143x 63
texto        Text9                         333,  18   385x 42
forma        Polygon3                     1133,  78   144x718
texto_valor  StringDisplay1                364,  80   313x 45
numero       NumericDisplay6               744, 122    75x 26
numero       NumericDisplay4               227, 125    75x 26
texto        Text26                        824, 125    32x 18
texto        Text6                         654, 126    69x 18
texto        Text2                         105, 129   112x 18
texto        Text21                        308, 129    18x 18
numero       NumericDisplay16              744, 164    75x 26
texto        Text13                        684, 169    39x 18
numero       NumericDisplay5               227, 172    75x 26
texto        Text8                         138, 176    79x 18
texto        Text27                        308, 176    64x 18
texto        Text7                         617, 211   106x 36
numero       NumericDisplay14              744, 214    75x 26
texto        Text29                        824, 217    15x 18
numero       NumericDisplay8               227, 219    75x 26
texto        Text4                         166, 223    51x 18
texto        Text25                        308, 223    24x 18
numero       NumericInputCursorPoint2      227, 265    77x 28
texto        Text5                         150, 270    67x 18
texto        Text22                        308, 270    13x 18
texto        Text20                        383, 301    39x 36
numero       NumericDisplay7               434, 307    75x 26
texto        Text23                        512, 312    13x 18
texto        Text24                        669, 312   199x 36
botao        MaintainedPushButton1         105, 369   120x 48
botao        MaintainedPushButton2         931, 369   120x 48
botao        MomentaryPushButton1          518, 371   120x 46
forma        Polygon4                        1, 421  1134x173
navegacao    ReturntoDisplayButton1       1137, 444   133x 59
grupo        Group1                         35, 454   822x185
forma        Polygon5                       35, 454   822x185
texto        Text15                         98, 471   687x144
texto        Text10                        148, 471   173x 21
texto        Text11                        460, 471   202x 33
texto        Text17                        967, 485    97x 18
numero       NumericInputCursorPoint1      962, 509   107x 28
texto        Text12                        451, 528   220x 26
forma        Polygon1                     1002, 546    26x103
indicador    Scale1                       1004, 562    23x 75
indicador    BarGraph1                    1012, 564     7x 83
texto        Text16                        522, 579    79x 21
forma        Polygon21                     996, 649    38x  8
forma        Polygon22                     969, 655    92x  8
grupo        Group2                        979, 663    95x 23
numero       NumericDisplay1               979, 663    73x 23
texto        Text30                       1056, 665    18x 18
texto        Text14                        469, 668   143x 25
grupo        Group3                        414, 698    90x 30
numero       NumericDisplay2               414, 698    90x 30
forma        Polygon6                      414, 698    90x 30
forma        Polygon8                      506, 698    90x 30
grupo        Group5                        506, 698    90x 30
numero       NumericDisplay3               506, 698    90x 30
forma        Polygon7                      506, 698    90x 30
grupo        Group6                        598, 698    90x 30
numero       NumericDisplay9               598, 698    90x 30
texto        Text18                        206, 703   184x 25
numero       NumericDisplay10              414, 729    90x 30
numero       NumericDisplay11              506, 729    90x 30
numero       NumericDisplay12              598, 729    90x 30
texto        Text19                        206, 733   103x 25
```

Tags do CLP que esta tela usa (30):

```
M
MainProgram.AuxHs_R
MainProgram.CalibraLxP.ErrorCalibra_1_Ok
MainProgram.CalibraLxP.ErrorCalibra_2_Ok
MainProgram.CalibraLxP.ErrorCalibra_3_Ok
MainProgram.CalibraLxP.FinIniCal
MainProgram.CalibraLxP.Vol_dentroProbeta
MainProgram.Continuar_Cal_L
MainProgram.Dosis_
MainProgram.Dosis_L5_corregida
MainProgram.Error_Promedio_Cal_L
MainProgram.IniCalibrar_L5
MainProgram.Ini_Iny_L5
MainProgram.Inicio_Cal_L
MainProgram.OffsetL5
MainProgram.Pausa_Cal_LiqxPeso
MainProgram.PesoEspec[19]
MainProgram.PesoSemilla
MainProgram.RecetaEnProceso.Nombre_L5
MainProgram.RecetaEnProceso.T_inyeccion_L5
MainProgram.TablaTiempo_Cal_L[0]
MainProgram.TablaTiempo_Cal_L[1]
MainProgram.TablaTiempo_Cal_L[2]
MainProgram.TablaVol_Cal_L[0]
MainProgram.TablaVol_Cal_L[1]
MainProgram.TablaVol_Cal_L[2]
MainProgram.Tolerancia_Cal_L
MainProgram.Vaciar_Probeta
MainProgram.VolPedido_Cal_L
MainProgram.Vol_de_Probeta
```

Contas que a tela faz sobre essas tags (2):

```
B18_CORTEVA]Program:MainProgram.PesoSemilla}/100*{MainProgram.Dosis_
[B18_CORTEVA]Caudal_Nominal_Bomba_L5}*1.5 < ({MainProgram.VolPedido_Cal_L}/{M
```

## Calibra Liquido 6


```
forma        Polygon2                        1,   2  1277x 76
imagem       Image2                       1133,  14   143x 63
texto        Text9                         333,  18   385x 42
forma        Polygon3                     1133,  78   144x718
texto_valor  StringDisplay1                364,  80   313x 45
numero       NumericDisplay6               744, 122    75x 26
numero       NumericDisplay4               227, 125    75x 26
texto        Text26                        824, 125    32x 18
texto        Text6                         654, 126    69x 18
texto        Text2                         105, 129   112x 18
texto        Text21                        308, 129    18x 18
numero       NumericDisplay16              744, 164    75x 26
texto        Text13                        684, 169    39x 18
numero       NumericDisplay5               227, 172    75x 26
texto        Text8                         138, 176    79x 18
texto        Text27                        308, 176    64x 18
texto        Text7                         617, 211   106x 36
numero       NumericDisplay14              744, 214    75x 26
texto        Text29                        824, 217    15x 18
numero       NumericDisplay8               227, 219    75x 26
texto        Text4                         166, 223    51x 18
texto        Text25                        308, 223    24x 18
numero       NumericInputCursorPoint2      227, 265    77x 28
texto        Text5                         150, 270    67x 18
texto        Text22                        308, 270    13x 18
texto        Text20                        383, 301    39x 36
numero       NumericDisplay7               434, 307    75x 26
texto        Text23                        512, 312    13x 18
texto        Text24                        669, 312   199x 36
botao        MaintainedPushButton1         105, 369   120x 48
botao        MaintainedPushButton2         931, 369   120x 48
botao        MomentaryPushButton1          518, 371   120x 46
forma        Polygon4                        1, 421  1134x173
navegacao    ReturntoDisplayButton1       1137, 444   133x 59
grupo        Group1                         59, 471   822x185
forma        Polygon5                       59, 471   822x185
texto        Text10                        148, 471   173x 21
texto        Text11                        460, 471   202x 33
texto        Text17                        967, 485    97x 18
texto        Text15                        122, 488   687x144
numero       NumericInputCursorPoint1      962, 509   107x 28
texto        Text12                        451, 528   220x 26
forma        Polygon1                     1002, 546    26x103
indicador    Scale1                       1004, 562    23x 75
indicador    BarGraph1                    1012, 564     7x 83
texto        Text16                        522, 579    79x 21
forma        Polygon21                     996, 649    38x  8
forma        Polygon22                     969, 655    92x  8
grupo        Group2                        979, 663    95x 23
numero       NumericDisplay1               979, 663    73x 23
texto        Text30                       1056, 665    18x 18
texto        Text14                        469, 668   143x 25
grupo        Group3                        414, 698    90x 30
numero       NumericDisplay2               414, 698    90x 30
forma        Polygon6                      414, 698    90x 30
forma        Polygon8                      506, 698    90x 30
grupo        Group5                        506, 698    90x 30
numero       NumericDisplay3               506, 698    90x 30
forma        Polygon7                      506, 698    90x 30
grupo        Group6                        598, 698    90x 30
numero       NumericDisplay9               598, 698    90x 30
texto        Text18                        206, 703   184x 25
numero       NumericDisplay10              414, 729    90x 30
numero       NumericDisplay11              506, 729    90x 30
numero       NumericDisplay12              598, 729    90x 30
texto        Text19                        206, 733   103x 25
```

Tags do CLP que esta tela usa (31):

```
M
MainProgram.AuxHs_R
MainProgram.CalibraLxP.ErrorCalibra_1_Ok
MainProgram.CalibraLxP.ErrorCalibra_2_Ok
MainProgram.CalibraLxP.ErrorCalibra_3_Ok
MainProgram.CalibraLxP.FinIniCal
MainProgram.CalibraLxP.Vol_dentroProbeta
MainProgram.Continuar_Cal_L
MainProgram.Dosis_
MainProgram.Dosis_L6_corregida
MainProgram.Error_Promedio_Cal_L
MainProgram.IniCalibrar_L6
MainProgram.Ini_Iny_L6
MainProgram.Inicio_Cal_L
MainProgram.OffsetL6
MainProgram.Pausa_Cal_LiqxPeso
MainProgram.PesoEspec[19]
MainProgram.PesoSemilla
MainProgram.RecetaEnProceso.Nombre_L6
MainProgram.RecetaEnProceso.T_inyeccion_L5
MainProgram.RecetaEnProceso.T_inyeccion_L6
MainProgram.TablaTiempo_Cal_L[0]
MainProgram.TablaTiempo_Cal_L[1]
MainProgram.TablaTiempo_Cal_L[2]
MainProgram.TablaVol_Cal_L[0]
MainProgram.TablaVol_Cal_L[1]
MainProgram.TablaVol_Cal_L[2]
MainProgram.Tolerancia_Cal_L
MainProgram.Vaciar_Probeta
MainProgram.VolPedido_Cal_L
MainProgram.Vol_de_Probeta
```

Contas que a tela faz sobre essas tags (2):

```
B18_CORTEVA]Program:MainProgram.PesoSemilla}/100*{MainProgram.Dosis_
[B18_CORTEVA]Caudal_Nominal_Bomba_L5}*1.5 < ({MainProgram.VolPedido_Cal_L}/{M
```

## Historia pesajes


```
forma        Polygon7                        1,   2  1277x 76
forma        Polygon8                     1133,  78   144x718
texto        Text11                        246, 157   135x 28
texto        Text12                        443, 157    40x 28
grupo        Group1                        245, 204   136x512
numero       NumericDisplay1               295, 204    86x 35
numero       NumericDisplay2               419, 204    88x 36
texto        Text1                         245, 206    11x 25
numero       NumericDisplay3               295, 257    86x 35
numero       NumericDisplay7               419, 257    88x 36
texto        Text2                         245, 259    11x 25
numero       NumericDisplay4               295, 310    86x 35
numero       NumericDisplay8               419, 310    88x 36
texto        Text3                         245, 312    11x 25
numero       NumericDisplay5               295, 363    86x 35
numero       NumericDisplay9               419, 363    88x 36
texto        Text4                         245, 365    11x 25
numero       NumericDisplay6               295, 416    86x 35
numero       NumericDisplay10              419, 416    88x 36
texto        Text5                         245, 418    11x 25
navegacao    ReturntoDisplayButton1       1137, 444   137x 59
numero       NumericDisplay11              295, 469    86x 35
numero       NumericDisplay12              419, 469    88x 36
texto        Text6                         245, 471    11x 25
numero       NumericDisplay13              295, 522    86x 35
numero       NumericDisplay17              419, 522    88x 36
texto        Text7                         245, 524    11x 25
numero       NumericDisplay14              295, 575    86x 35
numero       NumericDisplay18              419, 575    88x 36
texto        Text8                         245, 577    11x 25
numero       NumericDisplay15              295, 628    86x 35
numero       NumericDisplay19              419, 628    88x 36
texto        Text9                         245, 630    11x 25
numero       NumericDisplay16              295, 681    86x 35
numero       NumericDisplay20              419, 681    88x 36
texto        Text10                        245, 683    21x 25
```

Tags do CLP que esta tela usa (20):

```
MainProgram.Error_Pesada
MainProgram.Error_Pesada[00]
MainProgram.Error_Pesada[01]
MainProgram.Error_Pesada[02]
MainProgram.Error_Pesada[03]
MainProgram.Error_Pesada[04]
MainProgram.Error_Pesada[05]
MainProgram.Error_Pesada[06]
MainProgram.Error_Pesada[08]
MainProgram.Error_Pesada[09]
MainProgram.Pesadas[00]
MainProgram.Pesadas[01]
MainProgram.Pesadas[02]
MainProgram.Pesadas[03]
MainProgram.Pesadas[04]
MainProgram.Pesadas[05]
MainProgram.Pesadas[06]
MainProgram.Pesadas[07]
MainProgram.Pesadas[08]
MainProgram.Pesadas[09]
```

Contas que a tela faz sobre essas tags (1):

```
{MainProgram.Error_Pesada[07
```

## Liquido Circuito 2

Leva para: Liquido Circuito 2, Liquido circuito 1, MAIN.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         506,  13   347x 42
desconhecido Liquido circuito 6           1133,  14   143x 63
imagem       Image4                       1133,  14   143x 63
forma        Polygon3                     1133,  78   144x718
indicador    ControlListSelector1          366, 116   470x540
navegacao    GotoDisplayButton3           1140, 152   133x 62
navegacao    GotoDisplayButton8           1140, 224   133x 62
navegacao    GotoDisplayButton4           1140, 296   133x 62
desconhecido Liquido circuito 3           1140, 368   133x 62
navegacao    GotoDisplayButton2           1140, 368   133x 62
desconhecido Liquido circuito 4           1140, 440   133x 62
navegacao    GotoDisplayButton5           1140, 440   133x 62
desconhecido Liquido circuito 5           1140, 512   133x 62
navegacao    GotoDisplayButton1           1140, 512   133x 62
navegacao    ReturntoDisplayButton1       1138, 651   133x 59
grupo        Group1                        366, 672   470x 40
navegacao    MoveUpButton1                 366, 672    40x 40
navegacao    EnterButton1                  545, 672   112x 40
navegacao    MoveDownButton1               796, 672    40x 40
navegacao    GotoDisplayButton6           1138, 724   133x 62
texto        Text1                         375, 729   453x 18
```

Tags do CLP que esta tela usa (17):

```
MainProgr
MainProgram
MainProgram.Li
MainProgram.List
MainProgram.ListaLiqui
MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[01]
MainProgram.ListaLiquidos[02]
MainProgram.ListaLiquidos[03]
MainProgram.ListaLiquidos[05]
MainProgram.ListaLiquidos[06]
MainProgram.ListaLiquidos[09]
MainProgram.ListaLiquidos[14]
MainProgram.ListaLiquidos[17]
MainProgram.ListaLiquidos[18]
P
Progra
```

Contas que a tela faz sobre essas tags (16):

```
 /*S:0 {MainProgram.Li
0 - /*S:0 {MainProgram.List
0 {MainProgram.ListaLiquidos[18]}*/
05]}*/7 - /*S:0 {MainProgram.ListaLiquidos[06]}*/8 - /*S:0 {::[B18_C
A]Program:MainProgram.ListaLiquidos[15]}*/17 - /*S:0 {MainProgr
CORTEVA]Program:MainProgram.ListaLiquidos[11]}*/13 - /*S:0 {MainProgram.
ELECIONE O LIQUIDO PARA O CIRCUITO 2 E PRESSIONE "ENTER"1 - /*S:0 {P
Liquidos[19]}*/am.ListaLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[02]}*/4 - /*S:0 {MainProgram.ListaLiquidos[03]}*/5 
istaLiquidos[12]}*/14 - /*S:0 {MainProgram.ListaLiqui
m.ListaLiquidos[16]}*/18 - /*S:0 {MainProgram.ListaLiquidos[17]}*/19 - /*S
ogram:MainProgram.ListaLiquidos[00]}*/2 - /*S:0 {MainProgram.ListaLiquidos[01]}*/3 - /*S:0 
os[08]}*/10 - /*S:0 {MainProgram.ListaLiquidos[09]}*/11 - /*S:0 {::[B18_CORTE
os[13]}*/15 - /*S:0 {MainProgram.ListaLiquidos[14]}*/16 - /*S:0 {::[B18_CORTE
s - 753 x 29Program:MainProgram.ListaLiquidos[07]}*/9 - /*S:0 {MainProgram.ListaLiqui
taLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos[05]}*/7 - /*S:0 {Progra
```

## Liquido Circuito 3

Leva para: Liquido Circuito 2, Liquido circuito 1, MAIN.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         506,  13   347x 42
imagem       Image4                       1133,  14   143x 63
forma        Polygon3                     1133,  78   144x718
indicador    ControlListSelector1          366, 116   470x540
navegacao    GotoDisplayButton3           1140, 152   133x 62
navegacao    GotoDisplayButton8           1140, 224   133x 62
navegacao    GotoDisplayButton4           1140, 296   133x 62
desconhecido Liquido circuito 3           1140, 368   133x 62
navegacao    GotoDisplayButton2           1140, 368   133x 62
desconhecido Liquido circuito 4           1140, 440   133x 62
navegacao    GotoDisplayButton5           1140, 440   133x 62
desconhecido Liquido circuito 5           1140, 512   133x 62
navegacao    GotoDisplayButton1           1140, 512   133x 62
navegacao    ReturntoDisplayButton1       1138, 651   133x 59
grupo        Group1                        366, 672   470x 40
navegacao    MoveUpButton1                 366, 672    40x 40
navegacao    EnterButton1                  545, 672   112x 40
navegacao    MoveDownButton1               796, 672    40x 40
desconhecido Liquido circuito 6           1138, 724   133x 62
navegacao    GotoDisplayButton6           1138, 724   133x 62
texto        Text1                         375, 729   453x 18
```

Tags do CLP que esta tela usa (17):

```
MainProgr
MainProgram
MainProgram.Li
MainProgram.List
MainProgram.ListaLiqui
MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[01]
MainProgram.ListaLiquidos[02]
MainProgram.ListaLiquidos[03]
MainProgram.ListaLiquidos[05]
MainProgram.ListaLiquidos[06]
MainProgram.ListaLiquidos[09]
MainProgram.ListaLiquidos[14]
MainProgram.ListaLiquidos[17]
MainProgram.ListaLiquidos[18]
P
Progra
```

Contas que a tela faz sobre essas tags (16):

```
 /*S:0 {MainProgram.Li
0 - /*S:0 {MainProgram.List
0 {MainProgram.ListaLiquidos[18]}*/
05]}*/7 - /*S:0 {MainProgram.ListaLiquidos[06]}*/8 - /*S:0 {::[B18_C
A]Program:MainProgram.ListaLiquidos[15]}*/17 - /*S:0 {MainProgr
CORTEVA]Program:MainProgram.ListaLiquidos[11]}*/13 - /*S:0 {MainProgram.
ELECIONE O LIQUIDO PARA O CIRCUITO 3 E PRESSIONE "ENTER"1 - /*S:0 {P
Liquidos[19]}*/am.ListaLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[02]}*/4 - /*S:0 {MainProgram.ListaLiquidos[03]}*/5 
istaLiquidos[12]}*/14 - /*S:0 {MainProgram.ListaLiqui
m.ListaLiquidos[16]}*/18 - /*S:0 {MainProgram.ListaLiquidos[17]}*/19 - /*S
ogram:MainProgram.ListaLiquidos[00]}*/2 - /*S:0 {MainProgram.ListaLiquidos[01]}*/3 - /*S:0 
os[08]}*/10 - /*S:0 {MainProgram.ListaLiquidos[09]}*/11 - /*S:0 {::[B18_CORTE
os[13]}*/15 - /*S:0 {MainProgram.ListaLiquidos[14]}*/16 - /*S:0 {::[B18_CORTE
s - 753 x 29Program:MainProgram.ListaLiquidos[07]}*/9 - /*S:0 {MainProgram.ListaLiqui
taLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos[05]}*/7 - /*S:0 {Progra
```

## Liquido Circuito 4

Leva para: Liquido Circuito 2, Liquido circuito 1, MAIN.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         506,  13   347x 42
imagem       Image4                       1133,  14   143x 63
forma        Polygon3                     1133,  78   144x718
indicador    ControlListSelector1          366, 116   470x540
navegacao    GotoDisplayButton3           1140, 152   133x 62
navegacao    GotoDisplayButton8           1140, 224   133x 62
navegacao    GotoDisplayButton4           1140, 296   133x 62
desconhecido Liquido circuito 3           1140, 368   133x 62
navegacao    GotoDisplayButton2           1140, 368   133x 62
desconhecido Liquido circuito 4           1140, 440   133x 62
navegacao    GotoDisplayButton5           1140, 440   133x 62
desconhecido Liquido circuito 5           1140, 512   133x 62
navegacao    GotoDisplayButton1           1140, 512   133x 62
navegacao    ReturntoDisplayButton1       1138, 651   133x 59
grupo        Group1                        366, 672   470x 40
navegacao    MoveUpButton1                 366, 672    40x 40
navegacao    EnterButton1                  545, 672   112x 40
navegacao    MoveDownButton1               796, 672    40x 40
desconhecido Liquido circuito 6           1138, 724   133x 62
navegacao    GotoDisplayButton6           1138, 724   133x 62
texto        Text1                         375, 729   453x 18
```

Tags do CLP que esta tela usa (17):

```
MainProgr
MainProgram
MainProgram.Li
MainProgram.List
MainProgram.ListaLiqui
MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[01]
MainProgram.ListaLiquidos[02]
MainProgram.ListaLiquidos[03]
MainProgram.ListaLiquidos[05]
MainProgram.ListaLiquidos[06]
MainProgram.ListaLiquidos[09]
MainProgram.ListaLiquidos[14]
MainProgram.ListaLiquidos[17]
MainProgram.ListaLiquidos[18]
P
Progra
```

Contas que a tela faz sobre essas tags (16):

```
 /*S:0 {MainProgram.Li
0 - /*S:0 {MainProgram.List
0 {MainProgram.ListaLiquidos[18]}*/
05]}*/7 - /*S:0 {MainProgram.ListaLiquidos[06]}*/8 - /*S:0 {::[B18_C
A]Program:MainProgram.ListaLiquidos[15]}*/17 - /*S:0 {MainProgr
CORTEVA]Program:MainProgram.ListaLiquidos[11]}*/13 - /*S:0 {MainProgram.
ELECIONE O LIQUIDO PARA O CIRCUITO 4 E PRESSIONE "ENTER"1 - /*S:0 {P
Liquidos[19]}*/am.ListaLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[02]}*/4 - /*S:0 {MainProgram.ListaLiquidos[03]}*/5 
istaLiquidos[12]}*/14 - /*S:0 {MainProgram.ListaLiqui
m.ListaLiquidos[16]}*/18 - /*S:0 {MainProgram.ListaLiquidos[17]}*/19 - /*S
ogram:MainProgram.ListaLiquidos[00]}*/2 - /*S:0 {MainProgram.ListaLiquidos[01]}*/3 - /*S:0 
os[08]}*/10 - /*S:0 {MainProgram.ListaLiquidos[09]}*/11 - /*S:0 {::[B18_CORTE
os[13]}*/15 - /*S:0 {MainProgram.ListaLiquidos[14]}*/16 - /*S:0 {::[B18_CORTE
s - 753 x 29Program:MainProgram.ListaLiquidos[07]}*/9 - /*S:0 {MainProgram.ListaLiqui
taLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos[05]}*/7 - /*S:0 {Progra
```

## Liquido Circuito 5

Leva para: Liquido Circuito 2, Liquido circuito 1, MAIN.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         506,  13   347x 42
imagem       Image4                       1133,  14   143x 63
forma        Polygon3                     1133,  78   144x718
indicador    ControlListSelector1          366, 116   470x540
navegacao    GotoDisplayButton3           1140, 152   133x 62
navegacao    GotoDisplayButton8           1140, 224   133x 62
navegacao    GotoDisplayButton4           1140, 296   133x 62
desconhecido Liquido circuito 3           1140, 368   133x 62
navegacao    GotoDisplayButton2           1140, 368   133x 62
desconhecido Liquido circuito 4           1140, 440   133x 62
navegacao    GotoDisplayButton5           1140, 440   133x 62
desconhecido Liquido circuito 5           1140, 512   133x 62
navegacao    GotoDisplayButton1           1140, 512   133x 62
navegacao    ReturntoDisplayButton1       1138, 651   133x 59
grupo        Group1                        366, 672   470x 40
navegacao    MoveUpButton1                 366, 672    40x 40
navegacao    EnterButton1                  545, 672   112x 40
navegacao    MoveDownButton1               796, 672    40x 40
desconhecido Liquido circuito 6           1138, 724   133x 62
navegacao    GotoDisplayButton6           1138, 724   133x 62
texto        Text1                         375, 729   453x 18
```

Tags do CLP que esta tela usa (17):

```
MainProgr
MainProgram
MainProgram.Li
MainProgram.List
MainProgram.ListaLiqui
MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[01]
MainProgram.ListaLiquidos[02]
MainProgram.ListaLiquidos[03]
MainProgram.ListaLiquidos[05]
MainProgram.ListaLiquidos[06]
MainProgram.ListaLiquidos[09]
MainProgram.ListaLiquidos[14]
MainProgram.ListaLiquidos[17]
MainProgram.ListaLiquidos[18]
P
Progra
```

Contas que a tela faz sobre essas tags (16):

```
 /*S:0 {MainProgram.Li
0 - /*S:0 {MainProgram.List
0 {MainProgram.ListaLiquidos[18]}*/
05]}*/7 - /*S:0 {MainProgram.ListaLiquidos[06]}*/8 - /*S:0 {::[B18_C
A]Program:MainProgram.ListaLiquidos[15]}*/17 - /*S:0 {MainProgr
CORTEVA]Program:MainProgram.ListaLiquidos[11]}*/13 - /*S:0 {MainProgram.
ELECIONE O LIQUIDO PARA O CIRCUITO 5 E PRESSIONE "ENTER"1 - /*S:0 {P
Liquidos[19]}*/am.ListaLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[02]}*/4 - /*S:0 {MainProgram.ListaLiquidos[03]}*/5 
istaLiquidos[12]}*/14 - /*S:0 {MainProgram.ListaLiqui
m.ListaLiquidos[16]}*/18 - /*S:0 {MainProgram.ListaLiquidos[17]}*/19 - /*S
ogram:MainProgram.ListaLiquidos[00]}*/2 - /*S:0 {MainProgram.ListaLiquidos[01]}*/3 - /*S:0 
os[08]}*/10 - /*S:0 {MainProgram.ListaLiquidos[09]}*/11 - /*S:0 {::[B18_CORTE
os[13]}*/15 - /*S:0 {MainProgram.ListaLiquidos[14]}*/16 - /*S:0 {::[B18_CORTE
s - 753 x 29Program:MainProgram.ListaLiquidos[07]}*/9 - /*S:0 {MainProgram.ListaLiqui
taLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos[05]}*/7 - /*S:0 {Progra
```

## Liquido Circuito 6

Leva para: Liquido Circuito 2, Liquido circuito 1, MAIN.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         506,  13   347x 42
imagem       Image4                       1133,  14   143x 63
forma        Polygon3                     1133,  78   144x718
indicador    ControlListSelector1          366, 116   470x540
navegacao    GotoDisplayButton3           1140, 152   133x 62
navegacao    GotoDisplayButton8           1140, 224   133x 62
navegacao    GotoDisplayButton4           1140, 296   133x 62
desconhecido Liquido circuito 3           1140, 368   133x 62
navegacao    GotoDisplayButton2           1140, 368   133x 62
desconhecido Liquido circuito 4           1140, 440   133x 62
navegacao    GotoDisplayButton5           1140, 440   133x 62
desconhecido Liquido circuito 5           1140, 512   133x 62
navegacao    GotoDisplayButton1           1140, 512   133x 62
navegacao    ReturntoDisplayButton1       1138, 651   133x 59
grupo        Group1                        366, 672   470x 40
navegacao    MoveUpButton1                 366, 672    40x 40
navegacao    EnterButton1                  545, 672   112x 40
navegacao    MoveDownButton1               796, 672    40x 40
desconhecido Liquido circuito 6           1138, 724   133x 62
navegacao    GotoDisplayButton6           1138, 724   133x 62
texto        Text1                         375, 729   453x 18
```

Tags do CLP que esta tela usa (17):

```
MainProgr
MainProgram
MainProgram.Li
MainProgram.List
MainProgram.ListaLiqui
MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[01]
MainProgram.ListaLiquidos[02]
MainProgram.ListaLiquidos[03]
MainProgram.ListaLiquidos[05]
MainProgram.ListaLiquidos[06]
MainProgram.ListaLiquidos[09]
MainProgram.ListaLiquidos[14]
MainProgram.ListaLiquidos[17]
MainProgram.ListaLiquidos[18]
P
Progra
```

Contas que a tela faz sobre essas tags (16):

```
 /*S:0 {MainProgram.Li
0 - /*S:0 {MainProgram.List
0 {MainProgram.ListaLiquidos[18]}*/
05]}*/7 - /*S:0 {MainProgram.ListaLiquidos[06]}*/8 - /*S:0 {::[B18_C
A]Program:MainProgram.ListaLiquidos[15]}*/17 - /*S:0 {MainProgr
CORTEVA]Program:MainProgram.ListaLiquidos[11]}*/13 - /*S:0 {MainProgram.
ELECIONE O LIQUIDO PARA O CIRCUITO 6 E PRESSIONE "ENTER"1 - /*S:0 {P
Liquidos[19]}*/am.ListaLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos
MainProgram.ListaLiquidos[02]}*/4 - /*S:0 {MainProgram.ListaLiquidos[03]}*/5 
istaLiquidos[12]}*/14 - /*S:0 {MainProgram.ListaLiqui
m.ListaLiquidos[16]}*/18 - /*S:0 {MainProgram.ListaLiquidos[17]}*/19 - /*S
ogram:MainProgram.ListaLiquidos[00]}*/2 - /*S:0 {MainProgram.ListaLiquidos[01]}*/3 - /*S:0 
os[08]}*/10 - /*S:0 {MainProgram.ListaLiquidos[09]}*/11 - /*S:0 {::[B18_CORTE
os[13]}*/15 - /*S:0 {MainProgram.ListaLiquidos[14]}*/16 - /*S:0 {::[B18_CORTE
s - 753 x 29Program:MainProgram.ListaLiquidos[07]}*/9 - /*S:0 {MainProgram.ListaLiqui
taLiquidos[04]}*/4 - /*S:0 {MainProgram.ListaLiquidos[05]}*/7 - /*S:0 {Progra
```

## Liquido L1

Leva para: Balanza, Calibra Balanza Probeta, Calibra Balanza Tk L1, Calibra Liquido 1, Liquido L1, Liquido L2, Liquido L3, Liquido L4, Liquido L5, Lista Liquidos, MAIN.

```
forma        Polygon13                       1,   2  1277x 76
texto        Text9                         513,  13   188x 42
imagem       Image3                       1133,  14   143x 63
forma        Polygon29                       4,  76   145x720
forma        Polygon12                    1133,  78   144x718
navegacao    GotoDisplayButton12          1138,  83   133x 62
numero       NumericDisplay6               154,  91    51x 23
texto        Text8                         211,  93    26x 18
numero       NumericDisplay1               154, 122    51x 23
texto        Text14                        214, 124    16x 18
texto        Text3                         342, 124    36x 36
grupo        Group20                       246, 133    96x 39
botao        MomentaryPushButton9          246, 133    69x 39
botao        MomentaryPushButton10         266, 138    76x 29
forma        Polygon27                     520, 155   266x 13
navegacao    GotoDisplayButton8           1138, 155   133x 62
botao        MomentaryPushButton11         260, 165    65x 40
grupo        Group4                        270, 166    48x 38
forma        Polygon15                     294, 166    24x 36
forma        Polygon14                     270, 168    24x 36
imagem       Image22                       436, 173    22x 22
imagem       Image29                       833, 173    22x 22
forma        Line25                       1007, 180     7x 42
forma        Line10                        310, 181   703x  6
forma        Line5                         215, 182    61x  6
forma        Line6                         216, 183     6x436
forma        Polygon16                     275, 185    39x 19
forma        Line2                         289, 198     7x 89
forma        Polygon1                      660, 216   132x 26
texto        Text12                        681, 219    91x 18
grupo        Group12                       904, 220   186x132
imagem       Image6                        904, 220   186x129
imagem       Image1                        904, 220   170x132
forma        Polygon6                     1006, 225    10x 20
navegacao    GotoDisplayButton11          1138, 227   133x 62
grupo        Group21                       461, 235    96x 39
botao        MomentaryPushButton15         461, 235    69x 39
botao        MomentaryPushButton16         481, 240    76x 29
grupo        Group6                        660, 242   132x 44
forma        Polygon11                     660, 242   132x 44
grupo        Group7                        660, 242   132x 66
forma        Polygon35                     660, 242   132x 66
botao        MomentaryPushButton2          732, 249    54x 54
botao        MomentaryPushButton1          669, 250    54x 54
texto        Text7                         683, 252    88x 25
grupo        Group2                        996, 259    36x 41
forma        Line29                       1008, 259    10x 33
forma        Line30                       1010, 259    22x 41
grupo        Group31                         4, 265   144x 96
forma        Polygon31                       4, 265   144x 96
forma        Line27                        996, 265    10x 31
forma        Line28                       1003, 266     5x 25
texto        Text27                         61, 268    49x 18
botao        MomentaryPushButton14         476, 268    65x 40
grupo        Group5                        485, 268    48x 38
forma        Polygon18                     509, 268    24x 36
forma        Polygon17                     485, 270    24x 36
imagem       Image19                       575, 275    22x 22
imagem       Image18                       407, 276    22x 22
grupo        Group16                        41, 282    90x 75
botao        MultistatePushButton2          41, 282    90x 75
forma        Line7                         525, 282   107x  7
botao        MultistatePushButton1          41, 283    90x 75
forma        Line3                         291, 283   200x  7
forma        Line15                        626, 283     7x 91
imagem       Image13                        52, 285    68x 68
imagem       Image16                        53, 285    67x 68
forma        Polygon19                     490, 287    39x 19
navegacao    GotoDisplayButton10          1138, 299   133x 62
forma        Line4                         505, 301     6x326
texto        Text28                          6, 309    39x 18
texto        Text19                        449, 312    36x 36
botao        MomentaryPushButton13         640, 317    61x 64
imagem       Image8                        649, 325    51x109
imagem       Image7                        649, 325    51x109
imagem       Image4                        649, 325    51x109
imagem       Image23                       208, 337    22x 22
imagem       Image5                        613, 371   120x121
forma        Line1                         636, 371    75x  3
navegacao    GotoDisplayButton9           1138, 371   133x 62
forma        Polygon20                     634, 374    77x 99
texto        Text1                         381, 389    67x 36
imagem       Image20                       497, 391    22x 22
navegacao    GotoDisplayButton2              8, 410   133x 62
texto        Text11                        847, 411    82x 36
imagem       Image14                       407, 436    22x 22
forma        Line38                        414, 439     7x 91
navegacao    GotoDisplayButton7           1138, 443   133x 62
botao        MomentaryPushButton19         846, 451    89x 60
grupo        Group15                       854, 456    69x 50
forma        Ellipse4                      873, 456    50x 50
imagem       Image21                       789, 457    22x 22
forma        Polygon28                     854, 457    49x 20
forma        Line12                        535, 460     7x222
forma        Line20                        537, 461    89x  6
forma        Ellipse5                      625, 461    20x 20
forma        Line31                        724, 464   138x  7
forma        Ellipse6                      888, 471    20x 20
grupo        Group10                       307, 476   100x 39
botao        MomentaryPushButton4          307, 476    69x 39
forma        Line24                        916, 476    62x  7
forma        Line26                        974, 477     6x 65
navegacao    GotoDisplayButton3              9, 481   133x 62
botao        MomentaryPushButton7          331, 481    76x 29
texto        Text13                        988, 488    36x 36
forma        Polygon21                     597, 489   153x  5
numero       NumericDisplay5               640, 494    73x 23
texto        Text15                        720, 495    18x 18
grupo        Group9                        331, 510    48x 38
forma        Polygon25                     331, 510    24x 36
botao        MomentaryPushButton17         323, 511    65x 40
forma        Polygon23                     355, 512    24x 36
forma        Line37                        292, 525    46x  7
forma        Line39                        375, 525    46x  7
forma        Line36                        289, 526     6x247
forma        Polygon26                     335, 529    39x 19
texto        Text2                        1060, 533    42x 36
botao        MomentaryPushButton3          945, 534    65x 40
grupo        Group8                        954, 535    48x 38
forma        Polygon9                      954, 535    24x 36
forma        Polygon22                     959, 535    39x 19
imagem       Image25                       528, 537    22x 22
forma        Polygon10                     978, 537    24x 36
forma        Line35                        350, 538     7x 91
imagem       Image12                      1034, 541    22x 22
forma        Line8                         990, 548    53x  7
forma        Polygon8                      666, 550   132x 66
forma        Line22                        899, 550     6x188
forma        Line21                        900, 551    61x  6
navegacao    GotoDisplayButton5              8, 552   133x 62
texto        Text4                         701, 555    50x 18
texto        Text22                        308, 558    36x 36
grupo        Group14                       931, 569    99x 39
botao        MomentaryPushButton8          931, 569    69x 39
grupo        Group19                       405, 574   100x 39
botao        MomentaryPushButton20         405, 574    69x 39
botao        MomentaryPushButton12         954, 574    76x 29
botao        MomentaryPushButton21         429, 579    76x 29
navegacao    GotoDisplayButton6           1138, 580   133x 62
numero       NumericDisplay2               679, 583    74x 23
texto        Text5                         765, 586    31x 18
botao        MomentaryPushButton22         421, 607    65x 40
grupo        Group18                       431, 607    48x 38
forma        Polygon32                     455, 607    24x 36
forma        Polygon30                     431, 609    24x 36
botao        MomentaryPushButton23         996, 609    61x 64
grupo        Group11                       666, 615   132x126
forma        Polygon7                      666, 615   132x126
grupo        Group13                       666, 616   132x 44
forma        Polygon24                     666, 616   132x 44
grupo        Group17                       176, 618    92x117
forma        Polygon44                     207, 618    26x103
imagem       Image11                      1003, 620    51x109
imagem       Image10                      1003, 620    51x109
imagem       Image9                       1003, 620    51x109
numero       NumericInputCursorPoint2      679, 621    74x 36
forma        Line33                        474, 622    37x  7
forma        Line34                        351, 623    83x  6
forma        Polygon33                     436, 626    39x 19
texto        Text17                        689, 626    88x 25
texto        Text6                         763, 630    13x 18
indicador    Scale3                        208, 634    23x 75
imagem       Image26                       281, 635    22x 22
forma        Line32                        450, 640     7x 86
navegacao    GotoDisplayButton4           1138, 652   133x 62
texto        Text20                        408, 653    36x 36
imagem       Image24                       891, 656    22x 22
grupo        Group3                        952, 666   156x112
imagem       Image2                        952, 666   156x112
grupo        Group1                        564, 672    74x 60
forma        Polygon5                      564, 672     5x 19
texto        Text16                          7, 674   133x 48
botao        MomentaryPushButton18           7, 674   133x 48
botao        MomentaryPushButton6          737, 675    54x 54
forma        Polygon3                      569, 676    44x 10
forma        Ellipse1                      587, 676    51x 51
botao        MomentaryPushButton5          674, 676    54x 54
forma        Line19                        539, 678    27x  6
forma        Ellipse2                      595, 684    34x 34
forma        RoundedRectangle2             606, 686    13x 30
forma        Ellipse3                      608, 696     8x  8
texto        Text10                        996, 697    69x 50
imagem       Image17                       510, 712    22x 22
forma        Polygon4                      564, 713     5x 19
forma        Polygon2                      568, 718    44x 10
forma        Line11                        450, 719   117x  7
forma        Polygon45                     201, 721    38x  8
navegacao    GotoDisplayButton1           1138, 724   133x 62
forma        Polygon46                     176, 727    92x  8
numero       NumericInputCursorPoint3       62, 731    73x 38
forma        Line23                        899, 732    61x  6
numero       NumericDisplay7               182, 735    73x 23
texto        Text18                          4, 740    40x 18
imagem       Image27                       416, 759    22x 22
imagem       Image28                       751, 759    22x 22
forma        Line40                        291, 766   669x  7
```

Tags do CLP que esta tela usa (62):

```
BombaL1
Mai
MainProgram.Agitador_L1.ConfirmaM
MainProgram.Agitador_L1_2.ConfirmaM
MainProgram.AuxHs_R
MainProgram.BombaDiafrManualL1
MainProgram.CNT_A_TP1.1
MainProgram.CNT_A_TP1.2
MainProgram.CNT_A_TP1.6
MainProgram.CNT_A_TP2_L1.6
MainProgram.CNT_BDL1.1
MainProgram.CNT_BDL1.2
MainProgram.CNT_DL.1
MainProgram.CNT_DL.2
MainProgram.CNT_DL.6
MainProgram.CNT_L1.1
MainProgram.CNT_L1.2
MainProgram.CNT_L1.6
MainProgram.HMI_SecLavado_L1
MainProgram.InputBDL1.Active
MainProgram.LSL_TK_L1
MainProgram.LockOut_AgL1_2
MainProgram.LockOut_BD
MainProgram.LockOut_BDL1
MainProgram.LoteCargado
MainProgram.PU1_L1_V2.Open
MainProgram.Paso_lavado_L1
MainProgram.Peso_Tk_L1
MainProgram.STT_A_TP1.1
MainProgram.STT_A_TP1.4
MainProgram.STT_A_TP2_L1.1
MainProgram.STT_A_TP2_L1.4
MainProgram.STT_DL.5
MainProgram.STT_L1.5
MainProgram.ServOk
MainProgram.Set_Lts_Lavado_L1
MainProgram.Temperatura_L1
MainProgram.Valvula1_L1.PosAbierta
MainProgram.Valvula1_L1.PosCerrada
MainProgram.Valvula1_L1Controle.1
MainProgram.Valvula1_L1Controle.2
MainProgram.Valvula1_L1Controle.6
MainProgram.Valvula1_L1Status.5
MainProgram.Valvula2_L1.PosAbierta
MainProgram.Valvula2_L1.PosCerrada
MainProgram.Valvula2_L1Controle.1
MainProgram.Valvula2_L1Controle.2
MainProgram.Valvula2_L1Controle.6
MainProgram.Valvula2_L1Status.5
MainProgram.Valvula3_L1.PosAbierta
MainProgram.Valvula3_L1.PosCerrada
MainProgram.Valvula3_L1Controle.1
MainProgram.Valvula3_L1Controle.2
MainProgram.Valvula3_L1Controle.6
MainProgram.Valvula3_L1Status.5
MainProgram.ZH_VA1_L
MainProgram.ZH_VA_L1
MainProgram.ZL_VA1_L
MainProgram.ZL_VA_L1
MainProgram.aMa
MainProgram.aManual
Progr
```

Contas que a tela faz sobre essas tags (5):

```
B18_CORTEVA]Program:MainProgram.LockOut_AgL1_2} AND {MainProgram.aMa
B18_CORTEVA]Program:MainProgram.aManual} AND {MainProgram.LockOut_BD
BombaL1:I.OutputFreq
OT {MainProgram.ServOk}  AND  NOT {Progr
OT {MainProgram.aManual}AND {Mai
```

## Liquido L2

Leva para: Balanza, Calibra Balanza Probeta, Calibra Balanza Tk L2, Calibra Liquido 1, Liquido L1, Liquido L2, Liquido L3, Liquido L4, Liquido L5, Lista Liquidos, MAIN.

```
forma        Polygon13                       1,   2  1277x 76
texto        Text9                         513,  13   188x 42
imagem       Image3                       1133,  14   143x 63
forma        Polygon29                       4,  76   145x720
forma        Polygon12                    1133,  78   144x718
navegacao    GotoDisplayButton12          1138,  83   133x 62
numero       NumericDisplay6               154,  91    51x 23
texto        Text8                         211,  93    26x 18
numero       NumericDisplay1               154, 122    51x 23
texto        Text14                        214, 124    16x 18
texto        Text3                         342, 124    36x 36
grupo        Group20                       246, 133    96x 39
botao        MomentaryPushButton9          246, 133    69x 39
botao        MomentaryPushButton10         266, 138    76x 29
forma        Polygon27                     520, 155   266x 13
navegacao    GotoDisplayButton8           1138, 155   133x 62
botao        MomentaryPushButton11         261, 166    65x 40
grupo        Group4                        270, 166    48x 38
forma        Polygon15                     294, 166    24x 36
forma        Polygon14                     270, 168    24x 36
imagem       Image22                       436, 173    22x 22
imagem       Image29                       833, 173    22x 22
forma        Line25                       1007, 180     7x 42
forma        Line10                        310, 181   703x  6
forma        Line5                         215, 182    61x  6
forma        Line6                         216, 183     6x436
forma        Polygon16                     275, 185    39x 19
forma        Line2                         289, 198     7x 89
forma        Polygon1                      660, 216   132x 26
texto        Text12                        681, 219    91x 18
grupo        Group12                       904, 220   186x132
imagem       Image6                        904, 220   186x129
imagem       Image1                        904, 220   170x132
forma        Polygon6                     1006, 225    10x 20
navegacao    GotoDisplayButton11          1138, 227   133x 62
grupo        Group21                       461, 235    96x 39
botao        MomentaryPushButton15         461, 235    69x 39
botao        MomentaryPushButton16         481, 240    76x 29
grupo        Group6                        660, 242   132x 44
forma        Polygon11                     660, 242   132x 44
grupo        Group7                        660, 242   132x 66
forma        Polygon35                     660, 242   132x 66
botao        MomentaryPushButton2          732, 249    54x 54
botao        MomentaryPushButton1          669, 250    54x 54
texto        Text7                         683, 252    88x 25
grupo        Group2                        996, 259    36x 41
forma        Line29                       1008, 259    10x 33
forma        Line30                       1010, 259    22x 41
grupo        Group31                         4, 265   144x 96
forma        Polygon31                       4, 265   144x 96
forma        Line27                        996, 265    10x 31
forma        Line28                       1003, 266     5x 25
texto        Text27                         61, 268    49x 18
botao        MomentaryPushButton14         476, 268    65x 40
grupo        Group5                        485, 268    48x 38
forma        Polygon18                     509, 268    24x 36
forma        Polygon17                     485, 270    24x 36
imagem       Image19                       575, 275    22x 22
imagem       Image18                       407, 276    22x 22
grupo        Group16                        41, 282    90x 75
botao        MultistatePushButton2          41, 282    90x 75
forma        Line7                         525, 282   107x  7
botao        MultistatePushButton1          41, 283    90x 75
forma        Line3                         291, 283   200x  7
forma        Line15                        626, 283     7x 91
imagem       Image13                        52, 285    68x 68
imagem       Image16                        53, 285    67x 68
forma        Polygon19                     490, 287    39x 19
navegacao    GotoDisplayButton10          1138, 299   133x 62
forma        Line4                         505, 301     6x326
texto        Text28                          6, 309    39x 18
texto        Text19                        449, 312    36x 36
botao        MomentaryPushButton13         640, 317    61x 64
imagem       Image8                        645, 325    51x109
imagem       Image7                        645, 325    51x109
imagem       Image4                        645, 325    51x109
imagem       Image23                       208, 337    22x 22
imagem       Image5                        613, 371   120x121
forma        Line1                         636, 371    75x  3
navegacao    GotoDisplayButton9           1138, 371   133x 62
forma        Polygon20                     634, 374    77x 99
texto        Text1                         381, 389    67x 36
imagem       Image20                       497, 391    22x 22
navegacao    GotoDisplayButton2              8, 410   133x 62
texto        Text11                        847, 411    82x 36
imagem       Image14                       407, 436    22x 22
forma        Line38                        414, 439     7x 91
navegacao    GotoDisplayButton7           1138, 443   133x 62
botao        MomentaryPushButton19         842, 450    89x 60
grupo        Group15                       854, 456    69x 50
forma        Ellipse4                      873, 456    50x 50
imagem       Image21                       789, 457    22x 22
forma        Polygon28                     854, 457    49x 20
forma        Line12                        535, 460     7x222
forma        Line20                        537, 461    89x  6
forma        Ellipse5                      625, 461    20x 20
forma        Line31                        724, 464   138x  7
forma        Ellipse6                      888, 471    20x 20
grupo        Group10                       307, 476   100x 39
botao        MomentaryPushButton4          307, 476    69x 39
forma        Line24                        916, 476    62x  7
forma        Line26                        974, 477     6x 65
navegacao    GotoDisplayButton3              9, 481   133x 62
botao        MomentaryPushButton7          331, 481    76x 29
texto        Text13                        988, 488    36x 36
forma        Polygon21                     597, 489   153x  5
numero       NumericDisplay5               640, 494    73x 23
texto        Text15                        720, 495    18x 18
botao        MomentaryPushButton17         323, 510    65x 40
grupo        Group9                        331, 510    48x 38
forma        Polygon25                     331, 510    24x 36
forma        Polygon23                     355, 512    24x 36
forma        Line37                        292, 525    46x  7
forma        Line39                        375, 525    46x  7
forma        Line36                        289, 526     6x247
forma        Polygon26                     335, 529    39x 19
texto        Text2                        1060, 533    42x 36
botao        MomentaryPushButton3          945, 534    65x 40
grupo        Group8                        954, 535    48x 38
forma        Polygon9                      954, 535    24x 36
forma        Polygon22                     959, 535    39x 19
imagem       Image25                       528, 537    22x 22
forma        Polygon10                     978, 537    24x 36
forma        Line35                        350, 538     7x 91
imagem       Image12                      1034, 541    22x 22
forma        Line8                         990, 548    53x  7
forma        Polygon8                      666, 550   132x 66
forma        Line22                        899, 550     6x188
forma        Line21                        900, 551    61x  6
navegacao    GotoDisplayButton5              8, 552   133x 62
texto        Text4                         701, 555    50x 18
texto        Text22                        308, 558    36x 36
grupo        Group14                       931, 569    99x 39
botao        MomentaryPushButton8          931, 569    69x 39
grupo        Group19                       405, 574   100x 39
botao        MomentaryPushButton20         405, 574    69x 39
botao        MomentaryPushButton12         954, 574    76x 29
botao        MomentaryPushButton21         429, 579    76x 29
navegacao    GotoDisplayButton6           1138, 580   133x 62
numero       NumericDisplay2               679, 583    74x 23
texto        Text5                         765, 586    31x 18
grupo        Group18                       431, 607    48x 38
forma        Polygon32                     455, 607    24x 36
botao        MomentaryPushButton22         422, 608    65x 40
forma        Polygon30                     431, 609    24x 36
grupo        Group11                       666, 615   132x126
forma        Polygon7                      666, 615   132x126
grupo        Group13                       666, 616   132x 44
forma        Polygon24                     666, 616   132x 44
botao        MomentaryPushButton23        1004, 617    61x 64
grupo        Group17                       176, 618    92x117
forma        Polygon44                     207, 618    26x103
imagem       Image11                      1013, 620    51x109
imagem       Image10                      1013, 620    51x109
imagem       Image9                       1013, 620    51x109
numero       NumericInputCursorPoint2      679, 621    74x 36
forma        Line33                        474, 622    37x  7
forma        Line34                        351, 623    83x  6
forma        Polygon33                     436, 626    39x 19
texto        Text17                        689, 626    88x 25
texto        Text6                         763, 630    13x 18
indicador    Scale3                        208, 634    23x 75
imagem       Image26                       281, 635    22x 22
forma        Line32                        450, 640     7x 86
navegacao    GotoDisplayButton4           1138, 652   133x 62
texto        Text20                        408, 653    36x 36
grupo        Group3                        952, 666   156x112
imagem       Image2                        952, 666   156x112
imagem       Image24                       892, 669    22x 22
grupo        Group1                        564, 672    74x 60
forma        Polygon5                      564, 672     5x 19
texto        Text16                          7, 674   133x 48
botao        MomentaryPushButton18           7, 674   133x 48
botao        MomentaryPushButton6          737, 675    54x 54
forma        Polygon3                      569, 676    44x 10
forma        Ellipse1                      587, 676    51x 51
botao        MomentaryPushButton5          674, 676    54x 54
forma        Line19                        539, 678    27x  6
forma        Ellipse2                      595, 684    34x 34
forma        RoundedRectangle2             606, 686    13x 30
forma        Ellipse3                      608, 696     8x  8
texto        Text10                        996, 697    69x 50
imagem       Image17                       510, 712    22x 22
forma        Polygon4                      564, 713     5x 19
forma        Polygon2                      568, 718    44x 10
forma        Line11                        450, 719   117x  7
forma        Polygon45                     201, 721    38x  8
navegacao    GotoDisplayButton1           1138, 724   133x 62
forma        Polygon46                     176, 727    92x  8
numero       NumericInputCursorPoint3       62, 731    73x 38
forma        Line23                        899, 732    61x  6
numero       NumericDisplay7               182, 735    73x 23
texto        Text18                          4, 740    40x 18
imagem       Image27                       416, 759    22x 22
imagem       Image28                       751, 759    22x 22
forma        Line40                        291, 766   669x  7
```

Tags do CLP que esta tela usa (62):

```
BombaL2
Mai
MainProgram.Agitador_L2.ConfirmaM
MainProgram.Agitador_L2_2.ConfirmaM
MainProgram.AuxHs_R
MainProgram.BombaDiafrManualL2
MainProgram.CNT_A_TP2.1
MainProgram.CNT_A_TP2.2
MainProgram.CNT_A_TP2.6
MainProgram.CNT_A_TP2_L2.6
MainProgram.CNT_BDL2.1
MainProgram.CNT_BDL2.2
MainProgram.CNT_DL.1
MainProgram.CNT_DL.2
MainProgram.CNT_DL.6
MainProgram.CNT_L2.1
MainProgram.CNT_L2.2
MainProgram.CNT_L2.6
MainProgram.HMI_SecLavado_L2
MainProgram.InputBDL1.Active
MainProgram.LSL_TK_L1
MainProgram.LockOut_AgL2_2
MainProgram.LockOut_BD
MainProgram.LockOut_BDL2
MainProgram.LoteCargado
MainProgram.PU1_L2_V2.Open
MainProgram.Paso_lavado_L2
MainProgram.Peso_Tk_L2
MainProgram.STT_A_TP2.1
MainProgram.STT_A_TP2.4
MainProgram.STT_A_TP2_L2.1
MainProgram.STT_A_TP2_L2.4
MainProgram.STT_DL.5
MainProgram.STT_L2.5
MainProgram.ServOk
MainProgram.Set_Lts_Lavado_L1
MainProgram.Temperatura_L2
MainProgram.Valvula1_L2.PosAbierta
MainProgram.Valvula1_L2.PosCerrada
MainProgram.Valvula1_L2Controle.1
MainProgram.Valvula1_L2Controle.2
MainProgram.Valvula1_L2Controle.6
MainProgram.Valvula1_L2Status.5
MainProgram.Valvula2_L2.PosAbierta
MainProgram.Valvula2_L2.PosCerrada
MainProgram.Valvula2_L2Controle.1
MainProgram.Valvula2_L2Controle.2
MainProgram.Valvula2_L2Controle.6
MainProgram.Valvula2_L2Status.5
MainProgram.Valvula3_L2.PosAbierta
MainProgram.Valvula3_L2.PosCerrada
MainProgram.Valvula3_L2Controle.1
MainProgram.Valvula3_L2Controle.2
MainProgram.Valvula3_L2Controle.6
MainProgram.Valvula3_L2Status.5
MainProgram.ZH_VA1_L
MainProgram.ZH_VA_L2
MainProgram.ZL_VA1_L
MainProgram.ZL_VA_L2
MainProgram.aMa
MainProgram.aManual
Progr
```

Contas que a tela faz sobre essas tags (5):

```
B18_CORTEVA]Program:MainProgram.LockOut_AgL2_2} AND {MainProgram.aMa
B18_CORTEVA]Program:MainProgram.aManual} AND {MainProgram.LockOut_BD
BombaL2:I.OutputFreq
OT {MainProgram.ServOk}  AND  NOT {Progr
OT {MainProgram.aManual}AND {Mai
```

## Liquido L3

Leva para: Balanza, Calibra Balanza Probeta, Calibra Balanza Tk L3, Calibra Liquido 3, Liquido L1, Liquido L2, Liquido L3, Liquido L4, Liquido L5, Liquido L6, Lista Liquidos, MAIN.

```
forma        Polygon13                       1,   2  1277x 76
texto        Text9                         513,  13   188x 42
imagem       Image3                       1133,  14   143x 63
forma        Polygon29                       4,  76   145x720
forma        Polygon12                    1133,  78   144x718
navegacao    GotoDisplayButton12          1138,  83   133x 62
numero       NumericDisplay6               154,  91    51x 23
texto        Text8                         211,  93    26x 18
texto        Text16                        154, 122    51x 23
numero       NumericDisplay1               154, 122    51x 23
texto        Text14                        214, 124    16x 18
texto        Text3                         342, 124    36x 36
grupo        Group20                       246, 133    96x 39
botao        MomentaryPushButton9          246, 133    69x 39
botao        MomentaryPushButton10         266, 138    76x 29
forma        Polygon27                     520, 155   266x 13
navegacao    GotoDisplayButton8           1138, 155   133x 62
botao        MomentaryPushButton11         260, 165    65x 40
grupo        Group4                        270, 166    48x 38
forma        Polygon15                     294, 166    24x 36
forma        Polygon14                     270, 168    24x 36
imagem       Image22                       436, 173    22x 22
imagem       Image29                       833, 173    22x 22
forma        Line25                       1007, 180     7x 42
forma        Line10                        310, 181   703x  6
forma        Line5                         215, 182    61x  6
forma        Line6                         216, 183     6x436
forma        Polygon16                     275, 185    39x 19
forma        Line2                         289, 198     7x 89
forma        Polygon1                      660, 216   132x 26
texto        Text12                        681, 219    91x 18
grupo        Group12                       904, 220   186x132
imagem       Image6                        904, 220   186x129
imagem       Image1                        904, 220   170x132
forma        Polygon6                     1006, 225    10x 20
navegacao    GotoDisplayButton11          1138, 227   133x 62
grupo        Group21                       461, 235    96x 39
botao        MomentaryPushButton15         461, 235    69x 39
botao        MomentaryPushButton16         481, 240    76x 29
grupo        Group6                        660, 242   132x 44
forma        Polygon11                     660, 242   132x 44
grupo        Group7                        660, 242   132x 66
forma        Polygon35                     660, 242   132x 66
botao        MomentaryPushButton2          732, 249    54x 54
botao        MomentaryPushButton1          669, 250    54x 54
texto        Text7                         683, 252    88x 25
grupo        Group2                        996, 259    36x 41
forma        Line29                       1008, 259    10x 33
forma        Line30                       1010, 259    22x 41
grupo        Group31                         4, 265   144x 96
forma        Polygon31                       4, 265   144x 96
forma        Line27                        996, 265    10x 31
forma        Line28                       1003, 266     5x 25
texto        Text27                         61, 268    49x 18
botao        MomentaryPushButton14         477, 268    65x 40
grupo        Group5                        485, 268    48x 38
forma        Polygon18                     509, 268    24x 36
forma        Polygon17                     485, 270    24x 36
imagem       Image19                       575, 275    22x 22
imagem       Image18                       407, 276    22x 22
grupo        Group16                        41, 282    90x 75
botao        MultistatePushButton2          41, 282    90x 75
forma        Line7                         525, 282   107x  7
forma        Line3                         291, 283   200x  7
forma        Line15                        626, 283     7x 91
imagem       Image13                        52, 285    68x 68
imagem       Image16                        53, 285    67x 68
forma        Polygon19                     490, 287    39x 19
navegacao    GotoDisplayButton10          1138, 299   133x 62
botao        MultistatePushButton1          51, 301    90x 75
forma        Line4                         505, 301     6x326
texto        Text28                          6, 309    39x 18
texto        Text19                        449, 312    36x 36
botao        MomentaryPushButton13         641, 321    61x 64
imagem       Image8                        648, 325    51x109
imagem       Image7                        648, 325    51x109
imagem       Image4                        648, 325    51x109
imagem       Image23                       208, 337    22x 22
imagem       Image5                        613, 371   120x121
forma        Line1                         636, 371    75x  3
navegacao    GotoDisplayButton9           1138, 371   133x 62
forma        Polygon20                     634, 374    77x 99
texto        Text1                         381, 389    67x 36
imagem       Image20                       497, 391    22x 22
navegacao    GotoDisplayButton2              8, 410   133x 62
texto        Text11                        847, 411    82x 36
imagem       Image14                       407, 436    22x 22
forma        Line38                        414, 439     7x 91
navegacao    GotoDisplayButton7           1138, 443   133x 62
botao        MomentaryPushButton19         843, 450    89x 60
grupo        Group15                       854, 456    69x 50
forma        Ellipse4                      873, 456    50x 50
imagem       Image21                       789, 457    22x 22
forma        Polygon28                     854, 457    49x 20
forma        Line12                        535, 460     7x222
forma        Line20                        537, 461    89x  6
forma        Ellipse5                      625, 461    20x 20
forma        Line31                        724, 464   138x  7
forma        Ellipse6                      888, 471    20x 20
grupo        Group10                       307, 476   100x 39
botao        MomentaryPushButton4          307, 476    69x 39
forma        Line24                        916, 476    62x  7
forma        Line26                        974, 477     6x 65
navegacao    GotoDisplayButton3              9, 481   133x 62
botao        MomentaryPushButton7          331, 481    76x 29
texto        Text13                        988, 488    36x 36
forma        Polygon21                     597, 489   153x  5
numero       NumericDisplay5               640, 494    73x 23
texto        Text15                        720, 495    18x 18
botao        MomentaryPushButton17         323, 510    65x 40
grupo        Group9                        331, 510    48x 38
forma        Polygon25                     331, 510    24x 36
forma        Polygon23                     355, 512    24x 36
forma        Line37                        292, 525    46x  7
forma        Line39                        375, 525    46x  7
forma        Line36                        289, 526     6x247
forma        Polygon26                     335, 529    39x 19
botao        MomentaryPushButton3          947, 533    65x 40
texto        Text2                        1060, 533    42x 36
grupo        Group8                        954, 535    48x 38
forma        Polygon9                      954, 535    24x 36
forma        Polygon22                     959, 535    39x 19
imagem       Image25                       528, 537    22x 22
forma        Polygon10                     978, 537    24x 36
forma        Line35                        350, 538     7x 91
imagem       Image12                      1034, 541    22x 22
forma        Line8                         990, 548    53x  7
forma        Polygon8                      666, 550   132x 66
forma        Line22                        899, 550     6x188
forma        Line21                        900, 551    61x  6
navegacao    GotoDisplayButton5              8, 552   133x 62
texto        Text4                         701, 555    50x 18
texto        Text22                        308, 558    36x 36
grupo        Group14                       931, 569    99x 39
botao        MomentaryPushButton8          931, 569    69x 39
grupo        Group19                       405, 574   100x 39
botao        MomentaryPushButton20         405, 574    69x 39
botao        MomentaryPushButton12         954, 574    76x 29
botao        MomentaryPushButton21         429, 579    76x 29
navegacao    GotoDisplayButton6           1138, 580   133x 62
numero       NumericDisplay2               679, 583    74x 23
texto        Text5                         765, 586    31x 18
botao        MomentaryPushButton22         421, 607    65x 40
grupo        Group18                       431, 607    48x 38
forma        Polygon32                     455, 607    24x 36
forma        Polygon30                     431, 609    24x 36
botao        MomentaryPushButton23         996, 611    61x 64
grupo        Group11                       666, 615   132x126
forma        Polygon7                      666, 615   132x126
grupo        Group13                       666, 616   132x 44
forma        Polygon24                     666, 616   132x 44
grupo        Group17                       176, 618    92x117
forma        Polygon44                     207, 618    26x103
imagem       Image11                      1002, 620    51x109
imagem       Image10                      1002, 620    51x109
imagem       Image9                       1002, 620    51x109
numero       NumericInputCursorPoint2      679, 621    74x 36
forma        Line33                        474, 622    37x  7
forma        Line34                        351, 623    83x  6
forma        Polygon33                     436, 626    39x 19
texto        Text17                        689, 626    88x 25
texto        Text6                         763, 630    13x 18
indicador    Scale3                        208, 634    23x 75
imagem       Image26                       281, 635    22x 22
forma        Line32                        450, 640     7x 86
imagem       Image24                       891, 640    22x 22
navegacao    GotoDisplayButton4           1138, 652   133x 62
texto        Text20                        408, 653    36x 36
grupo        Group3                        952, 666   156x112
imagem       Image2                        952, 666   156x112
grupo        Group1                        564, 672    74x 60
forma        Polygon5                      564, 672     5x 19
botao        MomentaryPushButton18           7, 674   133x 48
botao        MomentaryPushButton6          737, 675    54x 54
forma        Polygon3                      569, 676    44x 10
forma        Ellipse1                      587, 676    51x 51
botao        MomentaryPushButton5          674, 676    54x 54
forma        Line19                        539, 678    27x  6
forma        Ellipse2                      595, 684    34x 34
forma        RoundedRectangle2             606, 686    13x 30
forma        Ellipse3                      608, 696     8x  8
texto        Text10                        996, 697    69x 50
imagem       Image17                       510, 712    22x 22
forma        Polygon4                      564, 713     5x 19
forma        Polygon2                      568, 718    44x 10
forma        Line11                        450, 719   117x  7
forma        Polygon45                     201, 721    38x  8
navegacao    GotoDisplayButton1           1138, 724   133x 62
forma        Polygon46                     176, 727    92x  8
numero       NumericInputCursorPoint3       62, 731    73x 38
forma        Line23                        899, 732    61x  6
numero       NumericDisplay7               182, 735    73x 23
texto        Text18                          4, 740    40x 18
imagem       Image27                       416, 759    22x 22
imagem       Image28                       751, 759    22x 22
forma        Line40                        291, 766   669x  7
```

Tags do CLP que esta tela usa (62):

```
BombaL3
Mai
MainProgram.Agitador_L3_2.ConfirmaM
MainProgram.AuxHs_R
MainProgram.BombaDiafrManualL3
MainProgram.CNT_A_TP2_L3.1
MainProgram.CNT_A_TP2_L3.2
MainProgram.CNT_A_TP2_L3.6
MainProgram.CNT_BDL3.1
MainProgram.CNT_BDL3.2
MainProgram.CNT_DL.1
MainProgram.CNT_DL.2
MainProgram.CNT_DL.6
MainProgram.CNT_L3.1
MainProgram.CNT_L3.2
MainProgram.CNT_L3.6
MainProgram.HMI_SecLavado_L3
MainProgram.InputBDL1.Active
MainProgram.LSL_TK_L1
MainProgram.LockOut_AgL3
MainProgram.LockOut_BD
MainProgram.LockOut_BDL3
MainProgram.LoteCargado
MainProgram.PU1_L5_V2.Open
MainProgram.Paso_lavado_L3
MainProgram.Peso_Tk_L3
MainProgram.STT_A_TP2_L3.1
MainProgram.STT_A_TP2_L3.4
MainProgram.STT_DL.5
MainProgram.STT_L2.5
MainProgram.STT_L3.5
MainProgram.ServOk
MainProgram.Set_Lts_Lavado_L3
MainProgram.Temperatura_L3
MainProgram.Valvula1_L2Status.5
MainProgram.Valvula1_L3.PosAbierta
MainProgram.Valvula1_L3.PosCerrada
MainProgram.Valvula1_L3Controle.1
MainProgram.Valvula1_L3Controle.2
MainProgram.Valvula1_L3Controle.6
MainProgram.Valvula1_L3Status.5
MainProgram.Valvula2_L2Status.5
MainProgram.Valvula2_L3.PosAbierta
MainProgram.Valvula2_L3.PosCerrada
MainProgram.Valvula2_L3Controle.1
MainProgram.Valvula2_L3Controle.2
MainProgram.Valvula2_L3Controle.6
MainProgram.Valvula2_L3Status.5
MainProgram.Valvula3_L2Status.5
MainProgram.Valvula3_L3.PosAbierta
MainProgram.Valvula3_L3.PosCerrada
MainProgram.Valvula3_L3Controle.1
MainProgram.Valvula3_L3Controle.2
MainProgram.Valvula3_L3Controle.6
MainProgram.Valvula3_L3Status.5
MainProgram.ZH_VA1_L
MainProgram.ZH_VA_L3
MainProgram.ZL_VA1_L
MainProgram.ZL_VA_L3
MainProgram.aManu
MainProgram.aManual
Progr
```

Contas que a tela faz sobre essas tags (5):

```
B18_CORTEVA]Program:MainProgram.LockOut_AgL3} AND {MainProgram.aManu
B18_CORTEVA]Program:MainProgram.aManual} AND {MainProgram.LockOut_BD
BombaL3:I.OutputFreq
OT {MainProgram.ServOk}  AND  NOT {Progr
OT {MainProgram.aManual}AND {Mai
```

## Liquido L4

Leva para: Balanza, Calibra Balanza Probeta, Calibra Balanza Tk L4, Calibra Liquido 4, Liquido L1, Liquido L2, Liquido L3, Liquido L4, Liquido L5, Liquido L6, Lista Liquidos, MAIN.

```
forma        Polygon13                       1,   2  1277x 76
texto        Text9                         513,  13   188x 42
imagem       Image3                       1133,  14   143x 63
forma        Polygon29                       4,  76   145x720
forma        Polygon12                    1133,  78   144x718
navegacao    GotoDisplayButton12          1138,  83   133x 62
numero       NumericDisplay6               154,  91    51x 23
texto        Text8                         211,  93    26x 18
texto        Text16                        154, 122    51x 23
numero       NumericDisplay1               154, 122    51x 23
texto        Text14                        214, 124    16x 18
texto        Text3                         342, 124    36x 36
grupo        Group20                       246, 133    96x 39
botao        MomentaryPushButton9          246, 133    69x 39
botao        MomentaryPushButton10         266, 138    76x 29
forma        Polygon27                     520, 155   266x 13
navegacao    GotoDisplayButton8           1138, 155   133x 62
botao        MomentaryPushButton11         260, 165    65x 40
grupo        Group4                        270, 166    48x 38
forma        Polygon15                     294, 166    24x 36
forma        Polygon14                     270, 168    24x 36
imagem       Image22                       436, 173    22x 22
imagem       Image29                       833, 173    22x 22
forma        Line25                       1007, 180     7x 42
forma        Line10                        310, 181   703x  6
forma        Line5                         215, 182    61x  6
forma        Line6                         216, 183     6x436
forma        Polygon16                     275, 185    39x 19
forma        Line2                         289, 198     7x 89
forma        Polygon1                      660, 216   132x 26
texto        Text12                        681, 219    91x 18
grupo        Group12                       904, 220   186x132
imagem       Image6                        904, 220   186x129
imagem       Image1                        904, 220   170x132
forma        Polygon6                     1006, 225    10x 20
navegacao    GotoDisplayButton11          1138, 227   133x 62
grupo        Group21                       461, 235    96x 39
botao        MomentaryPushButton15         461, 235    69x 39
botao        MomentaryPushButton16         481, 240    76x 29
grupo        Group6                        660, 242   132x 44
forma        Polygon11                     660, 242   132x 44
grupo        Group7                        660, 242   132x 66
forma        Polygon35                     660, 242   132x 66
botao        MomentaryPushButton2          732, 249    54x 54
botao        MomentaryPushButton1          669, 250    54x 54
texto        Text7                         683, 252    88x 25
grupo        Group2                        996, 259    36x 41
forma        Line29                       1008, 259    10x 33
forma        Line30                       1010, 259    22x 41
grupo        Group31                         4, 265   144x 96
forma        Polygon31                       4, 265   144x 96
forma        Line27                        996, 265    10x 31
forma        Line28                       1003, 266     5x 25
texto        Text27                         61, 268    49x 18
botao        MomentaryPushButton14         476, 268    65x 40
grupo        Group5                        485, 268    48x 38
forma        Polygon18                     509, 268    24x 36
forma        Polygon17                     485, 270    24x 36
imagem       Image19                       575, 275    22x 22
imagem       Image18                       407, 276    22x 22
grupo        Group16                        41, 282    90x 75
botao        MultistatePushButton2          41, 282    90x 75
forma        Line7                         525, 282   107x  7
forma        Line3                         291, 283   200x  7
forma        Line15                        626, 283     7x 91
imagem       Image13                        52, 285    68x 68
imagem       Image16                        53, 285    67x 68
forma        Polygon19                     490, 287    39x 19
navegacao    GotoDisplayButton10          1138, 299   133x 62
botao        MultistatePushButton1          51, 301    90x 75
forma        Line4                         505, 301     6x326
texto        Text28                          6, 309    39x 18
texto        Text19                        449, 312    36x 36
botao        MomentaryPushButton13         640, 318    61x 64
imagem       Image8                        644, 327    51x109
imagem       Image7                        644, 327    51x109
imagem       Image4                        644, 327    51x109
imagem       Image23                       208, 337    22x 22
imagem       Image5                        613, 371   120x121
forma        Line1                         636, 371    75x  3
navegacao    GotoDisplayButton9           1138, 371   133x 62
forma        Polygon20                     634, 374    77x 99
texto        Text1                         381, 389    67x 36
imagem       Image20                       497, 391    22x 22
navegacao    GotoDisplayButton2              8, 410   133x 62
texto        Text11                        847, 411    82x 36
imagem       Image14                       407, 436    22x 22
forma        Line38                        414, 439     7x 91
navegacao    GotoDisplayButton7           1138, 443   133x 62
botao        MomentaryPushButton19         843, 451    89x 60
grupo        Group15                       854, 456    69x 50
forma        Ellipse4                      873, 456    50x 50
imagem       Image21                       789, 457    22x 22
forma        Polygon28                     854, 457    49x 20
forma        Line12                        535, 460     7x222
forma        Line20                        537, 461    89x  6
forma        Ellipse5                      625, 461    20x 20
forma        Line31                        724, 464   138x  7
forma        Ellipse6                      888, 471    20x 20
grupo        Group10                       307, 476   100x 39
botao        MomentaryPushButton4          307, 476    69x 39
forma        Line24                        916, 476    62x  7
forma        Line26                        974, 477     6x 65
navegacao    GotoDisplayButton3              9, 481   133x 62
botao        MomentaryPushButton7          331, 481    76x 29
texto        Text13                        988, 488    36x 36
forma        Polygon21                     597, 489   153x  5
numero       NumericDisplay5               640, 494    73x 23
texto        Text15                        720, 495    18x 18
botao        MomentaryPushButton17         321, 510    65x 40
grupo        Group9                        331, 510    48x 38
forma        Polygon25                     331, 510    24x 36
forma        Polygon23                     355, 512    24x 36
forma        Line37                        292, 525    46x  7
forma        Line39                        375, 525    46x  7
forma        Line36                        289, 526     6x247
forma        Polygon26                     335, 529    39x 19
texto        Text2                        1060, 533    42x 36
botao        MomentaryPushButton3          945, 534    65x 40
grupo        Group8                        954, 535    48x 38
forma        Polygon9                      954, 535    24x 36
forma        Polygon22                     959, 535    39x 19
imagem       Image25                       528, 537    22x 22
forma        Polygon10                     978, 537    24x 36
forma        Line35                        350, 538     7x 91
imagem       Image12                      1034, 541    22x 22
forma        Line8                         990, 548    53x  7
forma        Polygon8                      666, 550   132x 66
forma        Line22                        899, 550     6x188
forma        Line21                        900, 551    61x  6
navegacao    GotoDisplayButton5              8, 552   133x 62
texto        Text4                         701, 555    50x 18
texto        Text22                        308, 558    36x 36
grupo        Group14                       931, 569    99x 39
botao        MomentaryPushButton8          931, 569    69x 39
grupo        Group19                       405, 574   100x 39
botao        MomentaryPushButton20         405, 574    69x 39
botao        MomentaryPushButton12         954, 574    76x 29
botao        MomentaryPushButton21         429, 579    76x 29
navegacao    GotoDisplayButton6           1138, 580   133x 62
numero       NumericDisplay2               679, 583    74x 23
texto        Text5                         765, 586    31x 18
grupo        Group18                       431, 607    48x 38
forma        Polygon32                     455, 607    24x 36
botao        MomentaryPushButton22         422, 608    65x 40
forma        Polygon30                     431, 609    24x 36
botao        MomentaryPushButton23         992, 614    61x 64
grupo        Group11                       666, 615   132x126
forma        Polygon7                      666, 615   132x126
grupo        Group13                       666, 616   132x 44
forma        Polygon24                     666, 616   132x 44
grupo        Group17                       176, 618    92x117
forma        Polygon44                     207, 618    26x103
imagem       Image11                       998, 620    51x109
imagem       Image10                       998, 620    51x109
imagem       Image9                        998, 620    51x109
numero       NumericInputCursorPoint2      679, 621    74x 36
forma        Line33                        474, 622    37x  7
forma        Line34                        351, 623    83x  6
forma        Polygon33                     436, 626    39x 19
texto        Text17                        689, 626    88x 25
texto        Text6                         763, 630    13x 18
indicador    Scale3                        208, 634    23x 75
imagem       Image26                       281, 635    22x 22
forma        Line32                        450, 640     7x 86
navegacao    GotoDisplayButton4           1138, 652   133x 62
texto        Text20                        408, 653    36x 36
grupo        Group3                        952, 666   156x112
imagem       Image2                        952, 666   156x112
imagem       Image24                       892, 669    22x 22
grupo        Group1                        564, 672    74x 60
forma        Polygon5                      564, 672     5x 19
botao        MomentaryPushButton18           7, 674   133x 48
botao        MomentaryPushButton6          737, 675    54x 54
forma        Polygon3                      569, 676    44x 10
forma        Ellipse1                      587, 676    51x 51
botao        MomentaryPushButton5          674, 676    54x 54
forma        Line19                        539, 678    27x  6
forma        Ellipse2                      595, 684    34x 34
forma        RoundedRectangle2             606, 686    13x 30
forma        Ellipse3                      608, 696     8x  8
texto        Text10                        996, 697    69x 50
imagem       Image17                       510, 712    22x 22
forma        Polygon4                      564, 713     5x 19
forma        Polygon2                      568, 718    44x 10
forma        Line11                        450, 719   117x  7
forma        Polygon45                     201, 721    38x  8
navegacao    GotoDisplayButton1           1138, 724   133x 62
forma        Polygon46                     176, 727    92x  8
numero       NumericInputCursorPoint3       62, 731    73x 38
forma        Line23                        899, 732    61x  6
numero       NumericDisplay7               182, 735    73x 23
texto        Text18                          4, 740    40x 18
imagem       Image27                       416, 759    22x 22
imagem       Image28                       751, 759    22x 22
forma        Line40                        291, 766   669x  7
```

Tags do CLP que esta tela usa (62):

```
BombaL4
Ma
MainProgram.Agitador_L4_2.ConfirmaM
MainProgram.AuxHs_R
MainProgram.BombaDiafrManualL4
MainProgram.CNT_A_TP2_L4.1
MainProgram.CNT_A_TP2_L4.2
MainProgram.CNT_A_TP2_L4.6
MainProgram.CNT_BDL4.1
MainProgram.CNT_BDL4.2
MainProgram.CNT_DL.1
MainProgram.CNT_DL.2
MainProgram.CNT_DL.6
MainProgram.CNT_L4.1
MainProgram.CNT_L4.2
MainProgram.CNT_L4.6
MainProgram.HMI_SecLavado_L4
MainProgram.InputBDL1.Active
MainProgram.LSL_TK_L1
MainProgram.LockOut_AgL4
MainProgram.LockOut_BD
MainProgram.LockOut_BDL4
MainProgram.LoteCargado
MainProgram.PU1_L3_V2.Open
MainProgram.Paso_lavado_L4
MainProgram.Peso_Tk_L4
MainProgram.STT_A_TP2_L4.1
MainProgram.STT_A_TP2_L4.4
MainProgram.STT_DL.5
MainProgram.STT_L2.5
MainProgram.STT_L4.5
MainProgram.ServOk
MainProgram.Set_Lts_Lavado_L4
MainProgram.Temperatura_L4
MainProgram.Valvula1_L2Status.5
MainProgram.Valvula1_L4.PosAbierta
MainProgram.Valvula1_L4.PosCerrada
MainProgram.Valvula1_L4Controle.1
MainProgram.Valvula1_L4Controle.2
MainProgram.Valvula1_L4Controle.6
MainProgram.Valvula1_L4Status.5
MainProgram.Valvula2_L2Status.5
MainProgram.Valvula2_L4.PosAbierta
MainProgram.Valvula2_L4.PosCerrada
MainProgram.Valvula2_L4Controle.1
MainProgram.Valvula2_L4Controle.2
MainProgram.Valvula2_L4Controle.6
MainProgram.Valvula2_L4Status.5
MainProgram.Valvula3_L2Status.5
MainProgram.Valvula3_L4.PosAbierta
MainProgram.Valvula3_L4.PosCerrada
MainProgram.Valvula3_L4Controle.1
MainProgram.Valvula3_L4Controle.2
MainProgram.Valvula3_L4Controle.6
MainProgram.Valvula3_L4Status.5
MainProgram.ZH_VA1_L
MainProgram.ZH_VA_L4
MainProgram.ZL_VA1_L
MainProgram.ZL_VA_L4
MainProgram.aManu
MainProgram.aManual
Progr
```

Contas que a tela faz sobre essas tags (5):

```
B18_CORTEVA]Program:MainProgram.LockOut_AgL4} AND {MainProgram.aManu
B18_CORTEVA]Program:MainProgram.aManual} AND {MainProgram.LockOut_BD
BombaL4:I.OutputFreq
OT {MainProgram.ServOk}  AND  NOT {Progr
OT {MainProgram.aManual} AND {Ma
```

## Liquido L5

Leva para: Balanza, Calibra Balanza Probeta, Calibra Balanza Tk L4, Calibra Liquido 5, Liquido L1, Liquido L2, Liquido L3, Liquido L4, Liquido L5, Liquido L6, Lista Liquidos, MAIN.

```
forma        Polygon13                       1,   2  1277x 76
texto        Text9                         513,  13   188x 42
imagem       Image3                       1133,  14   143x 63
forma        Polygon29                       4,  76   145x720
forma        Polygon12                    1133,  78   144x718
navegacao    GotoDisplayButton12          1138,  83   133x 62
numero       NumericDisplay6               154,  91    51x 23
texto        Text8                         211,  93    26x 18
texto        Text16                        154, 122    51x 23
numero       NumericDisplay1               154, 122    51x 23
texto        Text14                        214, 124    16x 18
texto        Text3                         342, 124    36x 36
grupo        Group20                       246, 133    96x 39
botao        MomentaryPushButton9          246, 133    69x 39
botao        MomentaryPushButton10         266, 138    76x 29
forma        Polygon27                     520, 155   266x 13
navegacao    GotoDisplayButton8           1138, 155   133x 62
botao        MomentaryPushButton11         261, 166    65x 40
grupo        Group4                        270, 166    48x 38
forma        Polygon15                     294, 166    24x 36
forma        Polygon14                     270, 168    24x 36
imagem       Image22                       436, 173    22x 22
imagem       Image29                       833, 173    22x 22
forma        Line25                       1007, 180     7x 42
forma        Line10                        310, 181   703x  6
forma        Line5                         215, 182    61x  6
forma        Line6                         216, 183     6x436
forma        Polygon16                     275, 185    39x 19
forma        Line2                         289, 198     7x 89
forma        Polygon1                      660, 216   132x 26
texto        Text12                        681, 219    91x 18
grupo        Group12                       904, 220   186x132
imagem       Image6                        904, 220   186x129
imagem       Image1                        904, 220   170x132
forma        Polygon6                     1006, 225    10x 20
navegacao    GotoDisplayButton11          1138, 227   133x 62
grupo        Group21                       461, 235    96x 39
botao        MomentaryPushButton15         461, 235    69x 39
botao        MomentaryPushButton16         481, 240    76x 29
grupo        Group6                        660, 242   132x 44
forma        Polygon11                     660, 242   132x 44
grupo        Group7                        660, 242   132x 66
forma        Polygon35                     660, 242   132x 66
botao        MomentaryPushButton2          732, 249    54x 54
botao        MomentaryPushButton1          669, 250    54x 54
texto        Text7                         683, 252    88x 25
grupo        Group2                        996, 259    36x 41
forma        Line29                       1008, 259    10x 33
forma        Line30                       1010, 259    22x 41
grupo        Group31                         4, 265   144x 96
forma        Polygon31                       4, 265   144x 96
forma        Line27                        996, 265    10x 31
forma        Line28                       1003, 266     5x 25
texto        Text27                         61, 268    49x 18
grupo        Group5                        485, 268    48x 38
forma        Polygon18                     509, 268    24x 36
botao        MomentaryPushButton14         474, 269    65x 40
forma        Polygon17                     485, 270    24x 36
imagem       Image19                       575, 275    22x 22
imagem       Image18                       407, 276    22x 22
grupo        Group16                        41, 282    90x 75
botao        MultistatePushButton2          41, 282    90x 75
forma        Line7                         525, 282   107x  7
forma        Line3                         291, 283   200x  7
forma        Line15                        626, 283     7x 91
imagem       Image13                        52, 285    68x 68
imagem       Image16                        53, 285    67x 68
forma        Polygon19                     490, 287    39x 19
navegacao    GotoDisplayButton10          1138, 299   133x 62
botao        MultistatePushButton1          51, 301    90x 75
forma        Line4                         505, 301     6x326
texto        Text28                          6, 309    39x 18
texto        Text19                        449, 312    36x 36
botao        MomentaryPushButton13         638, 319    61x 64
imagem       Image8                        645, 325    51x109
imagem       Image7                        646, 325    51x109
imagem       Image4                        646, 325    51x109
imagem       Image23                       208, 337    22x 22
imagem       Image5                        613, 371   120x121
forma        Line1                         636, 371    75x  3
navegacao    GotoDisplayButton9           1138, 371   133x 62
forma        Polygon20                     634, 374    77x 99
texto        Text1                         381, 389    67x 36
imagem       Image20                       497, 391    22x 22
navegacao    GotoDisplayButton2              8, 410   133x 62
texto        Text11                        847, 411    82x 36
imagem       Image14                       407, 436    22x 22
forma        Line38                        414, 439     7x 91
navegacao    GotoDisplayButton7           1138, 443   133x 62
botao        MomentaryPushButton19         844, 450    89x 60
grupo        Group15                       854, 456    69x 50
forma        Ellipse4                      873, 456    50x 50
imagem       Image21                       789, 457    22x 22
forma        Polygon28                     854, 457    49x 20
forma        Line12                        535, 460     7x222
forma        Line20                        537, 461    89x  6
forma        Ellipse5                      625, 461    20x 20
forma        Line31                        724, 464   138x  7
forma        Ellipse6                      888, 471    20x 20
grupo        Group10                       307, 476   100x 39
botao        MomentaryPushButton4          307, 476    69x 39
forma        Line24                        916, 476    62x  7
forma        Line26                        974, 477     6x 65
navegacao    GotoDisplayButton3              9, 481   133x 62
botao        MomentaryPushButton7          331, 481    76x 29
texto        Text13                        988, 488    36x 36
forma        Polygon21                     597, 489   153x  5
numero       NumericDisplay5               640, 494    73x 23
texto        Text15                        720, 495    18x 18
botao        MomentaryPushButton17         322, 510    65x 40
grupo        Group9                        331, 510    48x 38
forma        Polygon25                     331, 510    24x 36
forma        Polygon23                     355, 512    24x 36
forma        Line37                        292, 525    46x  7
forma        Line39                        375, 525    46x  7
forma        Line36                        289, 526     6x247
forma        Polygon26                     335, 529    39x 19
botao        MomentaryPushButton3          946, 532    65x 40
texto        Text2                        1060, 533    42x 36
grupo        Group8                        954, 535    48x 38
forma        Polygon9                      954, 535    24x 36
forma        Polygon22                     959, 535    39x 19
imagem       Image25                       528, 537    22x 22
forma        Polygon10                     978, 537    24x 36
forma        Line35                        350, 538     7x 91
imagem       Image12                      1034, 541    22x 22
forma        Line8                         990, 548    53x  7
forma        Polygon8                      666, 550   132x 66
forma        Line22                        899, 550     6x188
forma        Line21                        900, 551    61x  6
navegacao    GotoDisplayButton5              8, 552   133x 62
texto        Text4                         701, 555    50x 18
texto        Text22                        308, 558    36x 36
grupo        Group14                       931, 573    99x 39
botao        MomentaryPushButton8          931, 573    69x 39
grupo        Group19                       405, 574   100x 39
botao        MomentaryPushButton20         405, 574    69x 39
botao        MomentaryPushButton12         954, 578    76x 29
botao        MomentaryPushButton21         429, 579    76x 29
navegacao    GotoDisplayButton6           1138, 580   133x 62
numero       NumericDisplay2               679, 583    74x 23
texto        Text5                         765, 586    31x 18
botao        MomentaryPushButton22         423, 607    65x 40
grupo        Group18                       431, 607    48x 38
forma        Polygon32                     455, 607    24x 36
forma        Polygon30                     431, 609    24x 36
botao        MomentaryPushButton23         996, 614    61x 64
grupo        Group11                       666, 615   132x126
forma        Polygon7                      666, 615   132x126
grupo        Group13                       666, 616   132x 44
forma        Polygon24                     666, 616   132x 44
grupo        Group17                       176, 618    92x117
forma        Polygon44                     207, 618    26x103
imagem       Image11                      1002, 620    51x109
imagem       Image10                      1002, 620    51x109
imagem       Image9                       1002, 620    51x109
numero       NumericInputCursorPoint2      679, 621    74x 36
forma        Line33                        474, 622    37x  7
forma        Line34                        351, 623    83x  6
forma        Polygon33                     436, 626    39x 19
texto        Text17                        689, 626    88x 25
texto        Text6                         763, 630    13x 18
indicador    Scale3                        208, 634    23x 75
imagem       Image26                       281, 635    22x 22
forma        Line32                        450, 640     7x 86
navegacao    GotoDisplayButton4           1138, 652   133x 62
texto        Text20                        408, 653    36x 36
grupo        Group3                        952, 666   156x112
imagem       Image2                        952, 666   156x112
imagem       Image24                       892, 669    22x 22
grupo        Group1                        564, 672    74x 60
forma        Polygon5                      564, 672     5x 19
botao        MomentaryPushButton18           7, 674   133x 48
botao        MomentaryPushButton6          737, 675    54x 54
forma        Polygon3                      569, 676    44x 10
forma        Ellipse1                      587, 676    51x 51
botao        MomentaryPushButton5          674, 676    54x 54
forma        Line19                        539, 678    27x  6
forma        Ellipse2                      595, 684    34x 34
forma        RoundedRectangle2             606, 686    13x 30
forma        Ellipse3                      608, 696     8x  8
texto        Text10                        996, 697    69x 50
imagem       Image17                       510, 712    22x 22
forma        Polygon4                      564, 713     5x 19
forma        Polygon2                      568, 718    44x 10
forma        Line11                        450, 719   117x  7
forma        Polygon45                     201, 721    38x  8
navegacao    GotoDisplayButton1           1138, 724   133x 62
forma        Polygon46                     176, 727    92x  8
numero       NumericInputCursorPoint3       62, 731    73x 38
forma        Line23                        899, 732    61x  6
numero       NumericDisplay7               182, 735    73x 23
texto        Text18                          4, 740    40x 18
imagem       Image27                       416, 759    22x 22
imagem       Image28                       751, 759    22x 22
forma        Line40                        291, 766   669x  7
```

Tags do CLP que esta tela usa (59):

```
BombaL5
Mai
MainProgram.Agitador_L5_2.ConfirmaM
MainProgram.AuxHs_R
MainProgram.BombaDiafrManualL5
MainProgram.CNT_A_TP2_L5.1
MainProgram.CNT_A_TP2_L5.2
MainProgram.CNT_A_TP2_L5.6
MainProgram.CNT_BDL5.1
MainProgram.CNT_BDL5.2
MainProgram.CNT_DL.1
MainProgram.CNT_DL.2
MainProgram.CNT_DL.6
MainProgram.CNT_L5.1
MainProgram.CNT_L5.2
MainProgram.CNT_L5.6
MainProgram.HMI_SecLavado_L5
MainProgram.InputBDL1.Active
MainProgram.LSL_TK_L1
MainProgram.LockOut_AgL5
MainProgram.LockOut_BD
MainProgram.LockOut_BDL5
MainProgram.LoteCargado
MainProgram.PU1_L6_V2.Open
MainProgram.Paso_lavado_L5
MainProgram.Peso_Tk_L4
MainProgram.STT_A_TP2_L5.1
MainProgram.STT_A_TP2_L5.4
MainProgram.STT_DL.5
MainProgram.STT_L2.5
MainProgram.STT_L5.5
MainProgram.ServOk
MainProgram.Set_Lts_Lavado_L5
MainProgram.Temperatura_L5
MainProgram.Valvula1_L5.PosAbierta
MainProgram.Valvula1_L5.PosCerrada
MainProgram.Valvula1_L5Controle.1
MainProgram.Valvula1_L5Controle.2
MainProgram.Valvula1_L5Controle.6
MainProgram.Valvula1_L5Status.5
MainProgram.Valvula2_L5.PosAbierta
MainProgram.Valvula2_L5.PosCerrada
MainProgram.Valvula2_L5Controle.1
MainProgram.Valvula2_L5Controle.2
MainProgram.Valvula2_L5Controle.6
MainProgram.Valvula2_L5Status.5
MainProgram.Valvula3_L5.PosAbierta
MainProgram.Valvula3_L5.PosCerrada
MainProgram.Valvula3_L5Controle.1
MainProgram.Valvula3_L5Controle.2
MainProgram.Valvula3_L5Controle.6
MainProgram.Valvula3_L5Status.5
MainProgram.ZH_VA1_L
MainProgram.ZH_VA_L5
MainProgram.ZL_VA1_L
MainProgram.ZL_VA_L5
MainProgram.aManu
MainProgram.aManual
Progr
```

Contas que a tela faz sobre essas tags (5):

```
B18_CORTEVA]Program:MainProgram.LockOut_AgL5} AND {MainProgram.aManu
B18_CORTEVA]Program:MainProgram.aManual} AND {MainProgram.LockOut_BD
BombaL5:I.OutputFreq
OT {MainProgram.ServOk}  AND  NOT {Progr
OT {MainProgram.aManual}AND {Mai
```

## Liquido L6

Leva para: Balanza, Calibra Balanza Probeta, Calibra Balanza Tk L4, Calibra Liquido 6, Liquido L1, Liquido L2, Liquido L3, Liquido L4, Liquido L5, Liquido L6, Lista Liquidos, MAIN.

```
forma        Polygon13                       1,   2  1277x 76
texto        Text9                         513,  13   188x 42
imagem       Image3                       1133,  14   143x 63
forma        Polygon29                       4,  76   145x720
forma        Polygon12                    1133,  78   144x718
navegacao    GotoDisplayButton12          1138,  83   133x 62
numero       NumericDisplay6               154,  91    51x 23
texto        Text8                         211,  93    26x 18
texto        Text16                        154, 122    51x 23
numero       NumericDisplay1               154, 122    51x 23
texto        Text14                        214, 124    16x 18
texto        Text3                         342, 124    36x 36
grupo        Group20                       246, 133    96x 39
botao        MomentaryPushButton9          246, 133    69x 39
botao        MomentaryPushButton10         266, 138    76x 29
forma        Polygon27                     520, 155   266x 13
navegacao    GotoDisplayButton8           1138, 155   133x 62
botao        MomentaryPushButton11         263, 164    65x 40
grupo        Group4                        270, 166    48x 38
forma        Polygon15                     294, 166    24x 36
forma        Polygon14                     270, 168    24x 36
imagem       Image22                       436, 173    22x 22
imagem       Image29                       833, 173    22x 22
forma        Line25                       1007, 180     7x 42
forma        Line10                        310, 181   703x  6
forma        Line5                         215, 182    61x  6
forma        Line6                         216, 183     6x436
forma        Polygon16                     275, 185    39x 19
forma        Line2                         289, 198     7x 89
forma        Polygon1                      660, 216   132x 26
texto        Text12                        681, 219    91x 18
grupo        Group12                       904, 220   186x132
imagem       Image6                        904, 220   186x129
imagem       Image1                        904, 220   170x132
forma        Polygon6                     1006, 225    10x 20
navegacao    GotoDisplayButton11          1138, 227   133x 62
grupo        Group21                       461, 235    96x 39
botao        MomentaryPushButton15         461, 235    69x 39
botao        MomentaryPushButton16         481, 240    76x 29
grupo        Group6                        660, 242   132x 44
forma        Polygon11                     660, 242   132x 44
grupo        Group7                        660, 242   132x 66
forma        Polygon35                     660, 242   132x 66
botao        MomentaryPushButton2          732, 249    54x 54
botao        MomentaryPushButton1          669, 250    54x 54
texto        Text7                         683, 252    88x 25
grupo        Group2                        996, 259    36x 41
forma        Line29                       1008, 259    10x 33
forma        Line30                       1010, 259    22x 41
grupo        Group31                         4, 265   144x 96
forma        Polygon31                       4, 265   144x 96
forma        Line27                        996, 265    10x 31
forma        Line28                       1003, 266     5x 25
texto        Text27                         61, 268    49x 18
botao        MomentaryPushButton14         474, 268    65x 40
grupo        Group5                        485, 268    48x 38
forma        Polygon18                     509, 268    24x 36
forma        Polygon17                     485, 270    24x 36
imagem       Image19                       575, 275    22x 22
imagem       Image18                       407, 276    22x 22
grupo        Group16                        41, 282    90x 75
botao        MultistatePushButton2          41, 282    90x 75
forma        Line7                         525, 282   107x  7
forma        Line3                         291, 283   200x  7
forma        Line15                        626, 283     7x 91
imagem       Image13                        52, 285    68x 68
imagem       Image16                        53, 285    67x 68
forma        Polygon19                     490, 287    39x 19
navegacao    GotoDisplayButton10          1138, 299   133x 62
botao        MultistatePushButton1          51, 301    90x 75
forma        Line4                         505, 301     6x326
texto        Text28                          6, 309    39x 18
texto        Text19                        449, 312    36x 36
botao        MomentaryPushButton13         643, 318    61x 64
imagem       Image8                        647, 325    51x109
imagem       Image7                        647, 325    51x109
imagem       Image4                        647, 325    51x109
imagem       Image23                       208, 337    22x 22
imagem       Image5                        613, 371   120x121
forma        Line1                         636, 371    75x  3
navegacao    GotoDisplayButton9           1138, 371   133x 62
forma        Polygon20                     634, 374    77x 99
texto        Text1                         381, 389    67x 36
imagem       Image20                       497, 391    22x 22
navegacao    GotoDisplayButton2              8, 410   133x 62
texto        Text11                        847, 411    82x 36
imagem       Image14                       407, 436    22x 22
forma        Line38                        414, 439     7x 91
navegacao    GotoDisplayButton7           1138, 443   133x 62
botao        MomentaryPushButton19         841, 449    89x 60
grupo        Group15                       854, 456    69x 50
forma        Ellipse4                      873, 456    50x 50
imagem       Image21                       789, 457    22x 22
forma        Polygon28                     854, 457    49x 20
forma        Line12                        535, 460     7x222
forma        Line20                        537, 461    89x  6
forma        Ellipse5                      625, 461    20x 20
forma        Line31                        724, 464   138x  7
forma        Ellipse6                      888, 471    20x 20
grupo        Group10                       307, 476   100x 39
botao        MomentaryPushButton4          307, 476    69x 39
forma        Line24                        916, 476    62x  7
forma        Line26                        974, 477     6x 65
navegacao    GotoDisplayButton3              9, 481   133x 62
botao        MomentaryPushButton7          331, 481    76x 29
texto        Text13                        988, 488    36x 36
forma        Polygon21                     597, 489   153x  5
numero       NumericDisplay5               640, 494    73x 23
texto        Text15                        720, 495    18x 18
grupo        Group9                        331, 510    48x 38
forma        Polygon25                     331, 510    24x 36
botao        MomentaryPushButton17         320, 512    65x 40
forma        Polygon23                     355, 512    24x 36
forma        Line37                        292, 525    46x  7
forma        Line39                        375, 525    46x  7
forma        Line36                        289, 526     6x247
forma        Polygon26                     335, 529    39x 19
texto        Text2                        1060, 533    42x 36
botao        MomentaryPushButton3          946, 534    65x 40
grupo        Group8                        954, 535    48x 38
forma        Polygon9                      954, 535    24x 36
forma        Polygon22                     959, 535    39x 19
imagem       Image25                       528, 537    22x 22
forma        Polygon10                     978, 537    24x 36
forma        Line35                        350, 538     7x 91
imagem       Image12                      1034, 541    22x 22
forma        Line8                         990, 548    53x  7
forma        Polygon8                      666, 550   132x 66
forma        Line22                        899, 550     6x188
forma        Line21                        900, 551    61x  6
navegacao    GotoDisplayButton5              8, 552   133x 62
texto        Text4                         701, 555    50x 18
texto        Text22                        308, 558    36x 36
grupo        Group14                       931, 569    99x 39
botao        MomentaryPushButton8          931, 569    69x 39
grupo        Group19                       405, 574   100x 39
botao        MomentaryPushButton20         405, 574    69x 39
botao        MomentaryPushButton12         954, 574    76x 29
botao        MomentaryPushButton21         429, 579    76x 29
navegacao    GotoDisplayButton6           1138, 580   133x 62
numero       NumericDisplay2               679, 583    74x 23
texto        Text5                         765, 586    31x 18
botao        MomentaryPushButton22         422, 607    65x 40
grupo        Group18                       431, 607    48x 38
forma        Polygon32                     455, 607    24x 36
forma        Polygon30                     431, 609    24x 36
botao        MomentaryPushButton23         996, 613    61x 64
grupo        Group11                       666, 615   132x126
forma        Polygon7                      666, 615   132x126
grupo        Group13                       666, 616   132x 44
forma        Polygon24                     666, 616   132x 44
grupo        Group17                       176, 618    92x117
forma        Polygon44                     207, 618    26x103
numero       NumericInputCursorPoint2      679, 621    74x 36
imagem       Image11                      1006, 621    51x109
imagem       Image10                      1006, 621    51x109
imagem       Image9                       1006, 621    51x109
forma        Line33                        474, 622    37x  7
forma        Line34                        351, 623    83x  6
forma        Polygon33                     436, 626    39x 19
texto        Text17                        689, 626    88x 25
texto        Text6                         763, 630    13x 18
indicador    Scale3                        208, 634    23x 75
imagem       Image26                       281, 635    22x 22
forma        Line32                        450, 640     7x 86
navegacao    GotoDisplayButton4           1138, 652   133x 62
texto        Text20                        408, 653    36x 36
grupo        Group3                        952, 666   156x112
imagem       Image2                        952, 666   156x112
imagem       Image24                       892, 669    22x 22
grupo        Group1                        564, 672    74x 60
forma        Polygon5                      564, 672     5x 19
botao        MomentaryPushButton18           7, 674   133x 48
botao        MomentaryPushButton6          737, 675    54x 54
forma        Polygon3                      569, 676    44x 10
forma        Ellipse1                      587, 676    51x 51
botao        MomentaryPushButton5          674, 676    54x 54
forma        Line19                        539, 678    27x  6
forma        Ellipse2                      595, 684    34x 34
forma        RoundedRectangle2             606, 686    13x 30
forma        Ellipse3                      608, 696     8x  8
texto        Text10                        996, 697    69x 50
imagem       Image17                       510, 712    22x 22
forma        Polygon4                      564, 713     5x 19
forma        Polygon2                      568, 718    44x 10
forma        Line11                        450, 719   117x  7
forma        Polygon45                     201, 721    38x  8
navegacao    GotoDisplayButton1           1138, 724   133x 62
forma        Polygon46                     176, 727    92x  8
numero       NumericInputCursorPoint3       62, 731    73x 38
forma        Line23                        899, 732    61x  6
numero       NumericDisplay7               182, 735    73x 23
texto        Text18                          4, 740    40x 18
imagem       Image27                       416, 759    22x 22
imagem       Image28                       751, 759    22x 22
forma        Line40                        291, 766   669x  7
```

Tags do CLP que esta tela usa (67):

```
BombaL6
Mai
MainProgram.Agitador_L6.ConfirmaM
MainProgram.Agitador_L6_2.ConfirmaM
MainProgram.AuxHs_R
MainProgram.BombaDiafrManualL6
MainProgram.CNT_A_TP2_L6.6
MainProgram.CNT_A_TP6.1
MainProgram.CNT_A_TP6.2
MainProgram.CNT_A_TP6.6
MainProgram.CNT_BDL6.1
MainProgram.CNT_BDL6.2
MainProgram.CNT_DL.1
MainProgram.CNT_DL.2
MainProgram.CNT_DL.6
MainProgram.CNT_L6.1
MainProgram.CNT_L6.2
MainProgram.CNT_L6.6
MainProgram.HMI_SecLavado_L6
MainProgram.InputBDL1.Active
MainProgram.LSL_TK_L1
MainProgram.LockOut_AgL6_2
MainProgram.LockOut_BD
MainProgram.LockOut_BDL6
MainProgram.LoteCargado
MainProgram.PU1_L6_V2.Open
MainProgram.Paso_lavado_L5
MainProgram.Paso_lavado_L6
MainProgram.Peso_Tk_L4
MainProgram.STT_A_TP2_L6.1
MainProgram.STT_A_TP2_L6.4
MainProgram.STT_A_TP6.1
MainProgram.STT_A_TP6.4
MainProgram.STT_DL.5
MainProgram.STT_L2.5
MainProgram.STT_L6.5
MainProgram.ServOk
MainProgram.Set_Lts_Lavado_L6
MainProgram.Temperatura_L6
MainProgram.Valvula1_L2Status.5
MainProgram.Valvula1_L5Controle.6
MainProgram.Valvula1_L5Status.5
MainProgram.Valvula1_L6.PosAbierta
MainProgram.Valvula1_L6.PosCerrada
MainProgram.Valvula1_L6Controle.1
MainProgram.Valvula1_L6Controle.2
MainProgram.Valvula2_L2Status.5
MainProgram.Valvula2_L6.PosAbierta
MainProgram.Valvula2_L6.PosCerrada
MainProgram.Valvula2_L6Controle.1
MainProgram.Valvula2_L6Controle.2
MainProgram.Valvula2_L6Controle.6
MainProgram.Valvula2_L6Status.5
MainProgram.Valvula3_L2Status.5
MainProgram.Valvula3_L5Controle.1
MainProgram.Valvula3_L6.PosAbierta
MainProgram.Valvula3_L6.PosCerrada
MainProgram.Valvula3_L6Controle.2
MainProgram.Valvula3_L6Controle.6
MainProgram.Valvula3_L6Status.5
MainProgram.ZH_VA1_L
MainProgram.ZH_VA_L6
MainProgram.ZL_VA1_L
MainProgram.ZL_VA_L6
MainProgram.aMa
MainProgram.aManual
Progr
```

Contas que a tela faz sobre essas tags (5):

```
B18_CORTEVA]Program:MainProgram.LockOut_AgL6_2} AND {MainProgram.aMa
B18_CORTEVA]Program:MainProgram.aManual} AND {MainProgram.LockOut_BD
BombaL6:I.OutputFreq
OT {MainProgram.ServOk}  AND  NOT {Progr
OT {MainProgram.aManual}AND {Mai
```

## Liquido circuito 1

Leva para: Liquido Circuito 2, Liquido circuito 1, MAIN.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         506,  13   347x 42
imagem       Image4                       1133,  14   143x 63
forma        Polygon3                     1133,  78   144x718
indicador    ControlListSelector1          366, 116   470x540
desconhecido Liquido circuito 3           1140, 152   133x 62
navegacao    GotoDisplayButton3           1140, 152   133x 62
desconhecido Liquido circuito 6           1140, 224   133x 62
navegacao    GotoDisplayButton8           1140, 224   133x 62
desconhecido Liquido circuito 5           1140, 296   133x 62
navegacao    GotoDisplayButton4           1140, 296   133x 62
navegacao    GotoDisplayButton2           1140, 368   133x 62
navegacao    GotoDisplayButton5           1140, 440   133x 62
desconhecido Liquido circuito 4           1140, 512   133x 62
navegacao    GotoDisplayButton1           1140, 512   133x 62
navegacao    ReturntoDisplayButton1       1138, 651   133x 59
grupo        Group1                        366, 672   470x 40
navegacao    MoveUpButton1                 366, 672    40x 40
navegacao    EnterButton1                  545, 672   112x 40
navegacao    MoveDownButton1               796, 672    40x 40
navegacao    GotoDisplayButton6           1138, 724   133x 62
texto        Text1                         375, 729   453x 18
```

Tags do CLP que esta tela usa (15):

```
MainPr
MainProgr
MainProgram
MainProgram.L
MainProgram.List
MainProgram.ListaL
MainProgram.ListaLiqui
MainProgram.ListaLiquidos[01]
MainProgram.ListaLiquidos[04]
MainProgram.ListaLiquidos[07]
MainProgram.ListaLiquidos[08]
MainProgram.ListaLiquidos[10]
MainProgram.ListaLiquidos[16]
MainProgram.ListaLiquidos[19]
P
```

Contas que a tela faz sobre essas tags (16):

```
 - /*S:0 {MainProgram.List
*S:0 {MainProgram.ListaL
1]}*/13 - /*S:0 {MainProgr
A]Program:MainProgram.ListaLiquidos[17]}*/19 - /*S:0 {MainProgr
CORTEVA]Program:MainProgram.ListaLiquidos[02]}*/4 - /*S:0 {MainProgram.L
CORTEVA]Program:MainProgram.ListaLiquidos[13]}*/15 - /*S:0 {MainProgram.
EVA]Program:MainProgram.ListaLiquidos[05]}*/7 - /*S:0 {MainPr
IDO 4LIQUIDO 1LIQUIDO 3LIQUIDO 5VOLTARListaLiquidos[06]}*/8 - /*S:0 {P
Liquidos[00]}*/2 - /*S:0 {MainProgram.ListaLiquidos[01]}*/3 - /*S:0 {::[B1
gram.ListaLiquidos[06]}*/8 - /*S:0 {MainProgram.ListaLiquidos[07]}*/9 - /*S:0 {::[B18_CO
istaLiquidos[14]}*/16 - /*S:0 {MainProgram.ListaLiqui
m.ListaLiquidos[18]}*/20 - /*S:0 {MainProgram.ListaLiquidos[19]}*/TABELA D
ogram:MainProgram.ListaLiquidos[07]}*/9 - /*S:0 {MainProgram.ListaLiquidos[08]}*/10 - /*S:0
os[15]}*/17 - /*S:0 {MainProgram.ListaLiquidos[16]}*/18 - /*S:0 {::[B18_CORTE
row ogram:MainProgram.ListaLiquidos[09]}*/11 - /*S:0 {MainProgram.ListaLiquidos[10]}*/12 - 
staLiquidos[03]}*/5 - /*S:0 {MainProgram.ListaLiquidos[04]}*/4 - /*S:0 {::[B18_COR
```

## Lista Liquidos

Leva para: Liquido L2, Liquido L3, Liquido L4, Liquido L5, Liquido L6, MAIN.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         504,   4   161x 42
imagem       Image4                       1133,  14   143x 63
texto        Text1                          70,  55    83x 19
texto        Text5                         638,  56    60x 19
texto        Text6                         753,  56    51x 19
texto        Text3                         429,  57    50x 19
texto        Text4                         530,  57    52x 19
texto        Text2                         285,  58    86x 19
forma        Polygon3                     1133,  78   144x718
botao        MaintainedPushButton3         752,  83    60x 30
navegacao    GotoDisplayButton12          1138,  83   133x 62
botao        MaintainedPushButton1         534,  84    60x 30
botao        MaintainedPushButton2         634,  84    60x 30
numero       NumericInputCursorPoint21     284,  85    80x 30
numero       NumericInputCursorPoint1      417,  85    80x 30
texto_valor  StringInputEnable1             11,  86   237x 30
botao        MaintainedPushButton6         752, 118    60x 30
botao        MaintainedPushButton16        534, 119    60x 30
botao        MaintainedPushButton17        634, 119    60x 30
numero       NumericInputCursorPoint22     284, 120    80x 30
numero       NumericInputCursorPoint2      417, 120    80x 30
texto_valor  StringInputEnable2             11, 121   237x 30
botao        MaintainedPushButton18        752, 153    60x 30
botao        MaintainedPushButton4         534, 154    60x 30
botao        MaintainedPushButton5         634, 154    60x 30
numero       NumericInputCursorPoint23     284, 155    80x 30
numero       NumericInputCursorPoint3      417, 155    80x 30
navegacao    GotoDisplayButton8           1138, 155   133x 62
texto_valor  StringInputEnable3             11, 156   237x 30
botao        MaintainedPushButton33        752, 188    60x 30
botao        MaintainedPushButton19        534, 189    60x 30
botao        MaintainedPushButton32        634, 189    60x 30
numero       NumericInputCursorPoint24     284, 190    80x 30
numero       NumericInputCursorPoint4      417, 190    80x 30
texto_valor  StringInputEnable4             11, 191   237x 30
botao        MaintainedPushButton21        752, 223    60x 30
botao        MaintainedPushButton31        534, 224    60x 30
botao        MaintainedPushButton8         634, 224    60x 30
numero       NumericInputCursorPoint25     284, 225    80x 30
numero       NumericInputCursorPoint5      417, 225    80x 30
texto_valor  StringInputEnable5             11, 226   237x 30
navegacao    GotoDisplayButton11          1138, 227   133x 62
botao        MaintainedPushButton9         752, 258    60x 30
botao        MaintainedPushButton7         534, 259    60x 30
botao        MaintainedPushButton20        634, 259    60x 30
numero       NumericInputCursorPoint6      417, 260    80x 30
texto_valor  StringInputEnable6             11, 261   237x 30
numero       NumericInputCursorPoint26     284, 261    80x 30
botao        MaintainedPushButton12        752, 293    60x 30
botao        MaintainedPushButton43        534, 294    60x 30
botao        MaintainedPushButton23        634, 294    60x 30
numero       NumericInputCursorPoint7      417, 295    80x 30
texto_valor  StringInputEnable7             11, 296   237x 30
numero       NumericInputCursorPoint27     284, 296    80x 30
navegacao    GotoDisplayButton10          1138, 299   133x 62
botao        MaintainedPushButton36        752, 328    60x 30
botao        MaintainedPushButton10        534, 329    60x 30
botao        MaintainedPushButton47        634, 329    60x 30
numero       NumericInputCursorPoint8      417, 330    80x 30
texto_valor  StringInputEnable8             11, 331   237x 30
numero       NumericInputCursorPoint28     284, 331    80x 30
botao        MaintainedPushButton48        752, 363    60x 30
botao        MaintainedPushButton34        534, 364    60x 30
botao        MaintainedPushButton35        634, 364    60x 30
numero       NumericInputCursorPoint9      417, 365    80x 30
texto_valor  StringInputEnable9             11, 366   237x 30
numero       NumericInputCursorPoint29     284, 366    80x 30
navegacao    GotoDisplayButton9           1138, 371   133x 62
botao        MaintainedPushButton24        752, 398    60x 30
botao        MaintainedPushButton46        534, 399    60x 30
botao        MaintainedPushButton11        634, 399    60x 30
numero       NumericInputCursorPoint10     417, 400    80x 30
texto_valor  StringInputEnable10            11, 401   237x 30
numero       NumericInputCursorPoint30     284, 401    80x 30
botao        MaintainedPushButton39        752, 433    60x 30
botao        MaintainedPushButton22        534, 434    60x 30
botao        MaintainedPushButton26        634, 434    60x 30
numero       NumericInputCursorPoint11     417, 435    80x 30
texto_valor  StringInputEnable11            11, 436   237x 30
numero       NumericInputCursorPoint31     284, 436    80x 30
navegacao    GotoDisplayButton7           1138, 443   133x 62
botao        MaintainedPushButton51        752, 468    60x 30
botao        MaintainedPushButton37        534, 469    60x 30
botao        MaintainedPushButton14        634, 469    60x 30
numero       NumericInputCursorPoint12     417, 470    80x 30
texto_valor  StringInputEnable13            11, 471   237x 30
numero       NumericInputCursorPoint32     284, 471    80x 30
botao        MaintainedPushButton15        752, 503    60x 30
botao        MaintainedPushButton49        534, 504    60x 30
botao        MaintainedPushButton50        634, 504    60x 30
numero       NumericInputCursorPoint13     417, 505    80x 30
texto_valor  StringInputEnable12            11, 506   237x 30
numero       NumericInputCursorPoint33     284, 506    80x 30
botao        MaintainedPushButton27        752, 538    60x 30
botao        MaintainedPushButton13        534, 539    60x 30
botao        MaintainedPushButton38        634, 539    60x 30
numero       NumericInputCursorPoint14     417, 540    80x 30
texto_valor  StringInputEnable14            11, 541   237x 30
numero       NumericInputCursorPoint34     284, 541    80x 30
botao        MaintainedPushButton54        752, 573    60x 30
botao        MaintainedPushButton25        534, 574    60x 30
botao        MaintainedPushButton53        634, 574    60x 30
numero       NumericInputCursorPoint15     417, 575    80x 30
texto_valor  StringInputEnable15            11, 576   237x 30
numero       NumericInputCursorPoint35     284, 576    80x 30
botao        MaintainedPushButton42        752, 608    60x 30
botao        MaintainedPushButton52        534, 609    60x 30
botao        MaintainedPushButton41        634, 609    60x 30
numero       NumericInputCursorPoint16     417, 610    80x 30
texto_valor  StringInputEnable16            11, 611   237x 30
numero       NumericInputCursorPoint36     284, 611    80x 30
botao        MaintainedPushButton30        752, 643    60x 30
botao        MaintainedPushButton40        534, 644    60x 30
botao        MaintainedPushButton29        634, 644    60x 30
numero       NumericInputCursorPoint17     417, 645    80x 30
texto_valor  StringInputEnable17            11, 646   237x 30
numero       NumericInputCursorPoint37     284, 646    80x 30
botao        MaintainedPushButton45        752, 678    60x 30
botao        MaintainedPushButton28        534, 679    60x 30
botao        MaintainedPushButton56        634, 679    60x 30
numero       NumericInputCursorPoint18     417, 680    80x 30
texto_valor  StringInputEnable18            11, 681   237x 30
numero       NumericInputCursorPoint38     284, 681    80x 30
botao        MaintainedPushButton57        752, 713    60x 30
botao        MaintainedPushButton55        534, 714    60x 30
botao        MaintainedPushButton44        634, 714    60x 30
numero       NumericInputCursorPoint19     417, 715    80x 30
texto_valor  StringInputEnable19            11, 716   237x 30
numero       NumericInputCursorPoint39     284, 716    80x 30
navegacao    GotoDisplayButton2           1138, 725   133x 62
botao        MaintainedPushButton60        752, 748    60x 30
botao        MaintainedPushButton58        534, 749    60x 30
botao        MaintainedPushButton59        634, 749    60x 30
texto_valor  StringInputEnable24            11, 751   237x 30
numero       NumericInputCursorPoint40     284, 751    80x 30
numero       NumericInputCursorPoint20     417, 751    80x 30
```

Tags do CLP que esta tela usa (124):

```
MainProgram.Liquido_1000s[00]
MainProgram.Liquido_1000s[01]
MainProgram.Liquido_1000s[02]
MainProgram.Liquido_1000s[03]
MainProgram.Liquido_1000s[04]
MainProgram.Liquido_1000s[05]
MainProgram.Liquido_1000s[06]
MainProgram.Liquido_1000s[07]
MainProgram.Liquido_1000s[08]
MainProgram.Liquido_1000s[09]
MainProgram.Liquido_1000s[10]
MainProgram.Liquido_1000s[11]
MainProgram.Liquido_1000s[12]
MainProgram.Liquido_1000s[13]
MainProgram.Liquido_1000s[14]
MainProgram.Liquido_1000s[15]
MainProgram.Liquido_1000s[16]
MainProgram.Liquido_1000s[17]
MainProgram.Liquido_1000s[18]
MainProgram.Liquido_1000s[19]
MainProgram.Lista
MainProgram.ListaLiquidos[00]
MainProgram.ListaLiquidos[01]
MainProgram.ListaLiquidos[02]
MainProgram.ListaLiquidos[03]
MainProgram.ListaLiquidos[04]
MainProgram.ListaLiquidos[05]
MainProgram.ListaLiquidos[06]
MainProgram.ListaLiquidos[07]
MainProgram.ListaLiquidos[08]
MainProgram.ListaLiquidos[09]
MainProgram.ListaLiquidos[10]
MainProgram.ListaLiquidos[11]
MainProgram.ListaLiquidos[12]
MainProgram.ListaLiquidos[13]
MainProgram.ListaLiquidos[14]
MainProgram.ListaLiquidos[15]
MainProgram.ListaLiquidos[16]
MainProgram.ListaLiquidos[17]
MainProgram.ListaLiquidos[18]
MainProgram.ListaLiquidos[19]
MainProgram.OffsetLiquidos[00]
MainProgram.OffsetLiquidos[01]
MainProgram.OffsetLiquidos[02]
MainProgram.OffsetLiquidos[03]
MainProgram.OffsetLiquidos[04]
MainProgram.OffsetLiquidos[05]
MainProgram.OffsetLiquidos[06]
MainProgram.OffsetLiquidos[07]
MainProgram.OffsetLiquidos[08]
MainProgram.OffsetLiquidos[09]
MainProgram.OffsetLiquidos[10]
MainProgram.OffsetLiquidos[11]
MainProgram.OffsetLiquidos[12]
MainProgram.OffsetLiquidos[13]
MainProgram.OffsetLiquidos[14]
MainProgram.OffsetLiquidos[15]
MainProgram.OffsetLiquidos[16]
MainProgram.OffsetLiquidos[17]
MainProgram.OffsetLiquidos[18]
MainProgram.OffsetLiquidos[19]
MainProgram.PesoEspec[00]
MainProgram.PesoEspec[01]
MainProgram.PesoEspec[02]
MainProgram.PesoEspec[03]
MainProgram.PesoEspec[04]
MainProgram.PesoEspec[05]
MainProgram.PesoEspec[06]
MainProgram.PesoEspec[07]
MainProgram.PesoEspec[08]
MainProgram.PesoEspec[09]
MainProgram.PesoEspec[10]
MainProgram.PesoEspec[11]
MainProgram.PesoEspec[12]
MainProgram.PesoEspec[13]
MainProgram.PesoEspec[14]
MainProgram.PesoEspec[15]
MainProgram.PesoEspec[16]
MainProgram.PesoEspec[17]
MainProgram.PesoEspec[18]
MainProgram.PesoEspec[19]
MainProgram.SinAgitador[00]
MainProgram.SinAgitador[01]
MainProgram.SinAgitador[02]
MainProgram.SinAgitador[03]
MainProgram.SinAgitador[04]
MainProgram.SinAgitador[05]
MainProgram.SinAgitador[06]
MainProgram.SinAgitador[07]
MainProgram.SinAgitador[08]
MainProgram.SinAgitador[09]
MainProgram.SinAgitador[10]
MainProgram.SinAgitador[11]
MainProgram.SinAgitador[12]
MainProgram.SinAgitador[13]
MainProgram.SinAgitador[14]
MainProgram.SinAgitador[15]
MainProgram.SinAgitador[16]
MainProgram.SinAgitador[17]
MainProgram.SinAgitador[18]
MainProgram.SinAgitador[19]
MainProgram.SinRecirculacion[00]
MainProgram.SinRecirculacion[01]
MainProgram.SinRecirculacion[02]
MainProgram.SinRecirculacion[03]
MainProgram.SinRecirculacion[04]
MainProgram.SinRecirculacion[05]
MainProgram.SinRecirculacion[06]
MainProgram.SinRecirculacion[07]
MainProgram.SinRecirculacion[08]
MainProgram.SinRecirculacion[09]
MainProgram.SinRecirculacion[10]
MainProgram.SinRecirculacion[11]
MainProgram.SinRecirculacion[12]
MainProgram.SinRecirculacion[13]
MainProgram.SinRecirculacion[14]
MainProgram.SinRecirculacion[15]
MainProgram.SinRecirculacion[16]
MainProgram.SinRecirculacion[17]
MainProgram.SinRecirculacion[18]
MainProgram.SinRecirculacion[19]
P
Pr
Prog
```

Contas que a tela faz sobre essas tags (10):

```
//*S:0 {MainProgram.Lista
ErrorErrorErrorErrorErrorErrorErrorErrorErrorErrorLIQUIDO 6LIQUIDO 5LIQUIDO 4LIQUIDO 3LIQUIDO 2LIQUIDO 1P
MainProgram.ListaLiquidos[08]}*//*S:0 {[Simulacao]ListaLiquidos[07]}*//*S:0 {[Simulacao]ListaLiquidos[06]}
MainProgram.ListaLiquidos[17]}*//*S:0 {MainProgram.ListaLiquidos[16]}*//*S:0 {Pr
gram:MainProgram.ListaLiquidos[13]}*//*S:0 {MainProgram.ListaLiquidos[11]}*/ErrorErrorErrorErr
gram:MainProgram.ListaLiquidos[15]}*//*S:0 {MainProgram.ListaLiquidos[14]}*//*S:0 {Pr
iquidos[10]}*//*S:0 {MainProgram.ListaLiquidos[09]}*//*S:0 
iquidos[19]}*//*S:0 {MainProgram.ListaLiquidos[18]}*//*S:0 
ogram:MainProgram.ListaLiquidos[10]}*//*S:0 {MainProgram.ListaLiquidos[09]}*//*S:0 {Prog
rogram:MainProgram.ListaLiquidos[12]}*//*S:0 {MainProgram.Lista
```

## Parametros

Leva para: MAIN.

```
forma        Polygon2                        1,   2  1277x 76
imagem       Image4                       1133,  14   143x 63
texto        Text9                         451,  19   218x 42
forma        Polygon3                     1133,  78   144x718
grupo        Group1                        236, 183   365x 43
botao        MaintainedPushButton1         529, 183    72x 43
texto        Text1                         236, 195   121x 18
numero       NumericInputCursorPoint7      529, 244    73x 38
texto        Text8                         236, 254   130x 18
numero       NumericInputCursorPoint8      529, 295    73x 38
texto        Text10                        236, 305   127x 18
numero       NumericInputCursorPoint9      529, 346    73x 38
texto        Text11                        236, 347   134x 36
texto        Text4                         310, 511    17x 18
texto        Text15                        433, 511    17x 18
texto        Text6                         556, 511    17x 18
texto        Text12                        679, 511    17x 18
texto        Text13                        802, 511    17x 18
texto        Text14                        925, 511    17x 18
numero       NumericInputCursorPoint16     281, 544    73x 38
numero       NumericInputCursorPoint14     405, 544    73x 38
numero       NumericInputCursorPoint2      529, 544    73x 38
numero       NumericInputCursorPoint4      653, 544    73x 38
numero       NumericInputCursorPoint10     777, 544    73x 38
numero       NumericInputCursorPoint12     901, 544    73x 38
texto        Text5                         165, 554    81x 18
numero       NumericInputCursorPoint17     281, 596    73x 38
numero       NumericInputCursorPoint15     405, 596    73x 38
numero       NumericInputCursorPoint5      529, 596    73x 38
numero       NumericInputCursorPoint6      653, 596    73x 38
numero       NumericInputCursorPoint11     777, 596    73x 38
numero       NumericInputCursorPoint13     901, 596    73x 38
texto        Text7                         168, 606    85x 18
numero       NumericInputCursorPoint23     281, 648    73x 38
numero       NumericInputCursorPoint22     405, 648    73x 38
numero       NumericInputCursorPoint18     529, 648    73x 38
numero       NumericInputCursorPoint19     653, 648    73x 38
numero       NumericInputCursorPoint20     777, 648    73x 38
numero       NumericInputCursorPoint21     901, 648    73x 38
texto        Text16                        152, 658    97x 18
navegacao    GotoDisplayButton1           1142, 725   133x 62
```

Tags do CLP que esta tela usa (15):

```
MainProgram.Peso_Max_Tk_L1
MainProgram.Peso_Max_Tk_L2
MainProgram.Peso_Max_Tk_L3
MainProgram.Peso_Max_Tk_L4
MainProgram.Peso_Max_Tk_L5
MainProgram.Peso_Max_Tk_L6
MainProgram.Peso_Min_Tk_L1
MainProgram.Peso_Min_Tk_L2
MainProgram.Peso_Min_Tk_L3
MainProgram.Peso_Min_Tk_L4
MainProgram.Peso_Min_Tk_L5
MainProgram.Peso_Min_Tk_L6
MainProgram.Presion_Aire_Max
MainProgram.Presion_Aire_Min
MainProgram.SimulacionPeso
```

## Receta en proceso

Leva para: Recetario.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         422,  14   291x 42
imagem       Image4                       1133,  14   143x 63
texto_valor  StringDisplay1                462,  78   199x 36
forma        Polygon3                     1133,  78   144x718
forma        Polygon1                        3,  79  1126x 38
texto        Text2                         405, 140    95x 38
texto        Text1                         214, 141    83x 19
texto        Text4                         656, 142    85x 38
texto        Text6                         891, 142   106x 38
texto        Text3                         533, 143    85x 38
texto        Text5                         778, 143    87x 38
texto        Text8                          63, 211    39x 39
forma        Polygon5                      112, 215   941x 30
texto_valor  StringDisplay2                137, 215   237x 30
numero       NumericDisplay1               413, 215    80x 30
numero       NumericDisplay3               535, 215    80x 30
numero       NumericInputCursorPoint8      658, 215    80x 30
numero       NumericInputCursorPoint11     781, 215    80x 30
numero       NumericInputCursorPoint10     904, 215    80x 30
texto        Text11                         63, 247    39x 39
forma        Polygon2                      112, 251   941x 30
texto_valor  StringDisplay3                137, 251   237x 30
numero       NumericDisplay2               413, 251    80x 30
numero       NumericDisplay4               535, 251    80x 30
numero       NumericInputCursorPoint1      658, 251    80x 30
numero       NumericInputCursorPoint3      781, 251    80x 30
numero       NumericInputCursorPoint2      904, 251    80x 30
texto        Text16                         63, 283    39x 39
forma        Polygon6                      112, 287   941x 30
texto_valor  StringDisplay4                137, 287   237x 30
numero       NumericDisplay5               413, 287    80x 30
numero       NumericDisplay6               535, 287    80x 30
numero       NumericInputCursorPoint4      658, 287    80x 30
numero       NumericInputCursorPoint6      781, 287    80x 30
numero       NumericInputCursorPoint5      904, 287    80x 30
texto        Text17                         63, 319    39x 39
forma        Polygon7                      112, 323   941x 30
texto_valor  StringDisplay5                137, 323   237x 30
numero       NumericDisplay7               413, 323    80x 30
numero       NumericDisplay8               535, 323    80x 30
numero       NumericInputCursorPoint7      658, 323    80x 30
numero       NumericInputCursorPoint16     781, 323    80x 30
numero       NumericInputCursorPoint9      904, 323    80x 30
texto        Text18                         63, 355    39x 39
texto_valor  StringDisplay6                137, 359   237x 30
numero       NumericDisplay9               413, 359    80x 30
numero       NumericDisplay10              535, 359    80x 30
numero       NumericInputCursorPoint17     658, 359    80x 30
numero       NumericInputCursorPoint19     781, 359    80x 30
numero       NumericInputCursorPoint18     904, 359    80x 30
texto        Text19                         63, 391    39x 39
forma        Polygon9                      112, 395   941x 30
texto_valor  StringDisplay7                137, 395   237x 30
numero       NumericDisplay11              413, 395    80x 30
numero       NumericDisplay12              535, 395    80x 30
numero       NumericInputCursorPoint20     658, 395    80x 30
numero       NumericInputCursorPoint22     781, 395    80x 30
numero       NumericInputCursorPoint21     904, 395    80x 30
navegacao    GotoDisplayButton1           1137, 444   133x 62
texto        Text7                         259, 481   241x 39
numero       NumericInputCursorPoint13     542, 484    80x 30
numero       NumericInputCursorPoint14     676, 484    80x 30
texto        Text12                        767, 489    23x 19
texto        Text14                        628, 491    34x 19
texto        Text10                        347, 547   147x 39
numero       NumericInputCursorPoint15     542, 550    80x 30
numero       NumericInputCursorPoint12     676, 550    80x 30
texto        Text15                        628, 553    34x 19
texto        Text13                        767, 554    23x 19
navegacao    GotoDisplayButton2           1137, 725   133x 62
```

Tags do CLP que esta tela usa (41):

```
MainProgram.Dosis_L1_corregida
MainProgram.Dosis_L2_corregida
MainProgram.Dosis_L3_corregida
MainProgram.Dosis_L4_corregida
MainProgram.Dosis_L5_corregida
MainProgram.Dosis_L6_corregida
MainProgram.RecetaEnProceso.Nombre
MainProgram.RecetaEnProceso.Nombre_L1
MainProgram.RecetaEnProceso.Nombre_L2
MainProgram.RecetaEnProceso.Nombre_L3
MainProgram.RecetaEnProceso.Nombre_L4
MainProgram.RecetaEnProceso.Nombre_L5
MainProgram.RecetaEnProceso.Nombre_L6
MainProgram.RecetaEnProceso.Orden_L1
MainProgram.RecetaEnProceso.Orden_L2
MainProgram.RecetaEnProceso.Orden_L3
MainProgram.RecetaEnProceso.Orden_L4
MainProgram.RecetaEnProceso.Orden_L5
MainProgram.RecetaEnProceso.Orden_L6
MainProgram.RecetaEnProceso.T_demora_L1
MainProgram.RecetaEnProceso.T_demora_L2
MainProgram.RecetaEnProceso.T_demora_L3
MainProgram.RecetaEnProceso.T_demora_L4
MainProgram.RecetaEnProceso.T_demora_L5
MainProgram.RecetaEnProceso.T_demora_L6
MainProgram.RecetaEnProceso.T_descarga
MainProgram.RecetaEnProceso.T_homogenizado
MainProgram.RecetaEnProceso.T_inyeccion_L1
MainProgram.RecetaEnProceso.T_inyeccion_L2
MainProgram.RecetaEnProceso.T_inyeccion_L3
MainProgram.RecetaEnProceso.T_inyeccion_L4
MainProgram.RecetaEnProceso.T_inyeccion_L5
MainProgram.RecetaEnProceso.T_inyeccion_L6
MainProgram.RecetaEnProceso.Vel_aspersor_L1
MainProgram.RecetaEnProceso.Vel_aspersor_L2
MainProgram.RecetaEnProceso.Vel_aspersor_L3
MainProgram.RecetaEnProceso.Vel_aspersor_L4
MainProgram.RecetaEnProceso.Vel_aspersor_L5
MainProgram.RecetaEnProceso.Vel_aspersor_L6
MainProgram.RecetaEnProceso.Vel_descarga
MainProgram.RecetaEnProceso.Vel_homogenizado
```

Contas que a tela faz sobre essas tags (1):

```
MainProgram.RecetaEnProceso.T_demora_L3/1000
```

## Recetario

Leva para: Liquido Circuito 2, Liquido Circuito 3, Liquido Circuito 4, Liquido Circuito 5, Liquido Circuito 6.

```
forma        Polygon4                        1,   2  1277x 76
texto        Text9                         506,  13   158x 42
imagem       Image4                       1133,  14   143x 63
forma        Polygon3                     1133,  78   144x718
texto        Text16                         87,  82    91x 28
texto_valor  StringInputEnable3            538,  89   237x 30
indicador    ControlListSelector1           14, 113   240x540
texto        Text3                         693, 146    80x 38
texto        Text6                        1010, 146   106x 38
texto        Text1                         394, 165    83x 19
texto        Text2                         582, 165    41x 19
texto        Text4                         797, 165    92x 19
texto        Text5                         909, 165    89x 19
navegacao    GotoDisplayButton1            364, 209   142x 37
texto        Text8                         270, 210    39x 39
texto_valor  StringDisplay1                317, 214   237x 30
numero       NumericInputCursorPoint9      562, 214    80x 30
numero       NumericInputCursorPoint1      693, 214    80x 30
numero       NumericInputCursorPoint8      803, 214    80x 30
numero       NumericInputCursorPoint11     913, 214    80x 30
numero       NumericInputCursorPoint10    1023, 214    80x 30
texto        Text17                        646, 220    15x 18
texto        Text18                        647, 220    40x 18
navegacao    GotoDisplayButton3            364, 255   142x 36
texto        Text11                        270, 257    39x 39
texto_valor  StringDisplay2                317, 261   237x 30
numero       NumericInputCursorPoint18     562, 261    80x 30
numero       NumericInputCursorPoint16     693, 261    80x 30
numero       NumericInputCursorPoint17     803, 261    80x 30
numero       NumericInputCursorPoint20     913, 261    80x 30
numero       NumericInputCursorPoint19    1023, 261    80x 30
texto        Text19                        646, 267    15x 18
texto        Text20                        646, 267    40x 18
texto        Text21                        270, 304    39x 39
texto_valor  StringDisplay3                317, 308   237x 30
navegacao    GotoDisplayButton4            364, 308   142x 31
numero       NumericInputCursorPoint4      562, 308    80x 30
numero       NumericInputCursorPoint2      693, 308    80x 30
numero       NumericInputCursorPoint3      803, 308    80x 30
numero       NumericInputCursorPoint6      913, 308    80x 30
numero       NumericInputCursorPoint5     1023, 308    80x 30
texto        Text29                        646, 314    15x 18
texto        Text22                        646, 314    40x 18
texto        Text23                        270, 351    39x 39
texto_valor  StringDisplay4                317, 355   237x 30
navegacao    GotoDisplayButton5            364, 355   142x 30
numero       NumericInputCursorPoint22     562, 355    80x 30
numero       NumericInputCursorPoint7      693, 355    80x 30
numero       NumericInputCursorPoint21     803, 355    80x 30
numero       NumericInputCursorPoint24     913, 355    80x 30
numero       NumericInputCursorPoint23    1023, 355    80x 30
texto        Text30                        646, 361    15x 18
texto        Text24                        646, 361    40x 18
texto        Text25                        270, 398    39x 39
texto_valor  StringDisplay5                317, 402   237x 30
navegacao    GotoDisplayButton6            364, 402   142x 30
numero       NumericInputCursorPoint27     562, 402    80x 30
numero       NumericInputCursorPoint25     693, 402    80x 30
numero       NumericInputCursorPoint26     803, 402    80x 30
numero       NumericInputCursorPoint29     913, 402    80x 30
numero       NumericInputCursorPoint28    1023, 402    80x 30
texto        Text31                        646, 408    15x 18
texto        Text26                        646, 408    40x 18
texto        Text27                        270, 445    39x 39
texto_valor  StringDisplay6                317, 449   237x 30
numero       NumericInputCursorPoint32     562, 449    80x 30
numero       NumericInputCursorPoint30     693, 449    80x 30
numero       NumericInputCursorPoint31     803, 449    80x 30
numero       NumericInputCursorPoint34     913, 449    80x 30
numero       NumericInputCursorPoint33    1023, 449    80x 30
navegacao    GotoDisplayButton7            364, 450   142x 34
texto        Text32                        646, 455    15x 18
texto        Text28                        646, 455    40x 18
texto        Text7                         558, 529   260x 39
numero       NumericInputCursorPoint13     841, 532    80x 30
numero       NumericInputCursorPoint14     975, 532    80x 30
texto        Text12                       1066, 537    23x 19
texto        Text14                        927, 539    34x 19
texto        Text10                        646, 595   147x 39
numero       NumericInputCursorPoint15     841, 598    80x 30
numero       NumericInputCursorPoint12     975, 598    80x 30
texto        Text15                        927, 601    34x 19
texto        Text13                       1066, 602    23x 19
navegacao    MoveUpButton1                  14, 663    40x 40
navegacao    EnterButton1                  102, 663    65x 40
navegacao    MoveDownButton1               214, 663    40x 40
botao        MaintainedPushButton1         501, 692   150x 50
forma        Line1                         501, 692   150x 50
botao        MomentaryPushButton1          674, 692   260x 50
botao        MomentaryPushButton3          957, 692   150x 50
navegacao    GotoDisplayButton2           1142, 725   133x 62
```

Tags do CLP que esta tela usa (6):

```
MainProgram.L1_1000s
MainProgram.L2_1000s
MainProgram.L3_1000s
MainProgram.L4_1000s
MainProgram.L5_1000s
MainProgram.L6_1000s
```

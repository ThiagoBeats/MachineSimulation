// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.59/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function SalvarReceita(Texto, NomeReceita) {

                    var elementoExterno = $('<div></div>').css({
                        'display': 'flex',
                        'flex-direction': 'column',
                        'align-items': 'center',
                        'justify-content': 'space-between',
                        'width': '400px',
                        'height': 'auto',
                        //'background': 'rgb(2,0,36)',
                        //'background': 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 78%, rgba(145,0,162,1) 100%)',
                        'background': 'linear-gradient(145deg, #1e1e2e, #121212)',
                        'box-shadow': '0 0 10px rgba(0, 255, 204, 0.5)',
                        'border-radius': '15px',
                        'border': '3px solid #00ffcc',
                        'padding': '20px',
                        'word-break': 'break-word',
                        'overflow-wrap': 'break-word',
                        'white-space': 'normal'
                    });

                    var texto = $('<div>' + Texto + '</div>').css({
                        'width': '100%',
                        'height': 'auto',
                        'font-size': '30px',
                        'text-align': 'center',
                        'color': 'white',
                        'margin-bottom': '15px'
                    });

                var inputTexto = $('<input type="text" placeholder="Digite aqui..." spellcheck="false" value="' + NomeReceita + '">').css({
                        'width': '100%',
                        'height': '40px',
                        'border': '1px solid gray',
                        'border-radius': '5px',
                        'font-size': '18px',
                        'padding': '5px',
                        'box-sizing': 'border-box'
                    });

                    var botoesContainer = $('<div></div>').css({
                        'display': 'flex',
                        'justify-content': 'space-between',
                        'gap': '20px',
                        'margin-top': '20px',
                        'width': '100%'
                    });

                    var botaoSalvar = $('<button>SALVAR</button>').css({
                        'color': 'rgb(90, 220, 2)',
                        'border-width': '1px',
                        'border-style': 'solid',
                        'border-radius': '5px',
                        'border-color': 'rgb(25, 75, 105)',
                        'z-index': '0',
                        'background-image': 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(25, 75, 105) 100%)',
                        'width': '150px',
                        'height': '40px'
                    });

                    var botaoCancelar = $('<button>CANCELAR</button>').css({
                        'color': 'rgb(220, 90, 2)',
                        'border-width': '1px',
                        'border-style': 'solid',
                        'border-radius': '5px',
                        'border-color': 'rgb(105, 25, 25)',
                        'z-index': '0',
                        'background-image': 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(105, 25, 25) 100%)',
                        'width': '150px',
                        'height': '40px'
                    });

                    botaoSalvar.on('click', function (e) {
                        var valorTexto = inputTexto.val();
                        if (valorTexto != '') {
                            TcHmi.Symbol.writeEx('%s%PLC1.Receitas.NomeReceita%/s%', valorTexto);
                            TcHmi.Symbol.writeEx('%s%PLC1.Receitas.Salvar%/s%', 1);
                            TcHmi.TopMostLayer.remove(this, elementoExterno);

                            // Adiciona um delay de 500ms antes da leitura
                            setTimeout(function () {
                                TcHmi.Symbol.readEx2('%s%PLC1.Receitas.NomeExistente%/s%', function (data) {
                                    if (data.error === TcHmi.Errors.NONE) {
                                        // Handle result value... 
                                        var value = data.value;
                                        console.log(value);
                                        if (value == true) {
                                            TcHmi.Functions.HMI_TRATADORA_B300.Alert2(valorTexto + ' JÁ EXISTE');
                                        } else {
                                            TcHmi.Functions.HMI_TRATADORA_B300.Alert2(valorTexto + ' SALVA');
                                            TcHmi.Symbol.writeEx("%s%PLC1.BancoDeDados.ComandoSalvar[113]%/s%", 1)                                   }
                                    } else {
                                        // Handle error... 
                                        console.error('Erro ao ler o símbolo:', data.error);
                                    }
                                });
                            }, 500); // 500ms de atraso
                        } else {
                            TcHmi.Functions.HMI_TRATADORA_B300.Alert2("ESCOLHA UM NOME VÁLIDO")
                        }
                    });


                    botaoCancelar.on('click', function (e) {
                        console.log('Cancelar clicado');
                        TcHmi.TopMostLayer.remove(this, elementoExterno);
                    });

                    botoesContainer.append(botaoSalvar);
                    botoesContainer.append(botaoCancelar);

                    elementoExterno.append(texto);
                    elementoExterno.append(inputTexto);
                    elementoExterno.append(botoesContainer);

                    TcHmi.TopMostLayer.addEx(elementoExterno, {
                        centerHorizontal: true,
                        centerVertical: true,
                        removeCb: (data) => {
                            if (data.canceled) {
                                TcHmi.TopMostLayer.remove(this, elementoExterno);
                            }
                        }
                    });
                }

            HMI_TRATADORA_B300.SalvarReceita = SalvarReceita;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('SalvarReceita', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.SalvarReceita);

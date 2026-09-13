// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.59/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function CarregaReceita(NomeReceita) {



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

                var texto = $('<div>CARREGAR ' + NomeReceita + ' NA MÁQUINA?</div>').css({
                    'width': '100%',
                    'height': 'auto',
                    'font-size': '30px',
                    'text-align': 'center',
                    'color': 'white'
                });

                var botoesContainer = $('<div></div>').css({
                    'display': 'flex',
                    'justify-content': 'space-between',
                    'gap': '20px',
                    'margin-top': '20px',
                    'width': '100%'
                });

                var botaoConfirmar = $('<button>Carregar</button>').css({
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

                var botaoCancelar = $('<button>Cancelar</button>').css({
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

                botaoConfirmar.on('click', function (e) {
                    console.log('Confirmar clicado');
                    
                    if (NomeReceita != '') {
                        TcHmi.Symbol.writeEx('%s%PLC1.Receitas.CarregarReceita%/s%', 1)
                        TcHmi.Symbol.writeEx('%ctrl%REGIONPANTALLAS::TargetContent%/ctrl%', 'PANTALLAS/PRINCIPAL.content')
                        TcHmi.Symbol.writeEx('%ctrl%ContainerNAVEGACION::Visibility%/ctrl%', 'Visible')
                        TcHmi.Symbol.writeEx('%ctrl%Container_MANUAL-AUTO::Visibility%/ctrl%', 'Visible')
                        TcHmi.Symbol.writeEx('%ctrl%ToggleButton_PRINCIPAL::ToggleState%/ctrl%', 'Active')
                        TcHmi.Symbol.writeEx('%ctrl%Container_OPERACION::Visibility%/ctrl%', 'Visible')
                        TcHmi.TopMostLayer.remove(this, elementoExterno);
                        TcHmi.Symbol.writeEx('%s%PLC1.BancoDeDados.ComandoSalvar[114]%/s%', true)
                        TcHmi.Functions.HMI_TRATADORA_B300.Alert2(NomeReceita + ' CARREGADA')
                    } else {
                        TcHmi.Functions.HMI_TRATADORA_B300.Alert2("ESCOLHA UMA RECEITA VÁLIDA")
                        TcHmi.TopMostLayer.remove(this, elementoExterno);
                    }
                });

                botaoCancelar.on('click', function (e) {
                    console.log('Cancelar clicado');
                    //TcHmi.Functions.HMI_TRATADORA_B300.Alert2("testettef")
                    TcHmi.TopMostLayer.remove(this, elementoExterno);
                });

                botoesContainer.append(botaoConfirmar);
                botoesContainer.append(botaoCancelar);

                elementoExterno.append(texto);
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
            HMI_TRATADORA_B300.CarregaReceita = CarregaReceita;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('CarregaReceita', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.CarregaReceita);

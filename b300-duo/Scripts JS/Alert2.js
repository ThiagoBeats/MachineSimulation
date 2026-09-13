// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.59/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function Alert2(par1) {

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
                    'border-radius': '10px',
                    'border': '3px solid #00ffcc',
                    'padding': '20px',
                    'gap':'40px',
                    'word-break': 'break-word',
                    'overflow-wrap': 'break-word',
                    'white-space': 'normal'
                });

                var texto = $('<div>' + par1 + '</div>').css({
                    'width': '100%',
                    'height': 'auto',
                    'font-size': '25px',
                    'text-align': 'center',
                    'color': 'white'
                });

                var botao = $('<button>OK</button>').css({
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

                botao.on('click', function (e) {
                    TcHmi.TopMostLayer.remove(this, elementoExterno)
                    //this.off('click')
                })

                elementoExterno.append(texto);
                elementoExterno.append(botao);

                TcHmi.TopMostLayer.addEx(elementoExterno, {
                    centerHorizontal: true,
                    centerVertical: true,
                    removeCb: (data) => {
                        if (data.canceled) {
                            TcHmi.TopMostLayer.remove(this, elementoExterno)
                        }
                    }
                });
            }
            HMI_TRATADORA_B300.Alert2 = Alert2;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('Alert2', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.Alert2);

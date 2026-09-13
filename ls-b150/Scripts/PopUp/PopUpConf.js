// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.59/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function PopUpConf(ShowText, Symbol, State, ConfText) {

                let loc = TcHmi.Functions.Beckhoff;

                var externalElement = $('<div></div>').css({
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
                }).addClass('tchmi-class-fadein');

                var text = $('<div>' + ShowText + '</div>').css({
                    'width': '100%',
                    'height': 'auto',
                    'font-size': '30px',
                    'text-align': 'center',
                    'color': 'white'
                });

                var buttonContainer = $('<div></div>').css({
                    'display': 'flex',
                    'justify-content': 'space-between',
                    'gap': '20px',
                    'margin-top': '20px',
                    'width': '100%'
                });

                var buttonConfirm = $('<button>' + loc.GetLocalizedText('Confirm') + '</button>').css({
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

                var buttonCancel = $('<button>' + loc.GetLocalizedText('Cancel') + '</button>').css({
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

                buttonConfirm.on('click', function (e) {
                    TcHmi.TopMostLayer.remove(this, externalElement);
                    TcHmi.Server.writeSymbol(Symbol.__symbol.__expression.__fullName, State);
                    if (ConfText != '') {
                        TcHmi.Functions.HMI_TRATADORA_B300.PopUpAlert(ConfText);
                    }
                });

                buttonCancel.on('click', function (e) {
                   TcHmi.TopMostLayer.remove(this, externalElement);
                });

                buttonContainer.append(buttonConfirm);
                buttonContainer.append(buttonCancel);

                externalElement.append(text);
                externalElement.append(buttonContainer);

                TcHmi.TopMostLayer.addEx(externalElement, {
                    centerHorizontal: true,
                    centerVertical: true,
                    removeCb: (data) => {
                        if (data.canceled) {
                            TcHmi.TopMostLayer.remove(this, externalElement);
                        }
                    }
                });             
            }
            HMI_TRATADORA_B300.PopUpConf = PopUpConf;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('PopUpConf', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.PopUpConf);

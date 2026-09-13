// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.54/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var B120_HMI;
        (function (B120_HMI) {
            function PopUpSaveRecipe(RecipeName) {
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

                var text = $('<div>' + loc.GetLocalizedText('SaveRecipe') + '</div>').css({
                    'width': '100%',
                    'height': 'auto',
                    'font-size': '30px',
                    'text-align': 'center',
                    'color': 'white',
                    'margin-bottom': '15px'
                });

                var inputText = $('<input type="text" placeholder="..." spellcheck="false" value="' + RecipeName + '">').css({
                    'width': '100%',
                    'height': '40px',
                    'border': '1px solid gray',
                    'border-radius': '5px',
                    'font-size': '18px',
                    'padding': '5px',
                    'box-sizing': 'border-box'
                });

                var buttonContainer = $('<div></div>').css({
                    'display': 'flex',
                    'justify-content': 'space-between',
                    'gap': '20px',
                    'margin-top': '20px',
                    'width': '100%'
                });

                var buttonConfirm = $('<button>' + loc.GetLocalizedText('Save') + '</button>').css({
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
                    var textValue = inputText.val();
                    if (textValue != '') {
                        TcHmi.Server.writeSymbol('PLC1.Recipes.InterfaceRecipe.RecipeName', textValue);
                        TcHmi.Server.writeSymbol('PLC1.RecipesLogic.SaveRecipe', true);
                        TcHmi.TopMostLayer.remove(this, externalElement);

                        // Adiciona um delay de 500ms antes da leitura
                        setTimeout(function () {
                            TcHmi.Symbol.readEx2('%s%PLC1.RecipesLogic.ExistingName%/s%', function (data) {
                                if (data.error === TcHmi.Errors.NONE) {
                                    // Handle result value... 
                                    var value = data.value;
                                    console.log(value);
                                    if (value == true) {
                                        TcHmi.Functions.HMI_TRATADORA_B300.PopUpAlert(textValue + ' ' + loc.GetLocalizedText('AlreadyExists'));
                                    } else {
                                        TcHmi.Functions.HMI_TRATADORA_B300.PopUpAlert(textValue + ' ' + loc.GetLocalizedText('Saved'));
                                    }
                                } else {
                                    // Handle error... 
                                    console.error('Erro ao ler o símbolo:', data.error);
                                }
                            });
                        }, 500); // 500ms de atraso
                    } else {
                        TcHmi.TopMostLayer.remove(this, externalElement);
                        TcHmi.Functions.HMI_TRATADORA_B300.PopUpAlert(loc.GetLocalizedText('ValidName'))
                    }
                });


                buttonCancel.on('click', function (e) {
                    console.log('Cancelar clicado');
                    TcHmi.TopMostLayer.remove(this, externalElement);
                });

                buttonContainer.append(buttonConfirm);
                buttonContainer.append(buttonCancel);

                externalElement.append(text);
                externalElement.append(inputText);
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
            B120_HMI.PopUpSaveRecipe = PopUpSaveRecipe;
        })(B120_HMI = Functions.B120_HMI || (Functions.B120_HMI = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('PopUpSaveRecipe', 'TcHmi.Functions.B120_HMI', TcHmi.Functions.B120_HMI.PopUpSaveRecipe);

// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.46/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var B120_HMI;
        (function (B120_HMI) {
            function PopUpLiquidsList() {

                TcHmi.Symbol.readEx2('%s%PLC1.MachineParameters.LiquidsQty%/s%', function (data) {
                    if (data.error === TcHmi.Errors.NONE) {

                        var LiquidsQty = data.value;
                        
                        var externalElement = $('<div></div>').css({
                            'display': 'flex',
                            'flex-direction': 'column',
                            'overflow': 'auto',
                            'align-items': 'center',
                            'justify-content': 'space-between',
                            'width': 'auto',
                            'min-width': '400px',
                            'height': 'auto',
                            'max-height': '80%',
                            'border-radius': '15px',
                            'padding': '20px',
                            'word-break': 'break-word',
                            'overflow-wrap': 'break-word',
                            'white-space': 'normal'
                        }).addClass('tchmi-class-clBGContainer').addClass('tchmi-class-clBorderHighlight').addClass('tchmi-class-fadein');

                        var headerText = $('<div>SELECIONE UM LÍQUIDO</div>').css({
                            'width': '100%',
                            'height': 'auto',
                            'font-size': '24px',
                            'text-align': 'center',
                        }).addClass('tchmi-class-textColor');

                        // Container para os botões
                        var buttonsContainer = $('<div></div>').css({
                            'display': 'flex',
                            'flex-direction': 'column',
                            'gap': '10px',
                            'margin-top': '20px',
                            'width': '100%',
                            'height': '100%',
                            'align-items': 'center',
                            'justify-content': 'flex-start',
                        });

                        // Criação dos botões para os líquidos
                        for (let i = 1; i <= LiquidsQty; i++) {
                            var buttonLiquid = $('<div>LÍQUIDO ' + i + '</div>').css({
                                'border-radius': '5px',
                                'width': '80%',
                                'height': '40px',
                                'cursor': 'pointer',
                                'text-align': 'center',
                                'line-height': '40px'
                            }).addClass('tchmi-class-clBtBlue').addClass('tchmi-class-textColor').addClass('tchmi-button').addClass('tchmi-button-template-content-text');

                            buttonLiquid.on('click', function (e) {
                                console.log('Selecionado: Líquido ' + i);

                                switch (i) {
                                    case 1:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_01.content');
                                        break;
                                    case 2:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_02.content');
                                        break;
                                    case 3:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_03.content');
                                        break;
                                    case 4:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_04.content');
                                        break;
                                    case 5:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_05.content');
                                        break;
                                    case 6:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_06.content');
                                        break;
                                    case 7:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_07.content');
                                        break;
                                    case 8:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_08.content');
                                        break;
                                    case 9:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_09.content');
                                        break;
                                    case 10:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_10.content');
                                        break;
                                    case 11:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_11.content');
                                        break;
                                    case 12:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_12.content');
                                        break;
                                    case 13:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_13.content');
                                        break;
                                    case 14:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_14.content');
                                        break;
                                    case 15:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_15.content');
                                        break;
                                    case 16:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_16.content');
                                        break;
                                    case 17:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_17.content');
                                        break;
                                    case 18:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_18.content');
                                        break;
                                    case 19:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_19.content');
                                        break;
                                    case 20:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_20.content');
                                        break;
                                    case 21:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_21.content');
                                        break;
                                    case 22:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_22.content');
                                        break;
                                    case 23:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_23.content');
                                        break;
                                    case 24:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_24.content');
                                        break;
                                    case 25:
                                        TcHmi.Symbol.writeEx('%ctrl%TcHmiRegion::TargetContent%/ctrl%', 'Telas/Liquidos/Liquido_25.content');
                                        break;
                                    default:
                                        console.log('⚠️ Opção inválida! Escolha um número entre 1 e 10.');
                                }

                                TcHmi.TopMostLayer.remove(this, externalElement);
                            });

                            buttonsContainer.append(buttonLiquid);
                        }
                
                        externalElement.append(headerText);
                        externalElement.append(buttonsContainer);

                        // Adiciona a popup à camada superior
                        TcHmi.TopMostLayer.addEx(externalElement, {
                            centerHorizontal: true,
                            centerVertical: true,
                            removeCb: (data) => {
                                if (data.canceled) {
                                    TcHmi.TopMostLayer.remove(this, externalElement);
                                }
                            }
                        });

                    } else {
                        console.log("Error");
                    }
                });
            }
            B120_HMI.PopUpLiquidsList = PopUpLiquidsList;
        })(B120_HMI = Functions.B120_HMI || (Functions.B120_HMI = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('PopUpLiquidsList', 'TcHmi.Functions.B120_HMI', TcHmi.Functions.B120_HMI.PopUpLiquidsList);

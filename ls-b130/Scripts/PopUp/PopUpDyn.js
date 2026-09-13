// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.54/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var B120_HMI;
        (function (B120_HMI) {
            function PopUpDyn(id, targetFile, height, width, classes) {
                if (!id || !targetFile || !targetFile.path) {
                    console.error('DynPopup: Missing required parameters');
                    return;
                }

                var regionId = 'Region_' + id;
                var popUpId = 'popUp_' + id;
                var type;

                // Create the region FIRST using ControlFactory
                var regionParameters = {
                    'data-tchmi-top-unit': '%',
                    'data-tchmi-height': height,
                    'data-tchmi-height-unit': '%',
                    'data-tchmi-width': width,
                    'data-tchmi-width-unit': '%',
                    'data-tchmi-class-names': classes
                };

                if (targetFile.path.toLowerCase().endsWith('.usercontrol')) {
                    regionParameters['data-tchmi-target-user-control'] = targetFile.path;
                    type = 'TcHmi.Controls.System.TcHmiUserControlHost';

                  let attributes = targetFile.attributes;
                    for (const key in attributes) {
                        if (attributes.hasOwnProperty(key)) {
                            regionParameters[key] = attributes[key];
                        }
                    }

                } else {
                    regionParameters['data-tchmi-target-content'] = targetFile.path;
                    type = 'TcHmi.Controls.System.TcHmiRegion';
                }

                // Create region using ControlFactory
                const regionElement = TcHmi.ControlFactory.createEx(type, regionId, regionParameters);

                // Wait for region to be ready
                setTimeout(function () {
                    var regionControl = TcHmi.Controls.get(regionId);
                    if (!regionControl) {
                        console.error('DynPopup: Region control not found');
                        return;
                    }

                    var regionDomElement = regionControl.getElement();
                    if (!regionDomElement) {
                        console.error('DynPopup: Region has no DOM element');
                        return;
                    }

                    // Create popup container with ABSOLUTE positioning and full viewport coverage
                    var $popUpElement = $('<div>').attr('id', popUpId).css({});

                    // Style and append the region
                    $(regionDomElement).css({
                        'background-color': 'transparent',
                        'overflow': 'hidden',
                        'display': 'flex',
                        'align-self': 'anchor-center',
                        'justify-self': 'center',
                        'margin': 'auto auto',
                        'left': '1px',
                        'right': '1px',
                        'top':  '1px',
                        'bottom': '1px'
                    }).addClass('tchmi-class-center');;

                    $popUpElement.append(regionDomElement);

                    // Add to TopMostLayer
                    TcHmi.TopMostLayer.addEx($popUpElement, {
                        removeCb: function (data) {
                            TcHmi.TopMostLayer.remove(this, $popUpElement);
                            if (regionControl && regionControl.destroy) {
                                regionControl.destroy();
                            }
                        }
                    });

                    console.log('DynPopup: Modal created successfully');
                }, 100);
            }
            B120_HMI.PopUpDyn = PopUpDyn;
        })(B120_HMI = Functions.B120_HMI || (Functions.B120_HMI = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('PopUpDyn', 'TcHmi.Functions.B120_HMI', TcHmi.Functions.B120_HMI.PopUpDyn);

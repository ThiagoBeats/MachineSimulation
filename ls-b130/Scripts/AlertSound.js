// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.54/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var B120_HMI;
        const SoundOnClick = new Audio('Sound/alert.wav');
        (function (B120_HMI) {
            function AlertSound() {
                SoundOnClick.play();
            }
            B120_HMI.AlertSound = AlertSound;
        })(B120_HMI = Functions.B120_HMI || (Functions.B120_HMI = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('AlertSound', 'TcHmi.Functions.B120_HMI', TcHmi.Functions.B120_HMI.AlertSound);

// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.46/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function MinToH_Min(par1) {
                let days = Math.floor(par1 / 1440);
                let remainingMinutes = par1 % 1440;
                let hours = Math.floor(remainingMinutes / 60);
                return `${days} dias e ${hours} horas`;
            }
            HMI_TRATADORA_B300.MinToH_Min = MinToH_Min;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('MinToH_Min', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.MinToH_Min);

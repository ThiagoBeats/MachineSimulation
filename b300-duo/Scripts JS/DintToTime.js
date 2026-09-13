// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.46/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function DintToTime(par1) {
                console.log(10);
                let totalSeconds = Math.floor(par1);

                let hours = Math.floor(totalSeconds / 3600);
                let minutes = Math.floor((totalSeconds % 3600) / 60);
                let seconds = totalSeconds % 60;

                //console.log(`${hours}h ${minutes}m ${seconds}s`);
                return `${hours}h ${minutes}m ${seconds}s`;
            }
            HMI_TRATADORA_B300.DintToTime = DintToTime;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('DintToTime', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.DintToTime);

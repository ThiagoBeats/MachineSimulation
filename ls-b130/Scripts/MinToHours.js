// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.54/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var B120_HMI;
        (function (B120_HMI) {
            function MinToHours(Minutes) {
                let horas = Math.floor(Minutes / 60);
                let mins = Minutes % 60;

                let texto = '';

                // Se tiver horas
                if (horas > 0) {
                    let textoHora = (horas === 1) ? 'hora' : 'horas';
                    texto = `${horas} ${textoHora}`;
                }

                // Se tiver minutos
                if (mins > 0) {
                    let textoMinuto = (mins === 1) ? 'minuto' : 'minutos';

                    // Se já tem horas, adiciona "e"
                    texto += (horas > 0 ? ' e ' : '');
                    texto += `${mins} ${textoMinuto}`;
                }

                // Caso extremo: 0 minutos
                if (horas === 0 && mins === 0) {
                    texto = '0 minutos';
                }

                return texto;
            }

            B120_HMI.MinToHours = MinToHours;
        })(B120_HMI = Functions.B120_HMI || (Functions.B120_HMI = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('MinToHours', 'TcHmi.Functions.B120_HMI', TcHmi.Functions.B120_HMI.MinToHours);

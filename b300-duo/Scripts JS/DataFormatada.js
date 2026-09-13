// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.46/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function DataFormatada(par1) {
                // O valor UDINT representa segundos desde 01/01/1970 (Unix Timestamp)
                const date = new Date(par1 * 1000); // Multiplicamos por 1000 para converter para milissegundos

                // Formatamos a data para o formato desejado
                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mês começa do zero
                const year = date.getUTCFullYear();
                const hours = String(date.getUTCHours() - 3).padStart(2, '0');
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');

                return `${day}/${month}/${year}`;
            }
            HMI_TRATADORA_B300.DataFormatada = DataFormatada;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('DataFormatada', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.DataFormatada);

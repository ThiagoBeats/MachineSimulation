// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.59/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var HMI_TRATADORA_B300;
        (function (HMI_TRATADORA_B300) {
            function Calendario(par1) {
                var elementoExterno = $('<div></div>').css({
                    'display': 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                    'justify-content': 'space-between',
                    'width': '400px',
                    'height': 'auto',
                    'background': 'linear-gradient(145deg, #1e1e2e, #121212)',
                    'box-shadow': '0 0 10px rgba(0, 255, 204, 0.5)',
                    'border-radius': '15px',
                    'border': '3px solid #00ffcc',
                    'padding': '20px',
                    'word-break': 'break-word',
                    'overflow-wrap': 'break-word',
                    'white-space': 'normal'
                });

                var texto = $('<div>SELECIONE DATA E HORA</div>').css({
                    'width': '100%',
                    'height': 'auto',
                    'font-size': '30px',
                    'text-align': 'center',
                    'color': 'white'
                });

                var selectorContainer = $('<div></div>').css({
                    'display': 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                    'margin-bottom': '20px',
                    'width': '100%'
                });

                var monthYearSelector = $('<div></div>').css({
                    'display': 'flex',
                    'gap': '10px',
                    'margin-bottom': '20px'
                });

                var monthSelect = $('<select></select>').css({
                    'padding': '5px',
                    'border-radius': '5px',
                    'border': '1px solid #ccc',
                    'background': '#444444',
                    'color': '#ffffff'
                });

                for (let i = 0; i < 12; i++) {
                    monthSelect.append($('<option></option>').val(i).text(new Date(0, i).toLocaleString('default', { month: 'long' })));
                }

                var yearInput = $('<input type="number" placeholder="Ano" min="2000" max="2100" />').css({
                    'padding': '10px',  // Aumentando o padding
                    'border-radius': '5px',
                    'border': '1px solid #ccc',
                    'width': '100px',  // Aumentando a largura
                    'background': '#444444',
                    'color': '#ffffff'
                });

                monthYearSelector.append(monthSelect);
                monthYearSelector.append(yearInput);
                selectorContainer.append(monthYearSelector);

                var calendarContainer = $('<div id="calendar"></div>').css({
                    'display': 'grid',
                    'grid-template-columns': 'repeat(7, 1fr)',
                    'gap': '5px',
                    'margin-bottom': '20px',
                    'width': '100%'
                });

                let selectedDayElement; // Variável para armazenar o dia selecionado

                function renderCalendar(month, year) {
                    calendarContainer.empty();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();

                    for (let i = 0; i < firstDay; i++) {
                        calendarContainer.append($('<div></div>').css({ 'height': '40px' })); // Espaços vazios
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                        var dayElement = $('<div>' + day + '</div>').css({
                            'border': '1px solid #00ffcc',
                            'border-radius': '5px',
                            'padding': '10px',
                            'text-align': 'center',
                            'cursor': 'pointer',
                            'transition': 'background-color 0.3s',
                            'background': '#444444',
                            'color': '#ffffff'
                        }).hover(
                            function () {
                                $(this).css('background-color', '#006699'); // Efeito de hover
                            },
                            function () {
                                if (!$(this).hasClass('selected')) {
                                    $(this).css('background-color', '#444444'); // Volta ao escuro
                                }
                            }
                        );

                        dayElement.on('click', function () {
                            // Remove a seleção do dia anterior, se existir
                            if (selectedDayElement) {
                                selectedDayElement.removeClass('selected').css('background-color', '#444444');
                            }

                            // Seleciona o novo dia
                            selectedDayElement = $(this);
                            selectedDayElement.addClass('selected').css('background-color', '#00ccff'); // Marca o dia selecionado
                        });

                        calendarContainer.append(dayElement);
                    }
                }

                monthSelect.on('change', function () {
                    renderCalendar(this.value, yearInput.val());
                });

                yearInput.on('change', function () {
                    renderCalendar(monthSelect.val(), this.value);
                });

                renderCalendar(new Date().getMonth(), new Date().getFullYear());

                var timeContainer = $('<div></div>').css({
                    'display': 'flex',
                    'gap': '10px',
                    'margin-top': '20px'
                });

                var hourInput = $('<input type="number" placeholder="HH" min="0" max="23" />').css({
                    'padding': '10px',  // Aumentando o padding
                    'border-radius': '5px',
                    'border': '1px solid #ccc',
                    'width': '70px',  // Aumentando a largura
                    'background': '#444444',
                    'color': '#ffffff'
                });

                var minuteInput = $('<input type="number" placeholder="MM" min="0" max="59" />').css({
                    'padding': '10px',  // Aumentando o padding
                    'border-radius': '5px',
                    'border': '1px solid #ccc',
                    'width': '70px',  // Aumentando a largura
                    'background': '#444444',
                    'color': '#ffffff'
                });

                timeContainer.append(hourInput);
                timeContainer.append(minuteInput);
                selectorContainer.append(timeContainer);

                elementoExterno.append(texto);
                elementoExterno.append(selectorContainer);
                elementoExterno.append(calendarContainer);

                var botaoConfirmar = $('<button>Confirmar</button>').css({
                    'color': 'rgb(90, 220, 2)',
                    'border-width': '1px',
                    'border-style': 'solid',
                    'border-radius': '5px',
                    'border-color': 'rgb(25, 75, 105)',
                    'background-image': 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(25, 75, 105) 100%)',
                    'width': '150px',
                    'height': '40px',
                    'margin-top': '20px'
                });

                botaoConfirmar.on('click', function (e) {
                    const selectedDay = selectedDayElement ? selectedDayElement.text() : null;
                    const selectedMonth = monthSelect.val();
                    const selectedYear = yearInput.val();
                    const selectedHour = hourInput.val();
                    const selectedMinute = minuteInput.val();

                    // Verificações
                    if (!selectedDay) {
                        console.log("Por favor, selecione um dia.");
                        TcHmi.Functions.HMI_TRATADORA_B300.Alert2("Por favor, selecione um dia.");
                    } else if (!selectedMonth) {
                        console.log("Por favor, selecione um mês.");
                        TcHmi.Functions.HMI_TRATADORA_B300.Alert2("Por favor, selecione um mês.");
                    } else if (!selectedYear || selectedYear < 2000) {
                        console.log("Por favor, insira um ano válido (mínimo 2000).");
                        TcHmi.Functions.HMI_TRATADORA_B300.Alert2("Por favor, insira um ano válido (mínimo 2000).");
                    } else if (!selectedHour) {
                        console.log("Por favor, insira a hora.");
                        TcHmi.Functions.HMI_TRATADORA_B300.Alert2("Por favor, insira a hora.");
                    } else if (!selectedMinute) {
                        console.log("Por favor, insira os minutos.");
                        TcHmi.Functions.HMI_TRATADORA_B300.Alert2("Por favor, insira os minutos.");
                    } else {
                        // Atraso de 500 ms antes de executar as ações
                        setTimeout(function () {
                            TcHmi.Symbol.writeEx('%s%PLC1.MAIN.SetLocalTime.TIMESTR.wDay%/s%', selectedDay);
                            TcHmi.Symbol.writeEx('%s%PLC1.MAIN.SetLocalTime.TIMESTR.wMonth%/s%', parseInt(selectedMonth) + 1);
                            TcHmi.Symbol.writeEx('%s%PLC1.MAIN.SetLocalTime.TIMESTR.wYear%/s%', selectedYear);
                            TcHmi.Symbol.writeEx('%s%PLC1.MAIN.SetLocalTime.TIMESTR.wHour%/s%', selectedHour);
                            TcHmi.Symbol.writeEx('%s%PLC1.MAIN.SetLocalTime.TIMESTR.wMinute%/s%', selectedMinute);
                            TcHmi.Symbol.writeEx('%s%PLC1.MAIN.SetLocalTime.START%/s%', true);

                            // Todos os campos estão válidos
                            console.log('Dia:', selectedDay);
                            console.log('Mês:', parseInt(selectedMonth) + 1); // Mês é zero-indexado
                            console.log('Ano:', selectedYear);
                            console.log('Hora:', selectedHour);
                            console.log('Minuto:', selectedMinute);
                            TcHmi.Functions.HMI_TRATADORA_B300.Alert2("DATA E HORA ALTERADAS");
                        }, 500); // 500 ms de atraso
                    }
                });

                elementoExterno.append(botaoConfirmar);

                TcHmi.TopMostLayer.addEx(elementoExterno, {
                    centerHorizontal: true,
                    centerVertical: true,
                    removeCb: (data) => {
                        if (data.canceled) {
                            TcHmi.TopMostLayer.remove(this, elementoExterno);
                        }
                    }
                });
            }
            HMI_TRATADORA_B300.Calendario = Calendario;
        })(HMI_TRATADORA_B300 = Functions.HMI_TRATADORA_B300 || (Functions.HMI_TRATADORA_B300 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('Calendario', 'TcHmi.Functions.HMI_TRATADORA_B300', TcHmi.Functions.HMI_TRATADORA_B300.Calendario);

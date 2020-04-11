Plotly.d3.json('master_list.json', function(err, data) {


    function unpack(rows, key) {
        return rows.map(function(row) {
            return row[key];
        });
    }

    function assignOptions(textArray, selector) {
        for (var i = 0; i < textArray.length; i++) {
            var currentOption = document.createElement('option');
            currentOption.text = textArray[i];
            selector.appendChild(currentOption);
        }
    }

    function get_state_names(data) {
        var location = [];
        for (i in data[0]) {
            if (i != "day") {
                location.push(i);
            }
        }
        return location;
    }

    function get_state_val(state) {
        stateValue = [];
        for (i in data) {
            stateValue.push(data[i][state]);
        }
        return stateValue;
    }

    function plot_everyday_data(state) {
        var cummulative_data = get_state_val(state);
        everyday = [];
        for (var i = 0; i < cummulative_data.length - 1; i++) {
            everyday.push(cummulative_data[i + 1] - cummulative_data[i]);
        }
        var trace1 = {
            y: days,
            x: everyday,
            name: "new cases",
            type: 'bar',
            orientation: 'h',
            text: everyday.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            marker: {
                color: '#0B3398'
            }
        };
        var data = [trace1];
        var layout = {
            xaxis: {
                title: 'Count of New Identified Patients'
            },
            autosize: true,
            margin: {
                l: 50,
                r: 10,
                b: 60,
                t: 50,
                pad: 4
            },
        }
        Plotly.newPlot("new_chart", data, layout, {
            staticPlot: true
        });

    }

    function setBubblePlot(chosenState, plotname) {
        get_state_val(chosenState);
        var trace1 = {
            x: days,
            y: stateValue,
            text: stateValue,
            textposition: 'top',
            mode: 'lines+markers+text',
            marker: {
                size: 6,
                opacity: 0.5,
                color: '#0B3398'
            },
            line: {
                shape: 'spline'
            }
        };
        var data = [trace1];

        var layout = {
            yaxis: {
                title: 'Total Number of Patients'
            },
            autosize: true,
            margin: {
                l: 60,
                r: 10,
                b: 70,
                t: 30,
                pad: 4
            },
        }

        Plotly.newPlot(plotname, data, layout, {
            staticPlot: true
        });
    };

    function updateState() {
        setBubblePlot(stateSelector.value, 'state_chart');
    };

    function set_data() {
        $("#today").html(everyday[everyday.length - 1]);
        var las7days = 0;
        var last15days = 0;

        for (var i = 0; i < everyday.length; i++) {
            if (i >= everyday.length - 7) {
                las7days = las7days + everyday[i];
            }
            last15days = last15days + everyday[i];
        }
        $("#last7days").html(las7days);
        $("#patientRate").html(Math.round(last15days / everyday.length));
    };

    var days = unpack(data, 'day');
    var stateValue = [];
    var everyday = [];
    var location = get_state_names(data);

    var stateSelector = document.querySelector('.state');
    assignOptions(location.slice(1), stateSelector);


    // Default Cumullative Country Data
    setBubblePlot('india', 'cumulative_chart');

    // Everyday Country Data
    plot_everyday_data("india");
    // Newly Identified data setting
    set_data();

    // Default State Data
    setBubblePlot(location[1], 'state_chart');

    stateSelector.addEventListener('change', updateState, false);
});

Plotly.d3.json('last_updated.json', function(err, data) {
    $("#date-time").html(data["date-time"]);
    $("#confirmed").html(data["confirmed"]);
    $("#active").html(data["active"]);
    $("#recovered").html(data["recovered"]);
    $("#deceased").html(data["deceased"]);
});
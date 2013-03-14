// do we haz localstorage?

var localStorageTest = (function() {
    try {
        var mod = new Date();
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
})();

var $dataInput = $('#data-input');
var $processButton = $('#process-button');
var $tableOutput = $('#table-output');
var $displayArea = $('#display-area');
var $optionsToggle = $('#options-toggle');
var $dataInputType = $('#data-input-type');
var $tableType = $('#table-type');
var $tableHeader = $('#table-header');
var $tableSource = $('#table-source');
var $tableSourceUrl = $('#table-source-url');
var $previousSelect = $('#previous-select');

function getStoredTablesAsJSON() {
    if (!localStorage.getItem('tables')) {
        localStorage.setItem('tables', JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem('tables'));
}

function addToStoredTables(tableArray) {
    var tables = getStoredTablesAsJSON();
    var tablesLength = tables.length;
    if (tablesLength > 9) {
        tables.splice(0, 1);
    }
    tables.push(tableArray);
    localStorage.setItem('tables', JSON.stringify(tables));
    return false;
}

function buildPreviousDropdown(tablesArray) {
    $previousSelect.empty().append($('<option/>'));

    $.each(tablesArray.reverse(), function(i, v) {
        var header = v[0];
        var time = v.slice(-1);
        $previousSelect.append($('<option/>', {text: header + " | " + time, value: i}));
    });

    return false;
}

$processButton.on('click', function() {
    var data = $dataInput.val();
    var rows, payload, tableOutput, tableHeader, tableSource;

    var storage = [];

    if (!data) {
        alert('You forgot to put your data in!');
        return false;
    }

    var activeType = $dataInputType.find('.active').data('type');
    var tableType = $tableType.find('.active').data('type');

    if (activeType === 'tsv') {
        rows = d3.tsv.parseRows(data);
    }

    if (activeType === 'csv') {
        rows = d3.csv.parseRows(data);
    }

    tableOutput = buildTable(rows, tableType);

    if ($tableHeader.val()) {

        storage.push($tableHeader.val());

        tableHeader = $('<div/>', {
            text: $tableHeader.val()
        }).css({
            'text-align': 'center',
            'font-weight': 'bold',
            'font-size': '15px',
            'margin-top': '5px'
        });
    }

    if ($tableSource.val()) {

        storage.push($tableSource.val());

        if ($tableSourceUrl.val()) {

            storage.push($tableSourceUrl.val());

            tableSource = $('<div/>', {
                html: 'Source: ' + $('<div/>').append($('<a/>', {
                    text: $tableSource.val(),
                    href: $tableSourceUrl.val()
                }).clone()).html()
            }).css({
                'text-align': 'center',
                'font-style': 'italic',
                'font-size': '13px',
                'color': '#666666'
            });
        } else {
            tableSource = $('<div/>', {
                text: 'Source: ' + $tableSource.val()
            }).css({
                'text-align': 'center',
                'font-style': 'italic',
                'font-size': '13px',
                'color': '#666666'
            });
        }
    }

    payload = '<!-- Begin table embed -->\n\n';
    if (tableHeader) {
        payload += $('<div/>').append(tableHeader.clone()).html();
    }
    if (tableSource) {
        payload += $('<div/>').append(tableSource.clone()).html();
    }
    payload += tableOutput + '\n\n<!-- End table embed -->';

    $tableOutput.val(payload);
    $displayArea.html(payload);

    if (tableType === 'sortable') {
        $('table').tablesorter({
            textExtraction:'complex',
            widgets:['zebra'],
            widgetZebra:{css:['even','odd']}
        });
    }

    storage.push(data);
    var runtime = moment().format('M-D-YYYY h:mm:ss a');
    storage.push(runtime);

    if(localStorageTest) {
        addToStoredTables(storage);
        buildPreviousDropdown(getStoredTablesAsJSON());
    }

    $processButton.find('i').attr('class', 'icon-thumbs-up');

});

$optionsToggle.on('click', function() {
    $optionsToggle.find('i').toggleClass('icon-chevron-down');
});

function buildTable(rows, type) {

    var table = $('<table/>').addClass('data');
    if (type === 'basic') {
        table.addClass('basic');
    }

    if (type === 'sortable') {
        table.addClass('tablesorter');
    }

    var thead = $('<thead/>').append('<tr/>');
    var tbody = $('<tbody/>');

    $.each(rows[0], function(i,cell) {
        $('<th/>', {
            text: cell
        }).appendTo(thead.find('tr'));
    });

    rows.splice(0,1); // removes the header row

    $.each(rows, function(i,row) {
        $('<tr/>').appendTo(tbody);

        if (type === 'basic') {
            if ((i + 1) % 2 === 0) {
                tbody.find('tr').last().addClass('even');
            } else {
                tbody.find('tr').last().addClass('odd');
            }
        }

        $.each(row, function(i,cell) {
            $('<td/>', {
                text: cell
            }).appendTo(tbody.find('tr').last());
        });
    });

    thead.appendTo(table);
    tbody.appendTo(table);

    return $('<div/>').append(table.clone()).html();
}

$(document).ready( function() {
    buildPreviousDropdown(getStoredTablesAsJSON());
});

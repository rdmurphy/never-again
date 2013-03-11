var $dataInput = $('#data-input');
var $processButton = $('#process-button');
var $tableOutput = $('#table-output');
var $displayArea = $('#display-area');
var $optionsToggle = $('#options-toggle');
var $dataInputType = $('#data-input-type');
var $tableType = $('#table-type');

$processButton.on('click', function() {
    var data = $dataInput.val();
    var rows;

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

    var tableOutput = buildTable(rows, tableType);

    $processButton.find('i').attr('class', 'icon-thumbs-up');

    $tableOutput.val('<!-- Begin table embed -->\n\n' + tableOutput + '\n\n<!-- End table embed -->');
    $displayArea.html(tableOutput);

    if (tableType === 'sortable') {
        $('table').tablesorter({
            textExtraction:'complex',
            widgets:['zebra'],
            widgetZebra:{css:['even','odd']}
        });
    }
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

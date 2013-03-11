var $docInput = $('#doc-input');
var $processButton = $('#process-button');
var $embedOutput = $('#embed-output');
var $displayArea = $('#display-area');

var embedBegin = '<!-- Begin document embed -->\n\n<iframe style="width: 100%; height: 600px;" src="http://docs.google.com/viewer?url=';
var embedEnd = '&embedded=true" frameborder="0"></iframe>\n\n<!-- End document embed -->';



$processButton.on('click', function() {
    var payload = '';
    var url = $docInput.val();

    if (!url) {
        alert("You forgot to put a URL in!");
        return false;
    }

    url = encodeURIComponent(url);
    payload = embedBegin + url + embedEnd;

    $embedOutput.val(payload);
    $displayArea.html(payload);
    $processButton.find('i').attr('class', 'icon-thumbs-up');
    return false;
});

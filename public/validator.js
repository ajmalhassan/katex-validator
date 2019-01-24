$(document).ready(() => {

    let log = [];

    const baseURL = 'http://localhost:3500/api'

    const HttpService = (url, method, payload, customHeaders) => {
        method = method || 'GET';
        var ajaxObj = {
            type: method.toUpperCase(),
            url: '' + baseURL + url || ''
        }

        if (["POST", "PUT"].includes(method.toUpperCase())) {
            ajaxObj.data = JSON.stringify(payload || {})
        }

        if (customHeaders && Object.keys(customHeaders).length) {
            customKeys = Object.keys(customHeaders);
            for (let i = 0; i < customKeys.length; i++) {
                ajaxObj[customKeys[i]] = customHeaders[customKeys[i]];
            }
        }

        return $.ajax(ajaxObj);
    }


    function generateDownloadLink() {
        var a = document.querySelector('#generateBlock').appendChild(
            document.createElement("a")
        );
        a.download = "export.json";
        a.href = "data:text/json," + document.getElementById("logDom").innerHTML;
        a.innerHTML = "Click here to download log";
    }





    // listen for form submission
    $("#uploadForm").submit(function (e) {
        e.preventDefault();
        if ($('#question').val().length <= 0) return;
        $('#upload').prop('disabled', true).html('<span class="spinner">߷</span> Uploading JSON')
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/api/v1/submit/questions",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log('file uploaded');
                $('#question').val('');
                $('#upload').prop('disabled', false).html('Upload JSON')
            },
            error: function (err) {
                alert(err.responseJSON.message || 'Default: Something went wrong');
                $('#upload').prop('disabled', false).html('Upload JSON')
            }
        });

    });

    function getQuestions(pageNo) {
        return $.ajax({
            type: "POST",
            contentType: "application/json",
            url: 'http://localhost:3500/api/v1/questions/list',
            data: JSON.stringify({ page: pageNo, limit: 50 }),
            dataType: "json"
        })
            .then(data => {
                let nextPage = (data.page + 1) > data.pages ? null : (data.page + 1);
                let percentage = (nextPage / data.pages) * 100;
                $('.progress-bar').css('width', percentage + '%');
                runKatexValidator(data);
                if (!nextPage)
                    return 0;
                else
                    return getQuestions(nextPage);
            });
    }


    $('#runValidator').click(event => {
        $('#runValidator').prop("disabled", true);
        $('#dropQuestion').prop("disabled", true);
        getQuestions(1)
            .then(() => {
                alert('completed!');
                $('#logDom').html(JSON.stringify(log, null, 2));
                $('#runValidator').prop("disabled", false);
                $('#dropQuestion').prop("disabled", false);
                generateDownloadLink();
            });
    })

    $('#dropQuestion').click(event => {
        HttpService('/v1/questions/drop', 'DELETE')
            .then(res => {
                alert(res.message || 'Default: Questions dropped!!')
            }, err => {
                alert(err.message || 'Something went wrong')
            })
    })


    function runKatexValidator({ docs }) {
        const rendered = document.querySelector('#rendered');
        docs.forEach(question => {
            let keys = Object.keys(question);
            for (let i = 0; i < keys.length; i++) {
                if (!["question_id", "_id", "__v"].includes(keys[i])) {
                    rendered.innerHTML = `${question[keys[i]]}`;
                    renderMathInElement(rendered, {
                        throwOnError: true,
                        delimiters: [
                            { left: "\\(", right: "\\)", display: false },
                            { left: "$$", right: "$$", display: true }
                        ],
                        errorCallback: function (error, stack) {
                            log.push({
                                question: question.question_id,
                                key: keys[i],
                                error: `${stack}`
                            })
                        }
                    });
                }
            }
        });
    }

    window.getQuestions = getQuestions;



})
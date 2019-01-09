document.addEventListener("DOMContentLoaded", function (event) {

    var resultLog = [];

    var renderEl = document.getElementById('rendered');


    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event) {
        var arr = JSON.parse(event.target.result);
        processKatex(arr);
    }

    function processKatex(arr) {
        var t0 = performance.now();
        for (let i = 0; i < arr.length; i++) {
            let arrObjKeys = Object.keys(arr[i]);
            for (let j = 0; j < arrObjKeys.length; j++) {
                try {
                    katex.render(arr[i][arrObjKeys[j]], renderEl, {
                        throwOnError: true
                    });
                } catch (err) {
                    resultLog.push({ msg: err.message })
                }
            }
        }
        var t1 = performance.now();
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    }

    document.getElementById('file').addEventListener('change', onChange);


});
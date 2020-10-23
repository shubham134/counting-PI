$(document).ready(function () {

    // setup for box size
    totalSteps = 6;
    upperLimit = 400;
    lowerLimit = 40;
    step = (upperLimit - lowerLimit) / totalSteps;

    // setup PI digits
    precisionValue = 0;

    // setup PI count
    PICount = 0;
    $('#count').text(PICount);

    // setup sound
    sound = document.getElementById('tickSound');
    sound.playbackRate = 5;

    // create boxes (pos, size, mass, velocity)
    let box1 = new Box('#box1', 200, lowerLimit, 1, 0);
    let box2 = new Box('#box2', 400, 1, 1, 0);
    setPrecision();

    // show boxes
    showBox(box1);
    showBox(box2);
    showStats();

    /****************************************************************************************
     * Events functions
     ****************************************************************************************/

    // on precision change
    $('#precisionbar').on('change', function () {
        setPrecision();
        showBox(box1);
        showBox(box2);
        showStats();
    });

    // start rendering
    $('#render').on('click', async function () {
        PICount = 0;
        $('#count').text(PICount);
        box2.velocity = -2;
        showStats();
        disableInputs();
        await render();
        init();
        enableInputs();
    });


    /****************************************************************************************
     * Animation functions
     ****************************************************************************************/

    // show box
    function showBox(box) {
        if (box.id === '#box1') {
            if (box.pos > 0) {
                $(box.id).css('left', box.pos + 'px');
            } else {
                $(box.id).css('left', 2 + 'px');
            }
        }
        if (box.id === '#box2') {
            if (box.pos > lowerLimit) {
                $(box.id).css('left', box.pos + 'px');
            } else {
                $(box.id).css('left', (lowerLimit + 1) + 'px');
            }
        }
        //$(box.id).css('left', box.pos + 'px');
        $(box.id).css('width', box.size + 'px');
        $(box.id).css('height', box.size + 'px');
    }

    // rendering function
    async function render() {
        //var wallCollide = false;
        var over = false;
        while (!over) {
            var collide = false;
            box1.update();
            box2.update();
            if (box1.collide(box2)) {
                collide = true;
                await incrementPI();
                var v1 = box1.bounce(box2);
                var v2 = box2.bounce(box1);
                box1.velocity = v1;
                box2.velocity = v2;
                $(box1.id).css('border-right', '1px solid red');
            }
            if (box1.wallCollide()) {
                collide = true;
                await incrementPI();
                box1.reverse();
                $(box1.id).css('border-left', '1px solid red');
            }
            showStats();
            showBox(box1);
            showBox(box2);
            if (!collide) {
                await sleep();
                $(box1.id).css('border', '');
            }
            if (box1.velocity >= 0 && box2.pos > 1000 && box1.pos > 199) {
                over = true;
            }
        }
    }

    /****************************************************************************************
     * Helper functions
     ****************************************************************************************/

    function init() {
        box1.velocity = 0;
        box2.velocity = -2;
        box1.pos = 200;
        box2.pos = 400;
        showBox(box1);
        showBox(box2);
        showStats();
    }

    function setPrecision() {
        precisionValue = $('#precisionbar').val();
        $('#precisionvalue').val(precisionValue);
        s2 = lowerLimit + step * (precisionValue - 1);
        m2 = Math.pow(100, precisionValue - 1);
        box2.size = s2;
        box2.mass = m2;
    }

    async function incrementPI() {
        await sound.play();
        PICount += 1;
        $('#count').text(PICount);
    }

    function disableInputs() {
        $('#precisionbar').attr('disabled', 'disabled');
        $('#render').attr('disabled', 'disabled');
    }

    function enableInputs() {
        $('#precisionbar').removeAttr('disabled');
        $('#render').removeAttr('disabled');
    }

    function showStats() {
        $('#m1').text(box1.mass);
        $('#v1').text(box1.velocity);
        //$('#p1').text(box1.pos);
        $('#m2').text(box2.mass);
        $('#v2').text(box2.velocity);
        //$('#p2').text(box2.pos);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

});
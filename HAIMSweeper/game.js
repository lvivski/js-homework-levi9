
//Attach onload event like stackoverflow comments recommend
if(window.attachEvent) {
    window.attachEvent('onload', onLoadGame);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            onLoadGame();
        };
        window.onload = newonload;
    } else {
        window.onload = onLoadGame;
    }
}

function onLoadGame() {
    if (navigator.appVersion.indexOf('Mac') == -1) {
        alert("Sorry, your computer isn't mac enough to run this fancy game.");
        return;
    }

    //Initialize drawing canvas
    var canvas = document.getElementById('game');
    canvas.width = 300;
    canvas.height = 350;

    var context = canvas.getContext('2d');
    context.font = '16px Arial';
    context.fillStyle = '#00FF66';  //TODO: if we load the background from the Internet, we need to think about automatically choosing the right color for text


    //Get the canvas bounding element to calculate correct mouse position when clicking
    var rect = canvas.getBoundingClientRect();

    //Initalize and perform the first redraw of the game field
    var field = new GameField(0, 50, 10, 10, 30, context);
    field.init();
    field.draw();

    //Handle left and right clicks
    canvas.addEventListener('click', function (event) {
        console.log(event);

        if(field.state === GameState.Open) {
            //Transform mouse coordinates into field map coordinates and call onMouseLeft for the field
            var x = Math.floor((event.x - rect.left + 0) / field.cellSize);
            var y = Math.floor((event.y - rect.top - 50) / field.cellSize);
            field.onMouseLeft(x, y)

            //Redraw the field
            field.draw();
        }

        if(field.state === GameState.Lost) {
            alert('We are very sorry, but you have lost. Refresh the page to play again (yes, no Retry buttons for you).');
        }

        if(field.state === GameState.Won) {
            alert('Wow, you have won the game!');
        }

        return false;
    });

     canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault()
        console.log(event);
        
        if(field.state === GameState.Open) {
            //Transform mouse coordinates into field map coordinates and call onMouseRight for the field
            var x = Math.floor((event.x - rect.left + 0) / field.cellSize);
            var y = Math.floor((event.y - rect.top - 50) / field.cellSize);
            field.onMouseRight(x, y)

            //Redraw the field
            field.draw();
        }

        if(field.state === GameState.Won) {
            alert('Wow, you have won the game!');
        }
        
        return false;
    });
}


$(document).ready(function () {

    var limit = 10;
    var isLooping = false;
    var rightClickButton = "";
    var results = "";
    var favoritesArray = [];
    var topics = [];
    var currentTopic = "";
    var viewingFavorites = false;

    function getTopics() {
        console.log(localStorage.getItem("first-run"));

        //If "first-run" key IS NOT found in local storage, supply a list of default buttons (topics)
        if (localStorage.getItem("first-run") === null) {
            topics = ["Steph Curry", "Jesse Lingard", "Naomi Osaka", "Tiger Woods", "Michael Phelps", "Devin Booker"];
        } else {

            //If "first-run" key IS found in local storage, get the list of buttons (topics) and push them to an array
            for (i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).substring(0, 5) === "topic") {
                    var newTopic = localStorage.key(i);
                    topics.push(localStorage.getItem(newTopic));
                }
            }
        }
        getFavorites();
    }

    function getFavorites() {
        //Load the favorites list from local storage and push them to an array
        for (i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substring(0, 8) === "favorite") {
                var favString = localStorage.key(i);
                favoritesArray.push(localStorage.getItem(favString));
            }
        }
        setLocalStorage();
        populateAddArea();
    }

    function setLocalStorage() {
        
        //Re-populate local storage
        localStorage.clear();
        localStorage.setItem("first-run", false);
        for (i = 0; i < topics.length; i++) {
            localStorage.setItem("topic-" + i, topics[i]);
        }
        for (j = 0; j < favoritesArray.length; j++) {
            localStorage.setItem("favorite-" + j, favoritesArray[j]);
        }
    }

    function populateAddArea() {
        
        //Create input for adding new athlete (topic)
        var inputText = $("<input>");
        inputText.attr("type", "text");
        inputText.attr("id", "input-text");
        $("#addButtonArea").append(inputText);
        $("label[for='#input-text']").text("Add a New Athlete");

        //Create button for adding new athlete (topic)
        var addButton = $("<button>");
        addButton.attr("type", "button");
        addButton.attr("class", "btn btn-outline-light");
        addButton.attr("id", "add-athlete-button");
        addButton.text("Add Athlete");
        $("#addButtonArea").append(addButton);

        //Add listener for button to add new athlete (topic) to array, and repopulate the buttons and local storage
        $("#add-athlete-button").on("click", function () {
            if ($("#input-text").val().length > 0) {
                var newAthlete = $("#input-text").val();
                topics.push(newAthlete);
                populateButtons();
                $("#input-text").val("");
                setLocalStorage();
            }
        })

        var favButton = $("<button>");
        favButton.attr("type", "button");
        favButton.attr("class", "btn btn-outline-warning");
        favButton.attr("id", "favorites-button");
        favButton.text("Favorites");
        console.log(favoritesArray.length);
        if (favoritesArray.length === 0) {
            favButton.attr("disabled", true);
        } else {
            favButton.attr("disabled", false);
        }
        $("#favoritesArea").append(favButton);

        $("#favorites-button").on("click", function () {
            var queryURL = "https://api.giphy.com/v1/gifs?api_key=AVrHPINB2p0cWyUj0OMmSBq2EIcXOWl6&ids=" +
                favoritesArray.join(", ");
            console.log(queryURL);
            ajaxCall(queryURL);
            viewingFavorites = true;
        })

        populateButtons();
    }

    function populateButtons() {

        $("#buttonsArea").empty();
        for (i = 0; i < topics.length; i++) {
            var newButton = $("<button>");
            newButton.attr("type", "button");
            newButton.attr("class", "btn btn-outline-primary athlete-button");
            newButton.text(topics[i]);
            $("#buttonsArea").append(newButton);
        }

        $(".athlete-button").on("click", function () {
            var athlete = ($(this).text());
            currentTopic = athlete;
            athlete = athlete.split(" ").join("+");
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
                athlete + "+sports" + "&api_key=AVrHPINB2p0cWyUj0OMmSBq2EIcXOWl6&rating=pg&limit=" + limit;
            console.log(queryURL);
            ajaxCall(queryURL);
            viewingFavorites = false;
        });

    }

    function ajaxCall(ajaxURL) {
        $.ajax({
            url: ajaxURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                //results = response.data;
                var responseData = response.data;
                buildButtons(responseData);

            });

    }

    function buildButtons(results) {
        $("#gifsArea").html("");
        for (var i = 0; i < results.length; i++) {
            var gifDiv = $("<div>");
            gifDiv.attr("class", "gif");

            var athleteImage = $("<img>");
            var stillUrl = results[i].images.fixed_height_still.url;
            var loopUrl = results[i].images.fixed_height.url;
            athleteImage.attr("data-still-url", stillUrl);
            athleteImage.attr("data-loop-url", loopUrl);
            athleteImage.attr("src", stillUrl);
            athleteImage.attr("class", "athlete-image");

            athleteImage.on("click", function () {
                console.log("clicked");
                if (isLooping) {
                    $(this).attr("src", ($(this).attr("data-still-url")));
                    isLooping = false;
                } else {
                    $(this).attr("src", ($(this).attr("data-loop-url")));
                    isLooping = true;
                }
            })

            isLooping = false;

            var title = results[i].title;
            var div1 = $("<div>").text(title);
            div1.attr("class", "title");
            div1.attr("id", "title" + i);
            var imageWidth = results[i].images.fixed_height_still.width;
            div1.css("width", imageWidth - 10);
            div1.attr("data-toggle", "tooltip");
            div1.attr("data-placement", "bottom");
            div1.attr("title", title);
            console.log(imageWidth);

            var rating = results[i].rating;
            var div2 = $("<div>").text("Rating: " + rating);
            div2.attr("class", "rating");

            var heartImg = $("<img>");
            if (favoritesArray.indexOf(results[i].id) > -1) {
                heartImg.attr("src", "assets/images/heart-filled.png");
                heartImg.attr("data-heart", "filled");
                var favoriteImage = true;
            } else {
                heartImg.attr("src", "assets/images/heart-outline.png");
                heartImg.attr("data-heart", "empty");
                var favoriteImage = false;
            }
            heartImg.css("float", "right");
            heartImg.attr("id", "heart-image");

            heartImg.attr("data-id", results[i].id);
            div2.append(heartImg);

            heartImg.on("click", function () {
                if ($(this).attr("data-heart") === "empty") {
                    $(this).attr("src", "assets/images/heart-filled.png");
                    $(this).attr("data-heart", "filled");
                    console.log(results[i]);
                    favoritesArray.push($(this).attr("data-id"));
                    $("#favorites-button").attr("disabled", false);
                    console.log(favoritesArray);
                } else {

                    //Switch from solid to outline heart image
                    $(this).attr("src", "assets/images/heart-outline.png");
                    $(this).attr("data-heart", "empty");

                    //Set variable to hold div to remove if heart is unchecked
                    var thisButton = $(this).closest($(".gif"));

                    //Remove from array of favorites
                    var removeFavorite = favoritesArray.indexOf($(this).attr("data-id"));
                    favoritesArray.splice(removeFavorite, 1);

                    //If there are no favorites, disable the Favorites button
                    if (favoritesArray.length === 0) {
                        $("#favorites-button").attr("disabled", true);
                    }

                    //If we are in the Favorites category, remove the image from the DOM
                    if (viewingFavorites){
                        thisButton.remove();
                        console.log(thisButton);
                    }
                }

                //Update items in local storage
                setLocalStorage();
            });

            //Build the div to add
            gifDiv.append(athleteImage);
            gifDiv.append(div1);
            gifDiv.append(div2);

            //If this image is a favorite, add it to the beginning of the div...if not, add it to the end
            if (favoriteImage) {
                $("#gifsArea").prepend(gifDiv);
            } else {
                $("#gifsArea").append(gifDiv);
            }

        }
    }

    // Trigger action when the contexmenu is about to be shown
        $(document).on("contextmenu", function (event) {

        if ($(event.target).hasClass("athlete-button")) {
            // Avoid the real one
            event.preventDefault();

            // Show contextmenu
            $(".custom-menu").toggle(100).

                // In the right position (the mouse)
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });

            rightClickButton = ($(event.target).text());
            
            /* var mouseIn = {"athlete-button":true, "custom-menu":false}
            var triggerItem = "";
            $(".athlete-button, .custom-menu").mouseenter(function(){
                if ($(this).hasClass("athlete-button")){
                    triggerItem = "athlete-button";
                } else {
                    triggerItem = "custom-menu"
                }
                mouseIn[triggerItem] = true;
                //console.log($(this).attr("id"));
                console.log(mouseIn);
                //alert("Leaving!");
                //$(".custom-menu").hide(100);
            })
            .mouseleave(function(){
                //$(".athlete-button, .custom-menu").mouseleave(function(){
                    if ($(this).hasClass("athlete-button")){
                        triggerItem = "athlete-button";
                    } else {
                        triggerItem = "custom-menu"
                    }
                mouseIn[triggerItem] = false;
                //console.log($(this).attr("id"));
                console.log(mouseIn);
                if (mouseIn["athlete-button"] === false && mouseIn["custom-menu"] === false){

                    setTimeout(function(){
                    $(".custom-menu").hide(100);
                    },100);
                }
            }); */
        }
    });

    // If the document is clicked...
        $(document).on("click", function (event) {

        // ...and it wasn't the menu that was clicked...
        if (!$(event.target).parents(".custom-menu").length > 0) {

            // hide the maenu.
            $(".custom-menu").hide(100);
        }
    });


    //If the menu is clicked
    $(".custom-menu li").click(function () {

        var arrPosition = topics.indexOf(rightClickButton);
        
        //If there is more than one topic...
        if (topics.length > 1) {
        
        //delte the topic and redraw the buttons.
        topics.splice(arrPosition, 1);
        populateButtons();
        
        //If we're deleting the currently displayed topic, clear the gifs
        if (currentTopic === rightClickButton) {
        $("#gifsArea").empty();
        }
    } else {

        //Display message if user tries to delete the only button left
        alert("You must have at least 1 athlete button. To remove this button, please add another button first.");
    }

        //Hide the menu
        $(".custom-menu").hide(100);
        setLocalStorage();
    });

    getTopics();

});










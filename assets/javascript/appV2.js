$(document).ready(function () {

    var topics = ["Steph Curry", "Jesse Lingard", "Naomi Osaka", "Tiger Woods", "Michael Phelps", "Devin Booker"];
    var limit = 10;
    var isLooping = false;
    var rightClickButton = "";
    var results = "";
    var favoritesArray = [];

    function getFavorites() {
        for (i = 0; i < localStorage.length; i++) {
            //console.log("favorite-" + i);
            if (localStorage.key(i).substring(0,8) === "favorite") {
            //var favString = "favorite-" + i;
            var favString = localStorage.key(i);
            favoritesArray.push(localStorage.getItem(favString));
            }
        }
        console.log(favoritesArray);
        populateAddArea();
    }

    function populateAddArea() {
        var inputText = $("<input>");
        inputText.attr("type", "text");
        inputText.attr("id", "input-text");

        $("#addButtonArea").append(inputText);
        $("label[for='#input-text']").text("Add a New Athlete");

        var addButton = $("<button>");
        addButton.attr("type", "button");
        addButton.attr("class", "btn btn-outline-light");
        addButton.attr("id", "add-athlete-button");
        addButton.text("Add Athlete");
        $("#addButtonArea").append(addButton);

        $("#add-athlete-button").on("click", function () {
            if ($("#input-text") != "") {
                var newAthlete = $("#input-text").val();
                topics.push(newAthlete);
                populateButtons();
                $("#input-text").val("");
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

        $("#favorites-button").on("click", function(){
            alert("Favorites!");
            for (i=0; i<favoritesArray.length; i++){
                
            }
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
            var athlete = athlete.split(" ").join("+");
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
                athlete + "+sports" + "&api_key=AVrHPINB2p0cWyUj0OMmSBq2EIcXOWl6&rating=pg&limit=" + limit;
            console.log(queryURL);
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {
                    console.log(response);
                    //results = response.data;
                    var responseData = response.data;
                    buildButtons(responseData);

                    
                });
        });

    }


    function buildButtons (results){
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
                                $(this).attr("src", "assets/images/heart-outline.png");
                                $(this).attr("data-heart", "empty");
                                var removeFavorite = favoritesArray.indexOf($(this).attr("data-id"));
                                favoritesArray.splice(removeFavorite, 1);
                                if (favoritesArray.length === 0) {
                                    $("#favorites-button").attr("disabled", true);
                                }
                                console.log(favoritesArray);
                            }
                            localStorage.clear();
                            for (i = 0; i < favoritesArray.length; i++) {
                                localStorage.setItem("favorite-" + i, favoritesArray[i]);
                            }
                        });

                        gifDiv.append(athleteImage);
                        gifDiv.append(div1);
                        gifDiv.append(div2);

                        if (favoriteImage) {
                            $("#gifsArea").prepend(gifDiv);
                        } else {
                            $("#gifsArea").append(gifDiv);
                        }

                    }
                }


    // Trigger action when the contexmenu is about to be shown
    $(document).bind("contextmenu", function (event) {

        if ($(event.target).hasClass("athlete-button")) {
            // Avoid the real one
            event.preventDefault();

            // Show contextmenu
            $(".custom-menu").finish().toggle(100).

                // In the right position (the mouse)
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });

            rightClickButton = ($(event.target).text());
        }
    });


    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {

        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu").length > 0) {

            // Hide it
            $(".custom-menu").hide(100);
        }
    });


    // If the menu element is clicked
    $(".custom-menu li").click(function () {

        var arrPosition = topics.indexOf(rightClickButton);
        //console.log(arrPosition);
        //console.log(arrPosition + 1);
        topics.splice(arrPosition, 1);
        console.log(topics);
        populateButtons();

        $("#gifsArea").empty();

        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });



    getFavorites();


});










$(document).ready(function () {

    var topics = ["Steph Curry", "Jesse Lingard", "Naomi Osaka", "Tiger Woods", "Michael Phelps", "Devin Booker"];
    var limit = 10;
    var isLooping = false;


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

        for (i = 0; i < topics.length; i++) {
            var newButton = $("<button>");
            newButton.attr("type", "button");
            newButton.attr("class", "btn btn-outline-primary athlete-button");
            newButton.text(topics[i]);
            $("#buttonsArea").append(newButton);
        }

    $("#add-athlete-button").on("click", function () {
        if ($("#input-text") != "") {
            var newAthlete = $("#input-text").text();
            topics.push(newAthlete);
            populateButtons();
        }
    })

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
                var results = response.data;
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
                    div1.css("width", imageWidth);
                    div1.attr("data-toggle", "tooltip");
                    div1.attr("data-placement", "bottom");
                    div1.attr("title", title);
                    console.log(imageWidth);

                    var rating = results[i].rating;
                    var div2 = $("<div>").text("Rating: " + rating);

                    gifDiv.append(athleteImage);
                    gifDiv.append(div1);
                    gifDiv.append(div2);

                    $("#gifsArea").append(gifDiv);

                }
            });
    });


});










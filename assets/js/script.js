$(function () {
    var hamburgerMenu = $("#hamburger-menu");
    var closeBtn = $("#close-btn");

    hamburgerMenu.on("click", function () {
        $("#side-bar").attr("style", "width: 400px;");
    });

    closeBtn.on("click", function () {
        $("#side-bar").attr("style", "width: 0px;");
    });

    $("main").on("click", function () {
        $("#side-bar").attr("style", "width: 0px;");
    });

    $("#title").on("click", function () {
        location.href = "/";
    });

    const callBtn = document.querySelector("#call-button");
    const generateBtn = document.querySelector(".btn-to-spin");
    //selecting button

    var Url = "https://www.themealdb.com/api/json/v1/1/categories.php?";
    // url variable

    const categoriesElement = document.getElementById("categoryDescription");

    function filterCall() {
        const filterUrl =
            "https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast";
        fetch(filterUrl)
            //call api return response as json
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data.meals);
                console.log(data.meals.length);
                var i = Math.floor(Math.random() * data.meals.length);
                console.log(i);

                // display recipe 
                $(".recipe-title").text(data.meals[i].strMeal);
                $(".image").attr("src", data.meals[i].strMealThumb);
                
                // grab full details 
                const fullDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + data.meals[i].idMeal;
                fetch(fullDetailsUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        console.log(data.meals[0].strInstructions);
                        $(".instructions").text(data.meals[0].strInstructions);
                    });
                
            });


    }

    function callRecipeApi() {
        fetch(Url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                const categories = data.categories;
                categories.forEach(function (category) {
                    const strCategory = category.strCategory;
                    const labelElement = document.createElement("label");
                    const categoryElement = document.createElement("input");

                    categoryElement.type = "checkbox";
                    categoryElement.value = strCategory;

                    const categoryNameElement = document.createElement("span");
                    categoryNameElement.textContent = strCategory;

                    labelElement.appendChild(categoryElement);
                    labelElement.appendChild(categoryNameElement);
                    categoriesElement.appendChild(labelElement);

                    document.querySelector(".big-btn").style.display = "none";
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function generateMeal() {
        fetch(Url)
            .then(function (response) {
                return response.json();
            });
        document.querySelector("#categoryDescription").style.display = "none";
    }

    callBtn.addEventListener("click", callRecipeApi);
    callBtn.addEventListener("click", filterCall);
    generateBtn.addEventListener("click", generateMeal);

    //event listener on btn to call recipeapi

    var angle = 0;
    $(".btn-to-spin").click(function () {
        angle += Math.floor(Math.random() * (1080 - 360 + 1) + 360);
        $(".food-wheel").css("-webkit-transform", "rotate(" + angle + "deg)");

        setTimeout(() => {
            $("#intro").attr("style", "display: none");
            $(".container").attr("style", "display: flex");
        }, 6000);
    });
});

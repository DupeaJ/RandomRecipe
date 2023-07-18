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
    
    var Url = "https://www.themealdb.com/api/json/v1/1/categories.php?";
    // url variable

    const categoriesElement = document.getElementById("categoryDescription");

    function filterCall() {
        const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    const checkedValues = Array.from(checkboxes).map(
        (checkbox) => checkbox.value
    );

        const filterUrl =
            "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + checkedValues.join(",");
        
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

    

    function generateMeal() {
        fetch(Url)
            .then(function (response) {
                return response.json();
            });
            document.querySelector("#categoryDescription").style.display = "none";
        
                
    }

    callBtn.addEventListener("click", callRecipeApi);
    generateBtn.addEventListener("click", filterCall);
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

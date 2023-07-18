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

    var Url = "https://www.themealdb.com/api/json/v1/1/categories.php?";
    const callBtn = document.querySelector("#call-button");
    const generateBtn = document.querySelector(".btn-to-spin");
    const categoriesElement = document.getElementById("categoryDescription");
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
    
    function filterCall() {
        //first calls checkstorage to see if any items are present
        checkStorage();
        const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    const checkedValues = Array.from(checkboxes).map(
        (checkbox) => checkbox.value
    );

        const filterUrl =
            "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + checkedValues.join("&c=");
        
        fetch(filterUrl)
            //call api return response as json
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                //console.log(data.meals);
                //console.log(data.meals.length);
                var i = Math.floor(Math.random() * data.meals.length);
                //console.log(i);

                // display recipe 
                $(".recipe-title").text(data.meals[i].strMeal);
                $(".image").attr("src", data.meals[i].strMealThumb);
                
                //sets mead id in local storage
                const mealId = data.meals[i].idMeal;
                console.log("meal ID" + mealId);
                const mealIdCounter = "Meal ID-" + counter;
                localStorage.setItem(mealIdCounter, JSON.stringify(mealId));
                
                // grab full details 
                const fullDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId;
                fetch(fullDetailsUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        //console.log(data.meals[0].strInstructions);
                        $(".instructions").text(data.meals[0].strInstructions);
                    });
                
                // randomly choose cocktail 
                const cocktailUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
                fetch(cocktailUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        //console.log(data);
                        // generate random cocktail 
                        var i = Math.floor(Math.random() * data.drinks.length);
                        console.log("random drink number: " + i);
                        console.log("drink name: " + data.drinks[i].strDrink);
                        console.log("drinkID: " + data.drinks[i].idDrink);

                        //sets drink id in storage 
                        const drinkIdCounter = "Drink ID-" + counter;
                        localStorage.setItem(
                            drinkIdCounter,
                            JSON.stringify(data.drinks[i].idDrink)
                        );
                        // display cocktail recipe 
                        // display title 
                        $(".cocktail-title").text(data.drinks[i].strDrink);
                        // display image 
                        $(".cocktail-image").attr("src", data.drinks[i].strDrinkThumb);
                        
                    })
                
            });
    }  
    function hideMenu() {
            document.querySelector("#categoryDescription").style.display = "none";
    }
    //counter for meal and drink ids to store with new keys
    var counter = 0; 
    //local storage to get past recipes
    function checkStorage() {
        let storedData;
        while (true) {
            storedData = localStorage.getItem("Meal ID-" + counter);
            if (!storedData) {
                break;
            }
            storedData = JSON.parse(storedData);
            console.log("Retrieved data from local storage:", storedData);
            counter++;
            console.log("Counter:", counter);
        }
    }

    callBtn.addEventListener("click", callRecipeApi);
    generateBtn.addEventListener("click", filterCall);
    generateBtn.addEventListener("click", hideMenu);

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

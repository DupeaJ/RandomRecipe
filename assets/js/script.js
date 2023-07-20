$(function () {
    $(document).foundation();

    $("#home-button").text("RaRe.com");

    $("#menu-button").on("click", function () {
        $("#side-nav").attr("style", "width: 250px");
    });

    $("#close-button").on("click", function () {
        $("#side-nav").attr("style", "width: 0");
    });

    fetchMealsAPI();

    for (let i = 1; i <= JSON.parse(localStorage.getItem("itemNum")); i++) {
        const mealUrl = localStorage.getItem("item-" + i).split(",")[0];
        const drinkUrl = localStorage.getItem("item-" + i).split(",")[1];
        createSideNav(i, mealUrl, drinkUrl);
    }

    var iconArr = [
        "🍉",
        "🍋",
        "🥑",
        "🌶",
        "🥩",
        "🥓",
        "🍔",
        "🍕",
        "🌮",
        "🍟",
        "🍤",
        "🥠",
        "🦀",
        "🦞",
        "🍩",
        "🥧",
        "🍸",
        "🍹",
        "🍷",
        "🍺",
        "🥃",
    ];
    var iconIndex = 0;
    setInterval(function () {
        iconIndex++;
        $("#footer-icon").fadeOut(0, function () {
            $(this).attr("style", "display: inline");
            $(this)
                .text(iconArr[iconIndex % iconArr.length])
                .fadeIn(0);
        });
    }, 250);
});

function fetchMealsAPI() {
    var getCategoriesUrl =
        "https://www.themealdb.com/api/json/v1/1/list.php?c=list";

    var categoryArr = [];

    fetch(getCategoriesUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.meals.length; i++) {
                const category = data.meals[i];
                categoryArr.push(category.strCategory);
                createCategoryCheckbox(category.strCategory);
            }
            $("#generate-button").on("click", generateCategory);
        });
}

function fetchCocktailsAPI() {
    const getCocktailsUrl =
        "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";

    fetch(getCocktailsUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            var randomDrinkIndex = Math.floor(
                Math.random() * (data.drinks.length - 0) + 0
            );
            var randomDrink = data.drinks[randomDrinkIndex];

            getRandomDrink(randomDrink);
        });
}

function createCategoryCheckbox(category) {
    var checkboxDropdown = $("#checkbox-dropdown");

    var checkboxEl = $("<div></div>");
    var checkboxInput = $('<input type="checkbox">');
    var checkboxLabel = $("<label></label>");

    checkboxDropdown.append(checkboxEl);
    checkboxEl.attr("id", category + "-checkbox");
    checkboxEl.append(checkboxInput.attr("id", category));
    checkboxInput.attr("class", "checkbox");
    checkboxInput.attr("value", category);
    checkboxEl.append(checkboxLabel.text(category));
    checkboxLabel.attr("for", category);
}

function generateCategory() {
    var categoryArr = [];
    var checkedArr = $(".checkbox:checkbox:checked");

    if (checkedArr.length < 1) {
        $("#generate-button").text("Select Categories");
        $("#generate-button").addClass("alert");
    } else {
        $("#menu-button").attr("style", "display: none");
        $("#generate-section").attr("style", "display: none");
        $("footer").attr("style", "display: none");

        for (let i = 0; i < checkedArr.length; i++) {
            const checkedEl = checkedArr[i];
            categoryArr.push(checkedEl.value);
        }

        var category = "";
        var categoryIndex = 0;
        randomLoop = Math.floor(Math.random() * (250 - 100) + 100);
        var categoryLoop = setInterval(function () {
            categoryIndex++;
            $("#category-span").fadeOut(0, function () {
                $(this).attr("style", "display: flex");
                $(this)
                    .text(categoryArr[categoryIndex % categoryArr.length])
                    .fadeIn(0);
            });
            category = $("#category-span").text();
        }, randomLoop);

        randomTimeout = Math.floor(Math.random() * (5000 - 2000) + 2000);
        setTimeout(() => {
            clearInterval(categoryLoop);
            getMeals(category);
            fetchCocktailsAPI();
            $("#dropdown-button").attr("style", "display: none");
            $("#home-button").text("< Save Recipes");
            $("#home-button").on("click", function () {
                localStorage.setItem(
                    "itemNum",
                    JSON.parse(localStorage.getItem("itemNum")) + 1
                );
                setLocalStorage(localStorage.getItem("itemNum"));
                window.location.href = "/RandomRecipe";
                // window.location.href = "/";
            });
        }, randomTimeout);
    }
}

function getMeals(category) {
    var filterCategoryUrl =
        "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category;

    fetch(filterCategoryUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            var randomMealIndex = Math.floor(
                Math.random() * (data.meals.length - 0) + 0
            );
            var randomMeal = data.meals[randomMealIndex];

            getRandomMeal(randomMeal);

            setTimeout(() => {
                $("#category-span").attr("style", "display: none");
                $("#card-group").attr("style", "display: flex");
                $("footer").attr("style", "display: flex");
            }, 3000);
        });
}

function getRandomMeal(meal) {
    var mealIdUrl =
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + meal.idMeal;

    $("#meal-title").attr("data-mealurl", mealIdUrl);

    fetch(mealIdUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            fetchMeal(data);
        });
}

function getRandomDrink(drink) {
    var drinkIdUrl =
        "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" +
        drink.idDrink;

    $("#drink-title").attr("data-drinkurl", drinkIdUrl);

    fetch(drinkIdUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            fetchDrink(data);
        });
}

function setLocalStorage(itemNum) {
    localStorage.setItem("item-" + itemNum, [
        $("#meal-title").attr("data-mealurl"),
        $("#drink-title").attr("data-drinkurl"),
    ]);
}

function createSideNav(i, mealUrl, drinkUrl) {
    var prevRecipesUl = $("#prev-recipes");
    var recipesButton = $("<button></button>");

    prevRecipesUl.append(recipesButton.attr("id", "saved-recipes"));
    recipesButton.addClass("button primary");

    fetch(mealUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            var mealName = data.meals[0].strMeal;
            fetch(drinkUrl)
                .then(function (response) {
                    if (response.status !== 200) {
                        console.log("API Not Found.");
                    }
                    return response.json();
                })
                .then(function (data) {
                    var drinkName = data.drinks[0].strDrink;
                    recipesButton.text(mealName + " & " + drinkName);
                });
        });

    recipesButton.on("click", function () {
        generatePrevRecipe(mealUrl, drinkUrl);
        $("#side-nav").attr("style", "width: 0");
    });
}

function generatePrevRecipe(mealUrl, drinkUrl) {
    $("#menu-button").attr("style", "display: none");
    $("#generate-section").attr("style", "display: none");
    $("#dropdown-button").attr("style", "display: none");
    $("#card-group").attr("style", "display: flex");
    $("#home-button").text("< Back");
    $("#home-button").on("click", function () {
        window.location.href = "/RandomRecipe";
        // window.location.href = "/";
    });

    fetch(mealUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            fetchMeal(data);
        });

    fetch(drinkUrl)
        .then(function (response) {
            if (response.status !== 200) {
                console.log("API Not Found.");
            }
            return response.json();
        })
        .then(function (data) {
            fetchDrink(data);
        });
}

function fetchMeal(data) {
    var meal = data.meals[0];

    $("#meal-img").attr("src", meal.strMealThumb);
    $("#meal-title").text(meal.strMeal);
    $("#meal-instructions-content").append(
        $("<p></p>").text(meal.strInstructions)
    );

    for (let i = 1; i < 21; i++) {
        const mealIngredient = "strIngredient" + i;
        const mealMeasure = "strMeasure" + i;
        if (meal[mealIngredient] !== null || meal[mealMeasure] !== "") {
            var ingredientsCombo =
                meal[mealIngredient] + " - " + meal[mealMeasure];
            if (meal[mealIngredient] !== "" && meal[mealMeasure] === "") {
                ingredientsCombo = meal[mealIngredient];
            } else if (meal[mealIngredient] === "") {
                return;
            }
            $("#meal-ingredients-content").append(
                $("<ul></ul>").append(
                    $("<li></li>").append("<p></p>").text(ingredientsCombo)
                )
            );
        }
    }
}

function fetchDrink(data) {
    var drink = data.drinks[0];

    $("#drink-img").attr("src", drink.strDrinkThumb);
    $("#drink-title").text(drink.strDrink);
    $("#drink-instructions-content").append(
        $("<p></p>").text(drink.strInstructions)
    );
    for (let i = 1; i < 16; i++) {
        const drinkIngredient = "strIngredient" + i;
        const drinkMeasure = "strMeasure" + i;
        if ((drink[drinkIngredient] !== null || drink[drinkMeasure]) !== null) {
            var ingredientsCombo =
                drink[drinkIngredient] + " - " + drink[drinkMeasure];
            if (
                (drink[drinkIngredient] !== null &&
                    drink[drinkMeasure] === null) ||
                (drink[drinkIngredient] !== null && drink[drinkMeasure] === "")
            ) {
                ingredientsCombo = drink[drinkIngredient];
            } else if (
                drink[drinkIngredient] === null &&
                drink[drinkMeasure] === ""
            ) {
                return;
            }
            $("#drink-ingredients-content").append(
                $("<ul></ul>").append(
                    $("<li></li>").append("<p></p>").text(ingredientsCombo)
                )
            );
        }
    }
}

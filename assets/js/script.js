$(function () {
    $(document).foundation();

    $("#home-button").text("RandomRecipe.com");

    $("#menu-button").on("click", function () {
        $("#side-nav").attr("style", "width: 250px");
    });

    $("#close-button").on("click", function () {
        $("#side-nav").attr("style", "width: 0");
    });

    // $("main").on("click", function () {
    //     $("#side-nav").attr("style", "width: 0;");
    //     $("h2").attr("style", "display: block");
    //     $("#dropdown-button").attr("style", "display: block");
    //     $("#generate-button").attr("style", "display: block");
    // });

    fetchMealsAPI();

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
            $("#home-button").text("< Back");
            $("#home-button").on("click", function () {
                localStorage.setItem(
                    "itemNum",
                    JSON.parse(localStorage.getItem("itemNum")) + 1
                );
                setLocalStorage(localStorage.getItem("itemNum"));
                createSideNav();
                window.location.href = "/RandomRecipe";
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
                // $("#dropdown-button").attr("style", "display: none");
                $("#category-span").attr("style", "display: none");
                $("#card-group").attr("style", "display: flex");
                $("footer").attr("style", "display: flex");
            }, 3000);
        });
}

function getRandomMeal(meal) {
    $("#meal-img").attr("src", meal.strMealThumb);
    $("#meal-title").text(meal.strMeal);

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
            var meal = data.meals[0];
            $("#meal-instructions-content").append(
                $("<p></p>").text(meal.strInstructions)
            );
            for (let i = 1; i < 21; i++) {
                const mealIngredient = "strIngredient" + i;
                const mealMeasure = "strMeasure" + i;
                if ((meal[mealIngredient] || meal[mealMeasure]) !== "") {
                    var ingredientsCombo =
                        meal[mealIngredient] + " - " + meal[mealMeasure];
                    if (meal[mealMeasure] === "" || meal[mealMeasure] === " ") {
                        return;
                    }
                    $("#meal-ingredients-content").append(
                        $("<ul></ul>").append(
                            $("<li></li>")
                                .append("<p></p>")
                                .text(ingredientsCombo)
                        )
                    );
                }
            }
        });
}

function getRandomDrink(drink) {
    $("#drink-img").attr("src", drink.strDrinkThumb);
    $("#drink-title").text(drink.strDrink);

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
            var drink = data.drinks[0];
            $("#drink-instructions-content").append(
                $("<p></p>").text(drink.strInstructions)
            );
            for (let i = 1; i < 16; i++) {
                const drinkIngredient = "strIngredient" + i;
                const drinkMeasure = "strMeasure" + i;
                if ((drink[drinkIngredient] || drink[drinkMeasure]) !== null) {
                    var ingredientsCombo =
                        drink[drinkIngredient] + " - " + drink[drinkMeasure];
                    if (
                        drink[drinkMeasure] === null ||
                        drink[drinkMeasure] === ""
                    ) {
                        ingredientsCombo = drink[drinkIngredient];
                    }
                    $("#drink-ingredients-content").append(
                        $("<ul></ul>").append(
                            $("<li></li>")
                                .append("<p></p>")
                                .text(ingredientsCombo)
                        )
                    );
                }
            }
        });
}

function setLocalStorage(itemNum) {
    localStorage.setItem("item-" + itemNum, [
        $("#meal-title").attr("data-mealurl"),
        $("#drink-title").attr("data-drinkurl"),
    ]);
}

function createSideNav() {
    // build out side nav with local storage
    // split localstorage.getItem("item-"+i)
    // add button to <ul>
    // create another function if pressed do functions above to load page
}

// $(function () {
//     var hamburgerMenu = $("#hamburger-menu");
//     var closeBtn = $("#close-btn");

//     hamburgerMenu.on("click", function () {
//         $("#side-bar").attr("style", "width: 400px;");
//     });

//     closeBtn.on("click", function () {
//         $("#side-bar").attr("style", "width: 0px;");
//     });

//     $("main").on("click", function () {
//         $("#side-bar").attr("style", "width: 0px;");
//     });

//     $("#title").on("click", function () {
//         location.href = "/";
//     });

//     var Url = "https://www.themealdb.com/api/json/v1/1/categories.php?";
//     const callBtn = document.querySelector("#call-button");
//     const generateBtn = document.querySelector(".btn-to-spin");
//     const categoriesElement = document.getElementById("categoryDescription");
//     //selecting button

//     function callRecipeApi() {
//         fetch(Url)
//             .then(function (response) {
//                 return response.json();
//             })
//             .then(function (data) {
//                 const categories = data.categories;
//                 categories.forEach(function (category) {
//                     const strCategory = category.strCategory;
//                     const labelElement = document.createElement("label");
//                     const categoryElement = document.createElement("input");

//                     categoryElement.type = "checkbox";
//                     categoryElement.value = strCategory;

//                     const categoryNameElement = document.createElement("span");
//                     categoryNameElement.textContent = strCategory;

//                     labelElement.appendChild(categoryElement);
//                     labelElement.appendChild(categoryNameElement);
//                     categoriesElement.appendChild(labelElement);

//                     document.querySelector(".big-btn").style.display = "none";

//                 });
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
// }

//     function filterCall() {
//         //first calls checkstorage to see if any items are present
//         checkStorage();
//         const checkboxes = document.querySelectorAll(
//         'input[type="checkbox"]:checked'
//     );
//     const checkedValues = Array.from(checkboxes).map(
//         (checkbox) => checkbox.value
//     );

//         const filterUrl =
//             "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + checkedValues.join("&c=");

//         fetch(filterUrl)
//             //call api return response as json
//             .then(function (response) {
//                 return response.json();
//             })
//             .then(function (data) {
//                 //console.log(data.meals);
//                 //console.log(data.meals.length);
//                 var i = Math.floor(Math.random() * data.meals.length);
//                 //console.log(i);

//                 // display recipe
//                 $(".recipe-title").text(data.meals[i].strMeal);
//                 $(".image").attr("src", data.meals[i].strMealThumb);

//                 //sets mead id in local storage
//                 const mealId = data.meals[i].idMeal;
//                 console.log("meal ID" + mealId);
//                 const mealIdCounter = "Meal ID-" + counter;
//                 localStorage.setItem(mealIdCounter, JSON.stringify(mealId));

//                 // grab full details
//                 const fullDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId;
//                 fetch(fullDetailsUrl)
//                     .then(function (response) {
//                         return response.json();
//                     })
//                     .then(function (data) {
//                         //console.log(data.meals[0].strInstructions);
//                         $(".instructions").text(data.meals[0].strInstructions);
//                         $(".area").text(data.meals[0].strArea);
//                     });

//                 // randomly choose cocktail
//                 const cocktailUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
//                 fetch(cocktailUrl)
//                     .then(function (response) {
//                         return response.json();
//                     })
//                     .then(function (data) {
//                         //console.log(data);
//                         // generate random cocktail
//                         var i = Math.floor(Math.random() * data.drinks.length);
//                         //console.log("random drink number: " + i);
//                         //console.log("drink name: " + data.drinks[i].strDrink);
//                         console.log("drinkID: " + data.drinks[i].idDrink);

//                         //sets drink id in storage
//                         const drinkIdCounter = "Drink ID-" + counter;
//                         localStorage.setItem(
//                             drinkIdCounter,
//                             JSON.stringify(data.drinks[i].idDrink)
//                         );
//                         // display cocktail recipe
//                         // display title
//                         $(".cocktail-title").text(data.drinks[i].strDrink);
//                         // display image
//                         $(".cocktail-image").attr("src", data.drinks[i].strDrinkThumb);
//                         // grab instructions
//                         const cocktailDetailsUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + data.drinks[i].idDrink;
//                         fetch(cocktailDetailsUrl)
//                             .then(function (response) {
//                                 return response.json();
//                             })
//                             .then(function (data) {
//                                 console.log(data);
//                                 console.log(data.drinks[0].strInstructions);
//                                 $(".cocktail-instructions").text(data.drinks[0].strInstructions);
//                             })
//                     })

//             });
//     }
//     function hideMenu() {
//             document.querySelector("#categoryDescription").style.display = "none";
//     }
//     //counter for meal and drink ids to store with new keys
//     var counter = 0;
//     //local storage to get past recipes
//     function checkStorage() {
//         let storedData;
//         while (true) {
//             storedData = localStorage.getItem("Meal ID-" + counter);
//             if (!storedData) {
//                 break;
//             }
//             storedData = JSON.parse(storedData);
//             //console.log("Retrieved data from local storage:", storedData);
//             counter++;
//             //console.log("Counter:", counter);
//         }
//     }

//     callBtn.addEventListener("click", callRecipeApi);
//     generateBtn.addEventListener("click", filterCall);
//     generateBtn.addEventListener("click", hideMenu);

//     var angle = 0;
//     $(".btn-to-spin").click(function () {
//         angle += Math.floor(Math.random() * (1080 - 360 + 1) + 360);
//         $(".food-wheel").css("-webkit-transform", "rotate(" + angle + "deg)");

//         setTimeout(() => {
//             $("#intro").attr("style", "display: none");
//             $(".container").attr("style", "display: flex");
//         }, 6000);
//     });
// });

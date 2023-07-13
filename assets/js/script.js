$(function () {
    var hamburgerMenu = $("#hamburger-menu");
    var closeBtn = $("#close-btn");

    hamburgerMenu.on("click", function () {
        $("#side-bar").attr("style", "width: 400px;");
    });

    closeBtn.on("click", function () {
        $("#side-bar").attr("style", "width: 0px;");
    });

    const callBtn = document.querySelector("#call-button");
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
                
            });
        })
        .catch((error) => {
            console.log(error);
        });
    document.querySelector(".big-btn").style.display = "none";
}
        
    callBtn.addEventListener("click", callRecipeApi);
    callBtn.addEventListener("click", filterCall);
    
    //event listener on btn to call recipeapi
});

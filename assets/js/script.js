const CallBtn = document.querySelector("#call-button");
//selecting button

var Url = "https://www.themealdb.com/api/json/v1/1/categories.php?";
// url variable

const categoriesElement = document.getElementById("categoryDescription");

function callRecipeApi() {
    fetch(Url)
        //call api return response as json
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const categories = data.categories;
            //selecting categories tag
            categories.forEach(function (category) {
                //for each category the following will happen for each
                const strCategory = category.strCategory;
                const categoryElement = document.createElement("p");
                //create element
                categoryElement.textContent = strCategory;
                //set text
                categoriesElement.appendChild(categoryElement);
                //append to page
            });
        })
        .catch((error) => {
            console.log(error);
            //if error console log what the error is
        });
}

CallBtn.addEventListener("click", callRecipeApi);
//event listener on btn to call recipeapi

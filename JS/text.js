$(document).ready(function () {
  let sidebarWidth = $(".side-menu").outerWidth();

  //***********************! image Info variables ***********************
  const homeContainer = $(".homeContainer");
  const imageInfo = $(".imageInfo");
  let targetImage = document.getElementById("targetImage");
  let targetMealName = document.getElementById("targetMealName");
  let mealDesc = document.getElementById("mealDesc");
  let category = document.getElementById("category");
  let area = document.getElementById("area");
  let recipes = document.getElementById("recipes");
  let tags = document.getElementById("tags");
  let source = document.getElementById("source");
  let youtupe = document.getElementById("youtupe");

  let imageContainer;

  //***********************! SideBar Animation ***********************
  $(".side-bar").css({ left: `-${sidebarWidth}px` });

  $(".side-bar .toggleIcon").click(function () {
    if ($(".side-bar").css("left") === "0px") {
      $(".side-bar").animate({ left: `-${sidebarWidth}px` }, 1000);
      $(".toggleIcon").removeClass("fa-xmark");
      $(".toggleIcon").addClass("fa-bars");
    } else {
      $(".side-bar").animate({ left: "0px" }, 1000);
      $(".toggleIcon").addClass("fa-xmark");
      $(".toggleIcon").removeClass("fa-bars");
    }
  });

  //***********************! Fetch API data ***********************
  async function fetchData(mealName) {
    let apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );
    let finalResponse = await apiResponse.json();
    return finalResponse;
  }

  //***********************! Display API data ***********************
  async function displayMeals() {
    let allMeals = await fetchData("s");
    console.log(allMeals);
    console.log(allMeals.meals.length);

    for (let i = 0; i < allMeals.meals.length; i++) {
      let mealSrc = allMeals.meals[i].strMealThumb;
      let nameOfMeal = allMeals.meals[i].strMeal;

      let colDiv = document.createElement("div");
      colDiv.classList.add("col-md-3");

      let imageContainerDiv = document.createElement("div");

      imageContainerDiv.classList.add(
        "rounded-3",
        "imageContainer",
        "overflow-hidden",
        "position-relative"
      );

      let mealImageDiv = document.createElement("div");
      mealImageDiv.classList.add("mealImage");

      let image = document.createElement("img");
      image.setAttribute("src", `${mealSrc}`);
      image.classList.add("w-100");

      mealImageDiv.appendChild(image);

      let imageLayerDiv = document.createElement("div");
      imageLayerDiv.classList.add("imageLayer");

      let mealNameHeader = document.createElement("h5");
      mealNameHeader.classList.add("mealName", "fw-bolder", "mb-0");
      mealNameHeader.textContent = `${nameOfMeal}`;

      imageLayerDiv.append(mealNameHeader);

      imageContainerDiv.append(mealImageDiv);
      imageContainerDiv.append(imageLayerDiv);

      colDiv.append(imageContainerDiv);

      document.querySelector(".allImages").append(colDiv);
    }

    mealImage = $(".mealImage");
    imageContainer = $(".imageContainer");
    imageContainer.click(showMeal);
  }

  displayMeals();

  async function showMeal(e) {
    //***********************! Get Info Of Meal ***********************
    let imageName = $(e.target).text();
    let mealDetails = await fetchData(imageName);
    homeContainer.css({ display: "none" });
    console.log(mealDetails);
    console.log(mealDetails.meals[0].strMeal);
    console.log(mealDetails.meals[0].strArea);

    targetImage.setAttribute("src", mealDetails.meals[0].strMealThumb);
    targetMealName.textContent = mealDetails.meals[0].strMeal;
    mealDesc.textContent = mealDetails.meals[0].strInstructions;
    category.textContent = mealDetails.meals[0].strCategory;
    area.textContent = mealDetails.meals[0].strArea;
    source.setAttribute("href", mealDetails.meals[0].strSource);
    // ! Error
    youtupe.setAttribute("href", mealDetails.meals[0].strYoutube);

    //***********************! Get Tages ***********************
    if (mealDetails.meals[0].strTags !== null) {
      let tagsArray = mealDetails.meals[0].strTags.split(",");
      console.log(tagsArray);
      console.log(tagsArray.length);

      for (let x = 0; x < tagsArray.length; x++) {
        let oneTag = document.createElement("p");
        oneTag.classList.add(
          "bg-secondary",
          "p-2",
          "me-2",
          "mb-2",
          "rounded-2"
        );
        oneTag.textContent = `${tagsArray[x]}`;
        tags.append(oneTag);
      }
    } else {
      let noTags = document.createElement("p");
      noTags.classList.add("fw-bolder", "text-danger", "fs-5");
      noTags.textContent = "There are no tags";
      tags.append(noTags);
    }

    //***********************! Get Recipes ***********************
    let obj = new Map(Object.entries(mealDetails.meals[0]));

    for (let i = 1; i <= obj.size; i++) {
      let numberOfRecipes = obj.get(`strMeasure${i}`);
      if (
        numberOfRecipes !== null &&
        numberOfRecipes !== "" &&
        numberOfRecipes !== " " &&
        numberOfRecipes !== undefined
      ) {
        let oneRecipe = document.createElement("p");
        oneRecipe.classList.add(
          "bg-light",
          "text-dark",
          "p-2",
          "me-2",
          "rounded-2"
        );
        oneRecipe.textContent = `${obj.get(`strMeasure${i}`)} ${obj.get(
          `strIngredient${i}`
        )}`;
        recipes.append(oneRecipe);
        console.log(obj.get(`strMeasure${i}`), obj.get(`strIngredient${i}`));
      }
    }
    imageInfo.fadeIn(1000);
  }

  //***********************! Search ***********************
  const searchByLetter = $("#searchByLetter");
  const searchByName = $("#searchByName");

  // let letterRegx = /[a-z]?/i
  // searchByLetter.keyup(function(e){
  //   let keyPressed = e.target.value;
  //   if(keyPressed.match(letterRegx)){
  //     console.log(keyPressed);
  //   }
  //   else{
  //     console.log("no");
  //   }
  // })
  searchByName.keyup(async function (e) {
    let searchWord = e.target.value;
    let searchResults = await fetchData(searchWord);
  });
});

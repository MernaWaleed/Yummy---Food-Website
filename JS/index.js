$(document).ready(function () {
  //***********************! Loading ***********************

  const bodyElement = document.body;

  function loading(container = bodyElement) {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading", "bg-dark");
    const loadingIcon = document.createElement("div");
    loadingIcon.classList.add("loader");
    loadingIcon.classList.add("loading-icon");
    loadingDiv.append(loadingIcon);

    container.prepend(loadingDiv);

    $(".loading .loading-icon").fadeOut(700, function () {
      $(".loading").fadeOut(700, function () {
        $("body").css("overflow", "auto");
        $(".loading").remove();
      });
    });
  }

  loading();

  //***********************! variables ***********************
  let sidebarWidth = $(".side-menu").outerWidth();
  const homeContainer = $(".homeContainer");
  const imageInfo = $(".imageInfo");
  const targetImage = document.getElementById("targetImage");
  const targetMealName = document.getElementById("targetMealName");
  const mealDesc = document.getElementById("mealDesc");
  const category = document.getElementById("category");
  const area = document.getElementById("area");
  const recipes = document.getElementById("recipes");
  const tags = document.getElementById("tags");
  const source = document.getElementById("source");
  const youtupe = document.getElementById("youtupe");
  const contactBtn = $(".contactSection");
  const contactSection = $(".contact");

  const name = $("#name");
  const email = $("#email");
  const phone = $("#phone");
  const age = $("#age");
  const password = $("#password");
  const repassword = $("#repassword");
  const submit = $("#submit");

  const searchMeal = $(".searchMeal");

  const searchByLetter = $("#searchByLetter");
  const searchByName = $("#searchByName");
  const searchBtn = $(".searchSection");
  const letterRegx = /^[a-z]$/i;
  const categoryBtn = $(".categorySection");
  const listingContainer = $(".listingContainer");
  const listingRow = $(".listingRow");
  const areaBtn = $(".areaSection");
  const ingredientsBut = $(".ingredientsSection");
  const regularExpressions = {
    name: /^[a-zA-Z]{3,}(\s[a-zA-Z]{2,})*$/,
    email: /^\w+@\w+\.\w{2,5}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    phone: /^(\+2)?01[0125]\d{8}$/,
    age: /^(([5-9])||([1-9][0-9]))$/,
  };

  let imageContainer;

  homeContainer.css({ display: "block" });
  contactSection.css({ display: "none" });

  //***********************! SideBar Animation ***********************
  $(".side-bar").css({ left: `-${sidebarWidth}px` });
  $(".side-bar .toggleIcon").click(sideBarAnimation);

  function sideBarAnimation() {
    if ($(".side-bar").css("left") === "0px") {
      $(".side-bar").animate({ left: `-${sidebarWidth}px` }, 1000);
      $(".toggleIcon").removeClass("fa-xmark");
      $(".toggleIcon").addClass("fa-bars");
      $(".side-bar li").animate(
        { marginBlock: "400px", opacity: 0 },
        500,
        "linear"
      );
    } else {
      $(".side-bar").animate({ left: "0px" }, 1000);
      $(".toggleIcon").addClass("fa-xmark");
      $(".toggleIcon").removeClass("fa-bars");
      $(".side-bar li").animate(
        { marginBlock: "10px", opacity: 1 },
        700,
        "linear"
      );
    }
  }

  //***********************! Fetch API data ***********************
  async function fetchData(page, letter = "", target = "") {
    let apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${page}.php?${letter}${target}`
    );
    let finalResponse = await apiResponse.json();
    return finalResponse;
  }

  //***********************! Display API data ***********************
  async function displayMeals(x, y, z) {
    contactSection.css({ display: "none" });
    let allMeals = await fetchData(x, y, z);
    // console.log(allMeals);
    if (allMeals.meals !== null) {
      for (let i = 0; i < allMeals.meals.length; i++) {
        let mealSrc = allMeals.meals[i].strMealThumb;
        let nameOfMeal = allMeals.meals[i].strMeal;

        let colDiv = document.createElement("div");
        colDiv.classList.add("col-lg-3", "col-md-6");

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
        mealNameHeader.classList.add(
          "mealName",
          "fw-bolder",
          "mb-0",
          "text-dark"
        );
        mealNameHeader.textContent = `${nameOfMeal}`;

        imageLayerDiv.append(mealNameHeader);

        imageContainerDiv.append(mealImageDiv);
        imageContainerDiv.append(imageLayerDiv);

        colDiv.append(imageContainerDiv);
        $(".allImages").append(colDiv);
      }

      let allImagesList = $(".allImages").parent();
      for (let i = 0; i < allImagesList.length; i++) {
        const currentStyles = window.getComputedStyle(allImagesList[i]);
        if (currentStyles.display !== "none") {
          const currentContainer = allImagesList[i];
          if ($(currentContainer).children(".search").length > 0) {
            loading($(currentContainer).children(".search"));
          } else {
            loading();
          }
        }
      }

      mealImage = $(".mealImage");
      imageContainer = $(".imageContainer");
      imageContainer.click(showMeal);
    }
  }

  displayMeals("search", "s=", "");

  //***********************! Get Info Of Meal ***********************
  async function showMeal(e) {
    contactSection.css({ display: "none" });
    $(".allImages").html("");
    listingContainer.css("display", "none");
    let imageName = $(e.target).text();
    let mealDetails = await fetchData("search", "s=", imageName);

    homeContainer.css({ display: "none" });
    searchMeal.css({ display: "none" });
    // loading();

    // console.log(mealDetails);
    targetImage.setAttribute("src", mealDetails.meals[0].strMealThumb);
    targetMealName.textContent = mealDetails.meals[0].strMeal;
    mealDesc.textContent = mealDetails.meals[0].strInstructions;
    category.textContent = mealDetails.meals[0].strCategory;
    area.textContent = mealDetails.meals[0].strArea;
    source.setAttribute("href", mealDetails.meals[0].strSource);
    youtupe.setAttribute("href", mealDetails.meals[0].strYoutube);

    //***********************! Get Tages ***********************
    tags.innerHTML = "";
    if (mealDetails.meals[0].strTags !== null) {
      let tagsArray = mealDetails.meals[0].strTags.split(",");
      // console.log(tagsArray);

      for (let x = 0; x < tagsArray.length; x++) {
        let oneTag = document.createElement("p");
        oneTag.classList.add(
          "span",
          "text-dark",
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
    recipes.innerHTML = "";

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
          "span",
          "text-dark",
          "p-2",
          "me-2",
          "rounded-2"
        );
        oneRecipe.textContent = `${obj.get(`strMeasure${i}`)} ${obj.get(
          `strIngredient${i}`
        )}`;
        recipes.append(oneRecipe);
      }
    }
    imageInfo.fadeIn(1000);
  }

  //***********************! Search ***********************
  searchBtn.click(function () {
    sideBarAnimation();
    homeContainer.css({ display: "none" });
    imageInfo.css({ display: "none" });
    contactSection.css({ display: "none" });

    $(".allImages").html("");
    searchMeal.fadeIn(500);
  });

  searchByName.keyup(async function () {
    searchByLetter.val("");
    let searchWord = searchByName.val();
    $(".allImages").html("");
    displayMeals("search", "s=", searchWord);
  });

  searchByLetter.keyup(function () {
    searchByName.val("");
    $(".allImages").html("");
    let searchLetter = searchByLetter.val();
    if (letterRegx.test(searchLetter)) {
      $(".allImages").html("");
      displayMeals("search", "f=", searchLetter);
    }
  });

  //***********************! Open Category Section ***********************

  categoryBtn.click(async function () {
    sideBarAnimation();
    loading();
    $(".allImages").html("");
    homeContainer.css({ display: "none" });
    imageInfo.css({ display: "none" });
    searchMeal.css({ display: "none" });
    contactSection.css({ display: "none" });
    listingContainer.css({ display: "block" });
    // *******************
    let allCategories = await fetchData("categories");
    // console.log(allCategories.categories);
    for (let item = 0; item < allCategories.categories.length; item++) {
      let colList = document.createElement("div");
      colList.classList.add("col-lg-3", "col-md-6", "colList");
      colList.setAttribute(
        "data-category",
        allCategories.categories[item].strCategory
      );

      let listContainer = document.createElement("div");
      listContainer.classList.add("list-container");

      let listImage = document.createElement("div");
      listImage.classList.add("list-image");
      let oneImage = document.createElement("img");
      oneImage.classList.add("w-100");
      oneImage.setAttribute(
        "src",
        `${allCategories.categories[item].strCategoryThumb}`
      );
      listImage.append(oneImage);

      let listImageLayer = document.createElement("div");
      listImageLayer.classList.add("list-image-layer");
      let listHead = document.createElement("h5");
      listHead.textContent = `${allCategories.categories[item].strCategory}`;
      let listDesc = document.createElement("p");
      listDesc.textContent = `${allCategories.categories[
        item
      ].strCategoryDescription
        .split(" ")
        .slice(0, 15)
        .join(" ")}`;
      listImageLayer.append(listHead);
      listImageLayer.append(listDesc);

      listContainer.append(listImage);
      listContainer.append(listImageLayer);

      colList.append(listContainer);
      listingRow.append(colList);
    }
    $(".colList").click(function (e) {
      $(".allImages").html("");
      let category = $(e.currentTarget).data("category");
      displayMeals("filter", "c=", category);
    });
  });
  //***********************! Open Area Section ***********************

  areaBtn.click(async function () {
    sideBarAnimation();
    loading();
    $(".allImages").html("");
    homeContainer.css({ display: "none" });
    imageInfo.css({ display: "none" });
    searchMeal.css({ display: "none" });
    contactSection.css({ display: "none" });
    listingContainer.css({ display: "block" });

    let x = await fetchData("list", "a=", "list");
    for (let j = 0; j < x.meals.length; j++) {
      let myDiv = document.createElement("div");
      myDiv.classList.add("col-lg-3", "col-md-6", "my-area");
      myDiv.setAttribute("data-area", x.meals[j].strArea);

      const areaContainer = document.createElement("div");
      areaContainer.className = "col-Div";

      const tag = document.createElement("h3");
      const tagIcon = document.createElement("i");
      tagIcon.classList.add("fa-solid", "fa-flag");
      tag.append(tagIcon);
      const tagName = document.createElement("h2");
      tagName.classList.add("tagName");
      tagName.textContent = x.meals[j].strArea;
      areaContainer.append(tag);
      areaContainer.append(tagName);
      myDiv.appendChild(areaContainer);
      $(".listingRow").append(myDiv);
    }

    $(".my-area").click(function (e) {
      let targetArea = $(e.currentTarget).data("area");
      // console.log(targetArea, e.currentTarget);
      $(".allImages").html("");
      displayMeals("filter", "a=", targetArea);
    });
  });
  //***********************! Open Ingredients Section ***********************
  ingredientsBut.click(async function () {
    sideBarAnimation();
    loading();
    $(".allImages").html("");
    homeContainer.css({ display: "none" });
    imageInfo.css({ display: "none" });
    searchMeal.css({ display: "none" });
    contactSection.css({ display: "none" });

    listingContainer.css({ display: "block" });

    let ingredient = await fetchData("list", "i=", "list");

    // console.log(ingredient.meals);
    if (ingredient.meals !== null) {
      for (let j = 0; j < 20; j++) {
        let myDiv = document.createElement("div");
        myDiv.classList.add("col-lg-3", "col-md-6", "my-ingredient");
        myDiv.setAttribute(
          "data-ingredient",
          ingredient.meals[j].strIngredient
        );

        const areaContainer = document.createElement("div");
        areaContainer.className = "col-Div";

        const tag = document.createElement("h3");
        const tagIcon = document.createElement("i");
        tagIcon.classList.add("fa-solid", "fa-bowl-food");
        tag.append(tagIcon);

        const tagName = document.createElement("h2");
        tagName.classList.add("tagName");
        tagName.textContent = ingredient.meals[j].strIngredient;

        const tagIngredient = document.createElement("p");
        tagIngredient.classList.add("tagIngredient");
        tagIngredient.textContent = `${ingredient.meals[j].strDescription
          .split(" ")
          .slice(0, 10)
          .join(" ")}`;

        areaContainer.append(tag);
        areaContainer.append(tagName);
        areaContainer.append(tagIngredient);
        myDiv.appendChild(areaContainer);
        $(".listingRow").append(myDiv);
      }

      $(".my-ingredient").click(function (e) {
        let targetIngredient = $(e.currentTarget).data("ingredient");
        // console.log(targetIngredient, e.currentTarget);
        $(".allImages").html("");
        displayMeals("filter", "i=", targetIngredient);
      });
    }
  });

  //***********************! Open Contact Section ***********************

  contactBtn.click(function () {
    sideBarAnimation();
    $(".allImages").html("");
    homeContainer.css({ display: "none" });
    imageInfo.css({ display: "none" });
    searchMeal.css({ display: "none" });
    listingContainer.css({ display: "none" });
    contactSection.css({ display: "flex" });

    const allInputs = document.querySelectorAll(".contact input");
    // console.log(allInputs);
    for (let i = 0; i < allInputs.length; i++) {
      allInputs[i].addEventListener("input", function () {
        if (allInputs[i].id == "repassword") {
          if (repassword.val() == password.val()) {
            repassword.addClass("is-valid");
            repassword.removeClass("is-invalid");
          } else {
            repassword.removeClass("is-valid");
            repassword.addClass("is-invalid");
          }
        } else {
          checkRegex(allInputs[i], regularExpressions[`${allInputs[i].id}`]);
        }
        const numOfValidInputs = document.querySelectorAll(".is-valid");
        if (numOfValidInputs.length == 6) {
          submit.removeAttr("disabled");
        } else {
          submit.attr("disabled", "true");
        }
      });
    }
  });

  function checkRegex(element, regexp) {
    if (regexp.test(element.value)) {
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");
    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");
    }
  }
});

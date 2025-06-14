document.addEventListener("DOMContentLoaded", () => {
  const usernameLoggedIn = localStorage.getItem("usernameLoggedIn");

  const instantFeedback = document.getElementById("instantFeedback");
  instantFeedback.style.display = "none";

  const twittForm = document.getElementById("twittForm");
  const ownerPhoto = document.getElementById("ownerPhoto");
  const twittsWrapper = document.getElementById("twittsWrapper");
  const twittContent = document.getElementById("twittContent");

  let selectedFeeling = null;

  const feelingItems = document.querySelectorAll(".item-feeling");

  feelingItems.forEach((item) => {
    item.addEventListener("click", () => {
      selectedFeeling = item.getAttribute("data-feeling");

      feelingItems.forEach((i) => i.classList.remove("border-[#1880e8]"));

      item.classList.add("border-[#1880e8]");
    });
  });

  // Verified Centang Biru Developer
  function isVerifiedUser(username) {
    const verifiedList = [
      "LangsDev",
      "ZddnnnYoo",
      "Fchriptra",
      "Dyzaa10",
      "AFIRES",
    ];
    return verifiedList.includes(username) || username.endsWith("48");
  }

  const twittManager = new Twitt();
  const userManager = new User();
  const twittUsers = userManager.getUsers();

  const ownerLoggedin = twittUsers.find(
    (user) => user.username.toLowerCase() === usernameLoggedIn.toLowerCase()
  );
  ownerPhoto.src = ownerLoggedin.avatar;

  // Membuat format tanggal dengan "yyyy-mm-dd"
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  twittForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const twittData = {
      twittContent: twittContent.value,
      twittUsernameOwner: usernameLoggedIn,
      twittFeeling: selectedFeeling,
      twittCreatedAt: `${year}-${month}-${day}`,
    };

    const result = twittManager.saveTwitt(twittData);

    if (result.success) {
      instantFeedback.style.display = "none";
      twittContent.value = "";
      selectedFeeling = null;

      feelingItems.forEach((item) => {
        item.classList.remove("border-[#1880e8]");
      });

      displayAllTwitts(twittManager.getTwitts());
    } else {
      instantFeedback.style.display = "flex";
      instantFeedback.textContent = result.error;
    }
  });

  const existingTwitts = twittManager.getTwitts();
  const existingLoveTwitt = twittManager.getLoveTwitts();

  function displayAllTwitts(twitts = existingTwitts) {
    if (twitts.length === 0) {
      console.log("tidak ada twitts tersedia");
    } else {
      console.log("tersedia twitts siap digunakan");
      twittsWrapper.innerHTML = "";

      twitts.sort((a, b) => b.id - a.id);

      twitts.forEach((twitt) => {
        const ownerTwitt = twittUsers.find(
          (user) =>
            user.username.toLowerCase() ===
            twitt.twittUsernameOwner.toLowerCase()
        );

        const getAllLoveTwitt = existingLoveTwitt.filter(
          (loveTwitt) => loveTwitt.twittId === twitt.id
        );
        const countLoveTwitt = getAllLoveTwitt.length;

        const hasLiked = twittManager.userHasLikedTwittValidate(
          twitt.id,
          usernameLoggedIn
        );

        const itemTwitt = document.createElement("div");
        itemTwitt.className = "bg-primary p-4 border-b-2 border-line";
        itemTwitt.id = `twitt-${twitt.id}`;
        itemTwitt.innerHTML = `
                <div class="flex items-center justify-between">
                        <div class="flex items-center justify-start">
                            <img id="visitProfile-${
                              ownerTwitt.username
                            }" src="${ownerTwitt.avatar}" alt="search" srcset=""
                                class="object-cover w-[46px] h-[46px] rounded-full">
                            <div class="pl-2">
                                <div class="flex gap-1">
                                    <p class="text-base font-bold inline-block">
                                      ${ownerTwitt.name}
                                      ${isVerifiedUser(twitt.twittUsernameOwner) ? '<img src="assets/verify.png" alt="" class="inline w-5 h-5 rounded-full">' : ""}
                                    </p>
                                </div>
                                <p class="text-username text-sm">@${
                                  twitt.twittUsernameOwner
                                } • ${twitt.twittCreatedAt}</p>
                            </div>
                        </div>
                        <div
                            class="flex justify-center items-center rounded-full px-3 py-1.5 border-line border-2 gap-1.5">
                            <p class="text-sm font-semibold">${
                              twitt.twittFeeling
                            }</p>
                        </div>
                    </div>

                    <p class="pl-[55px] py-2.5 leading-7 text-base">
                        ${twitt.twittContent}
                    </p>

                    <div class="flex justify-between items-center pl-[55px] w-[484px]">
                        <div class="flex justify-center items-center gap-2.5 pr-[250px]">
                            <a id="loveTwitt-${
                              twitt.id
                            }" href="#" class="cursor flex justify-start items-center w-[93px] gap-1.5">
                                <img class="like-icon" src="assets/${
                                  hasLiked ? `heart-fill.svg` : `heart.svg`
                                }" alt="heart">
                                <p id="totalLikeThatTwitt" class="text-sm font-normal text-like">${countLoveTwitt} Likes
                                </p>
                            </a>
                            ${
                              twitt.twittUsernameOwner === usernameLoggedIn
                                ? `<a id="deleteTwitt-${twitt.id}" href="#" class="cursor flex justify-start items-center w-[93px] gap-1.5">
                                <img src="assets/trash.svg" alt="heart">
                                <p class="text-sm font-normal text-username">Delete</p>
                            </a>`
                                : `<a href="#" class="flex justify-start items-center w-[93px] gap-1.5">
                                <img src="assets/warning-2.svg">
                                <p class="text-sm font-normal text-username">Report</p>
                            </a>`
                            }
                        </div>
                    </div>
                `;

        twittsWrapper.appendChild(itemTwitt);
        itemTwitt
          .querySelector(`#visitProfile-${ownerTwitt.username}`)
          .addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.setItem(
              "usernameProfileChosen",
              `${ownerTwitt.username}`
            );
            // arahkan pengguna kepada halaman lain yaitu login
            return (window.location.href = "../profile.html");
          });

        const totalLikeThatTwitt = itemTwitt.querySelector(
          "#totalLikeThatTwitt"
        );
        const likeIcon = itemTwitt.querySelector(".like-icon");

        //bikin eevent listener untuk fitur live
        itemTwitt
          .querySelector(`#loveTwitt-${twitt.id}`)
          .addEventListener("click", function (event) {
            event.preventDefault();

            const loveTwittData = {
              twittId: twitt.id,
              userId: usernameLoggedIn,
            };

            const result = twittManager.loveTwitt(loveTwittData);
            if (result.success) {
              let currentLikes = parseInt(totalLikeThatTwitt.textContent) || 0;

              if (result.unliked) {
                totalLikeThatTwitt.textContent = currentLikes - 1 + " Likes";
                likeIcon.src = "assets/heart.svg";
              } else {
                totalLikeThatTwitt.textContent = currentLikes + 1 + " Likes";
                likeIcon.src = "assets/heart-fill.svg";
              }

              instantFeedback.style.display = "none";
            } else {
              instantFeedback.style.display = "flex";
              instantFeedback.textContent = result.error;
            }

            // INI FLOW nya sudAH BETUL TETAPI DIA BINGUNG LIKE DAN UNLIKE
            // if(result.success){
            //   let currentLikes = parseInt(totalLikeThatTwitt.textContent) || 0;
            //   totalLikeThatTwitt.textContent = currentLikes + 1 + ' Likes';
            //   likeIcon.src = "assets/heart-fill.svg";
            // }else{
            //   let currentLikes = parseInt(totalLikeThatTwitt.textContent) || 0;
            //   totalLikeThatTwitt.textContent = currentLikes - 1 + " Likes";
            //   likeIcon.src = "assets/heart.svg";
            // }

            if (result.success) {
            } else {
              instantFeedback.style.display = "flex";
              instantFeedback.textContent = result.error;
            }
          });
        const deleteTwittButton = itemTwitt.querySelector(
          `#deleteTwitt-${twitt.id}`
        );

        if (deleteTwittButton) {
          deleteTwittButton.addEventListener("click", function (event) {
            event.preventDefault();
            const result = twittManager.deleteTwitt(twitt.id);
            if (result.success) {
              displayAllTwitts(twittManager.getTwitts());
            } else {
              instantFeedback.style.display = "flex";
              instantFeedback.textContent = result.error;
            }
          });
        }
      });
    }
  }

  displayAllTwitts();
});

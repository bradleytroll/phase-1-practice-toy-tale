// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");

  // Fetch all toys and render them on page load
  fetchToys();

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyForm = document.querySelector(".add-toy-form");

  // Toy form submission
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const nameInput = toyForm.querySelector('input[name="name"]');
    const imageInput = toyForm.querySelector('input[name="image"]');

    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };

    // Send POST request to add new toy
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        // Create and append new toy card to toy collection
        const card = createToyCard(toy);
        toyCollection.appendChild(card);

        // Clear form inputs
        nameInput.value = "";
        imageInput.value = "";
      })
      .catch(error => {
        console.log("Error adding toy:", error);
      });
  });

  toyCollection.addEventListener("click", event => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.id;
      const card = event.target.closest(".card");
      const likesDisplay = card.querySelector("p");

      // Send PATCH request to update toy's likes
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: parseInt(likesDisplay.textContent) + 1
        })
      })
        .then(response => response.json())
        .then(updatedToy => {
          // Update likes count in the DOM
          likesDisplay.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => {
          console.log("Error updating toy likes:", error);
        });
    }
  });

  // Helper function to create toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const name = document.createElement("h2");
    name.textContent = toy.name;

    const image = document.createElement("img");
    image.src = toy.image;
    image.classList.add("toy-avatar");

    const likes = document.createElement("p");
    likes.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.id = toy.id;
    likeBtn.textContent = "Like ❤️";

    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(likes);
    card.appendChild(likeBtn);

    return card;
  }

// Fetch all toys and render them on page load
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    })
    .catch(error => {
      console.log("Error fetching toys:", error);
    });
}
});
const { fetchUsers, fetchRestaurants, fetchReservations } = require("./api");
const usersList = document.querySelector("#users-list");
const restaurantsList = document.querySelector("#restaurants-list");
const reservationsList = document.querySelector("#reservations-list");

let users, restaurants;

const renderUsers = () => {
  const userId = window.location.hash.slice(1);
  const html = users
    .map((user) => {
      return `
            <li ${userId * 1 === user.id ? "class='selected'" : ""}>
                <a href='#${user.id}'>
                    ${user.name}
                </a>
            </li>
        `;
    })
    .join(" ");
  usersList.innerHTML = html;
};

const renderRestaurants = () => {
  const html = restaurants
    .map((restaurant) => {
      return `
            <li data-id='${restaurant.id}'>
                ${restaurant.name}
            </li>
        `;
    })
    .join(" ");
  restaurantsList.innerHTML = html;
};

reservationsList.addEventListener("click", async (e) => {
  const userId = window.location.hash.slice(1);
  if (userId) {
    if (e.target.tagName === "BUTTON") {
      const reservationId = e.target.getAttribute("data-id");
      const url = `/api/reservations/${reservationId}`;
      await fetch(url, {
        method: "DELETE",
      });
      renderReservations();
    }
  }
});

const renderReservations = async () => {
  const userId = window.location.hash.slice(1);
  if (userId) {
    const reservations = await fetchReservations(userId);
    const html = reservations
      .map((reservation) => {
        const restaurant = restaurants.find(
          (restaurant) => reservation.restaurantId === restaurant.id
        );
        return `
            <li>
                ${restaurant.name}
                </br>
                <button data-id='${reservation.id}'>Delete Reservation</button>
            </li>
        `;
      })
      .join(" ");
    reservationsList.innerHTML = html;
  } else {
    reservationsList.innerHTML = "";
  }
};

restaurantsList.addEventListener("click", async (e) => {
  if (e.target.tagName === "LI") {
    const restaurantId = e.target.getAttribute("data-id");
    const userId = window.location.hash.slice(1);
    const url = `/api/users/${userId}/reservations`;
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ restaurantId }),
      headers: { "Content-Type": "application/json" },
    });
    renderReservations();
  }
});

window.addEventListener("hashchange", () => {
  renderReservations();
  renderUsers();
});

const init = async () => {
  users = await fetchUsers();
  renderUsers();
  restaurants = await fetchRestaurants();
  renderRestaurants();
  renderReservations();
};

init();

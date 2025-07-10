document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("eventList");

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${event.name}</h5>
          <p class="card-text">${event.description}</p>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <a href="event-details.html?id=${event.id}" class="btn btn-primary">View Details</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
});

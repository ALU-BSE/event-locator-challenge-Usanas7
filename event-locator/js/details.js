document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = parseInt(params.get("id")); // Get the ID from the URL
  const event = events.find(e => e.id === eventId); // Find the matching event

  const container = document.getElementById("eventDetails");

  if (!event) {
    container.innerHTML = `<p class="text-danger">Event not found.</p>`;
    return;
  }

  container.innerHTML = `
    <h2>${event.name}</h2>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Location:</strong> ${event.location}</p>
    <p><strong>Category:</strong> ${event.category}</p>
    <p>${event.description}</p>
    <a href="events.html" class="btn btn-secondary mt-3">Back to Events</a>
  `;
});

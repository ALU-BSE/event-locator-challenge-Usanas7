function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function isEventUpcoming(eventDate) {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj >= today;
}

function filterEventsBySearch(events, searchTerm) {
    if (!searchTerm) return events;
    
    const term = searchTerm.toLowerCase();
    return events.filter(event => 
        event.name.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.organizer.toLowerCase().includes(term) ||
        event.tags.some(tag => tag.toLowerCase().includes(term))
    );
}

function filterEventsByDate(events, dateFilter) {
    if (!dateFilter) return events;
    
    return events.filter(event => event.date === dateFilter);
}

function filterEventsByCategory(events, categoryFilter) {
    if (!categoryFilter) return events;
    
    return events.filter(event => event.category === categoryFilter);
}

function getEventsByCategory(category) {
    return eventData.filter(event => event.category === category);
}

function getUpcomingEvents() {
    return eventData.filter(event => isEventUpcoming(event.date));
}

function getEventsSortedByDate(events) {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getFeaturedEvents() {
    const upcomingEvents = getUpcomingEvents();
    const sortedEvents = getEventsSortedByDate(upcomingEvents);
    return sortedEvents.slice(0, 3);
}

function getSimilarEvents(currentEvent, limit = 3) {
    return eventData
        .filter(event => event.id !== currentEvent.id && event.category === currentEvent.category)
        .slice(0, limit);
}


function addToFavorites(eventId) {
    let favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
    if (!favorites.includes(eventId)) {
        favorites.push(eventId);
        localStorage.setItem('eventFavorites', JSON.stringify(favorites));
        showNotification('Event added to favorites!', 'success');
    } else {
        showNotification('Event is already in favorites!', 'info');
    }
}

function removeFromFavorites(eventId) {
    let favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
    favorites = favorites.filter(id => id !== eventId);
    localStorage.setItem('eventFavorites', JSON.stringify(favorites));
    showNotification('Event removed from favorites!', 'success');
}

function getFavoriteEvents() {
    const favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
    return eventData.filter(event => favorites.includes(event.id));
}

function isEventFavorite(eventId) {
    const favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
    return favorites.includes(eventId);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function showLoadingState(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="loading mb-3"></div>
                <p class="text-muted">Loading events...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.closest('.text-center')?.remove();
    });
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setUrlParameter(name, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(name, value);
    } else {
        url.searchParams.delete(name);
    }
    window.history.replaceState({}, '', url);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function validateEvent(event) {
    const required = ['id', 'name', 'date', 'time', 'location', 'category', 'price'];
    return required.every(field => event.hasOwnProperty(field) && event[field] !== '');
}

function validateEventData() {
    const invalidEvents = eventData.filter(event => !validateEvent(event));
    if (invalidEvents.length > 0) {
        console.warn('Invalid events found:', invalidEvents);
    }
    return invalidEvents.length === 0;
}
document.addEventListener('DOMContentLoaded', function() {
    validateEventData();
});

function shareEvent(eventId) {
    const event = eventData.find(e => e.id === eventId);
    if (!event) return;
    
    const shareData = {
        title: event.name,
        text: `Check out this event: ${event.name}`,
        url: `${window.location.origin}/event-details.html?id=${eventId}`
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Event shared successfully!', 'success'))
            .catch(err => console.log('Error sharing:', err));
    } else {
        
        const url = shareData.url;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => showNotification('Event URL copied to clipboard!', 'success'))
                .catch(() => showNotification('Unable to copy URL', 'error'));
        } else {
            // Final fallback
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Event URL copied to clipboard!', 'success');
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatDateShort,
        getCurrentDate,
        isEventUpcoming,
        filterEventsBySearch,
        filterEventsByDate,
        filterEventsByCategory,
        getEventsByCategory,
        getUpcomingEvents,
        getEventsSortedByDate,
        getFeaturedEvents,
        getSimilarEvents,
        addToFavorites,
        removeFromFavorites,
        getFavoriteEvents,
        isEventFavorite,
        showNotification,
        shareEvent,
        validateEvent,
        validateEventData,
        getUrlParameter,
        setUrlParameter,
        debounce
    };
}
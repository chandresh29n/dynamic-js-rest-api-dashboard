import { fetchUsers } from "./api.js";

import {
    filterUsers,
    sortUsers
} from "./filters.js";

import {
    getFavorites,
    saveFavorites,
    getPreferences,
    savePreferences
} from "./storage.js";

import {
    renderUsers,
    renderCategories,
    showLoading,
    showError,
    hideError,
    updateStatistics,
    updateApiStatus,
    showEmptyState,
    updateResultsInfo
} from "./ui.js";


const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const favoritesOnly = document.getElementById("favoritesOnly");

const refreshBtn = document.getElementById("refreshBtn");
const retryBtn = document.getElementById("retryBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const categoryTabs = document.getElementById("categoryTabs");

let users = [];
let favorites = getFavorites();

let preferences = getPreferences();

let selectedCity = preferences.city;

let loading = false;


// SAVE CURRENT PREFERENCES

function saveCurrentPreferences() {

    preferences = {
        search: searchInput.value,
        city: selectedCity,
        sort: sortSelect.value,
        favoritesOnly: favoritesOnly.checked
    };

    savePreferences(preferences);

}


// RENDER APPLICATION

function renderDashboard() {

    const filteredUsers = filterUsers(
        users,
        searchInput.value,
        selectedCity,
        favorites,
        favoritesOnly.checked
    );

    const sortedUsers = sortUsers(
        filteredUsers,
        sortSelect.value
    );

    renderUsers(sortedUsers, favorites);

    updateStatistics(
        users.length,
        sortedUsers.length,
        favorites.length
    );

    showEmptyState(sortedUsers.length === 0);

    updateResultsInfo(sortedUsers.length);

    renderCategories(users, selectedCity);

    saveCurrentPreferences();

}


// LOAD API DATA

async function loadUsers() {

    if (loading) {
        return;
    }

    loading = true;

    refreshBtn.disabled = true;
    retryBtn.disabled = true;

    showLoading(true);

    hideError();

    updateApiStatus("Loading", "Fetching API data...");

    try {

        const data = await fetchUsers();

        users = data.filter(user =>
            user &&
            Number.isInteger(user.id) &&
            typeof user.name === "string" &&
            typeof user.email === "string" &&
            user.address &&
            typeof user.address.city === "string" &&
            user.company &&
            typeof user.company.name === "string" &&
            typeof user.website === "string"
        );

        if (users.length === 0) {
            throw new Error("No valid users were received from the API.");
        }

        const validIds = new Set(users.map(user => user.id));

        favorites = favorites.filter(id => validIds.has(id));

        saveFavorites(favorites);

        if (
            selectedCity !== "all" &&
            !users.some(user => user.address.city === selectedCity)
        ) {
            selectedCity = "all";
        }

        renderDashboard();

        updateApiStatus(
            "Online",
            `Updated: ${new Date().toLocaleTimeString()}`
        );

    } catch (error) {

        console.error("API loading error:", error);

        showError(error.message || "Something went wrong.");

        updateApiStatus("Offline", "Unable to load data");

        showEmptyState(false);

    } finally {

        showLoading(false);

        loading = false;

        refreshBtn.disabled = false;
        retryBtn.disabled = false;

    }

}


// RESTORE SAVED SETTINGS

function restorePreferences() {

    searchInput.value = preferences.search;

    sortSelect.value = preferences.sort;

    favoritesOnly.checked = preferences.favoritesOnly;

}


// LIVE SEARCH

searchInput.addEventListener("input", () => {

    renderDashboard();

});


// SORT USERS

sortSelect.addEventListener("change", () => {

    renderDashboard();

});


// FAVORITE FILTER

favoritesOnly.addEventListener("change", () => {

    renderDashboard();

});


// CITY CATEGORY FILTER

categoryTabs.addEventListener("click", event => {

    const button = event.target.closest("button[data-city]");

    if (!button) {
        return;
    }

    selectedCity = button.dataset.city;

    renderDashboard();

});


// ADD OR REMOVE FAVORITES

document.getElementById("usersGrid").addEventListener(
    "click",
    event => {

        const button = event.target.closest(".favorite-btn");

        if (!button) {
            return;
        }

        const userId = Number(button.dataset.userId);

        if (!Number.isInteger(userId)) {
            return;
        }

        if (favorites.includes(userId)) {

            favorites = favorites.filter(id => id !== userId);

        } else {

            favorites.push(userId);

        }

        saveFavorites(favorites);

        renderDashboard();

    }
);


// REFRESH DATA

refreshBtn.addEventListener("click", loadUsers);


// RETRY AFTER ERROR

retryBtn.addEventListener("click", loadUsers);


// CLEAR FILTERS

clearFiltersBtn.addEventListener("click", () => {

    searchInput.value = "";

    sortSelect.value = "name-asc";

    favoritesOnly.checked = false;

    selectedCity = "all";

    renderDashboard();

});


// INITIALIZE APPLICATION

restorePreferences();

loadUsers();

export function renderUsers(users, favorites) {

    const usersGrid = document.getElementById("usersGrid");

    usersGrid.replaceChildren();

    users.forEach(user => {

        const card = document.createElement("article");
        card.className = "user-card";

        const top = document.createElement("div");
        top.className = "user-card-top";

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = user.name.charAt(0).toUpperCase();
        avatar.setAttribute("aria-hidden", "true");

        const favoriteButton = document.createElement("button");

        const isFavorite = favorites.includes(user.id);

        favoriteButton.className = isFavorite
            ? "favorite-btn active"
            : "favorite-btn";

        favoriteButton.type = "button";

        favoriteButton.textContent = isFavorite ? "♥" : "♡";

        favoriteButton.setAttribute(
            "aria-label",
            isFavorite
                ? `Remove ${user.name} from favorites`
                : `Add ${user.name} to favorites`
        );

        favoriteButton.setAttribute(
            "aria-pressed",
            String(isFavorite)
        );

        favoriteButton.dataset.userId = user.id;

        top.append(avatar, favoriteButton);

        const name = document.createElement("h3");
        name.textContent = user.name;

        const company = document.createElement("p");
        company.className = "user-company";
        company.textContent = user.company.name;

        const email = document.createElement("p");
        email.className = "user-detail";
        email.textContent = `✉ ${user.email}`;

        const city = document.createElement("p");
        city.className = "user-detail";
        city.textContent = `Location: ${user.address.city}`;

        const website = document.createElement("p");
        website.className = "user-detail";

        const websiteLink = document.createElement("a");

        const safeWebsite = user.website.startsWith("http://") ||
            user.website.startsWith("https://")
            ? user.website
            : `https://${user.website}`;

        websiteLink.href = safeWebsite;
        websiteLink.target = "_blank";
        websiteLink.rel = "noopener noreferrer";
        websiteLink.textContent = user.website;

        website.append(websiteLink);

        const cityBadge = document.createElement("span");
        cityBadge.className = "city-badge";
        cityBadge.textContent = user.address.city;

        card.append(
            top,
            name,
            company,
            email,
            city,
            website,
            cityBadge
        );

        usersGrid.appendChild(card);

    });

}

export function renderCategories(users, selectedCity) {

    const categoryTabs = document.getElementById("categoryTabs");

    const cities = [
        ...new Set(users.map(user => user.address.city))
    ].sort();

    categoryTabs.replaceChildren();

    const allButton = document.createElement("button");

    allButton.type = "button";
    allButton.className = selectedCity === "all"
        ? "category-btn active"
        : "category-btn";

    allButton.dataset.city = "all";
    allButton.textContent = "All Cities";

    categoryTabs.appendChild(allButton);

    cities.forEach(city => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = selectedCity === city
            ? "category-btn active"
            : "category-btn";

        button.dataset.city = city;
        button.textContent = city;

        categoryTabs.appendChild(button);

    });

}

export function showLoading(show) {

    const skeleton = document.getElementById("loadingSkeleton");
    const usersGrid = document.getElementById("usersGrid");

    skeleton.hidden = !show;
    skeleton.setAttribute("aria-busy", String(show));

    if (show) {
        usersGrid.replaceChildren();
    }

    usersGrid.setAttribute("aria-busy", String(show));

}

export function showError(message) {

    const banner = document.getElementById("errorBanner");

    document.getElementById("errorMessage").textContent = message;

    banner.hidden = false;

}

export function hideError() {

    document.getElementById("errorBanner").hidden = true;

}

export function updateStatistics(total, filtered, favorites) {

    document.getElementById("totalUsers").textContent = total;

    document.getElementById("filteredUsers").textContent = filtered;

    document.getElementById("favoriteUsers").textContent = favorites;

}

export function updateApiStatus(status, message) {

    document.getElementById("apiStatus").textContent = status;

    document.getElementById("lastUpdated").textContent = message;

}

export function showEmptyState(show) {

    document.getElementById("emptyState").hidden = !show;

}

export function updateResultsInfo(count) {

    document.getElementById("resultsInfo").textContent =
        `${count} user${count !== 1 ? "s" : ""} displayed`;

}

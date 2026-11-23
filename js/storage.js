const STORAGE_KEYS = {
    FAVORITES: "dynamicBoardFavorites",
    PREFERENCES: "dynamicBoardPreferences"
};

export function getFavorites() {

    try {

        const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed.filter(id =>
                Number.isInteger(id) && id > 0
            )
            : [];

    } catch (error) {

        console.error("Unable to read favorites:", error);

        return [];

    }

}

export function saveFavorites(favorites) {

    try {

        localStorage.setItem(
            STORAGE_KEYS.FAVORITES,
            JSON.stringify(favorites)
        );

    } catch (error) {

        console.error("Unable to save favorites:", error);

    }

}

export function getPreferences() {

    const defaults = {
        search: "",
        city: "all",
        sort: "name-asc",
        favoritesOnly: false
    };

    try {

        const saved = localStorage.getItem(
            STORAGE_KEYS.PREFERENCES
        );

        if (!saved) {
            return defaults;
        }

        const parsed = JSON.parse(saved);

        if (!parsed || typeof parsed !== "object") {
            return defaults;
        }

        const validSorts = [
            "name-asc",
            "name-desc",
            "company-asc",
            "email-asc"
        ];

        return {
            search: typeof parsed.search === "string"
                ? parsed.search
                : defaults.search,

            city: typeof parsed.city === "string"
                ? parsed.city
                : defaults.city,

            sort: validSorts.includes(parsed.sort)
                ? parsed.sort
                : defaults.sort,

            favoritesOnly: typeof parsed.favoritesOnly === "boolean"
                ? parsed.favoritesOnly
                : defaults.favoritesOnly
        };

    } catch (error) {

        console.error("Unable to read preferences:", error);

        return defaults;

    }

}

export function savePreferences(preferences) {

    try {

        localStorage.setItem(
            STORAGE_KEYS.PREFERENCES,
            JSON.stringify(preferences)
        );

    } catch (error) {

        console.error("Unable to save preferences:", error);

    }

}

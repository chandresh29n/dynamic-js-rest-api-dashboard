const API_URL = "https://jsonplaceholder.typicode.com/users";

export async function fetchUsers() {

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }

        const users = await response.json();

        if (!Array.isArray(users)) {
            throw new Error("Invalid API response format.");
        }

        return users;

    } catch (error) {

        if (error.name === "AbortError") {
            throw new Error("Request timed out. Please try again.");
        }

        if (error instanceof TypeError) {
            throw new Error(
                "Network error. Please check your internet connection."
            );
        }

        throw error;

    } finally {

        clearTimeout(timeout);

    }

}

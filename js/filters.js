export function filterUsers(users, searchTerm, selectedCity, favorites, favoritesOnly) {

    const search = searchTerm.toLowerCase().trim();

    return users.filter(user => {

        const matchesSearch = [
            user.name,
            user.email,
            user.username,
            user.company.name,
            user.address.city
        ].some(value =>
            String(value).toLowerCase().includes(search)
        );

        const matchesCity =
            selectedCity === "all" ||
            user.address.city === selectedCity;

        const matchesFavorite =
            !favoritesOnly || favorites.includes(user.id);

        return matchesSearch && matchesCity && matchesFavorite;

    });

}

export function sortUsers(users, sortType) {

    const sortedUsers = [...users];

    sortedUsers.sort((a, b) => {

        let valueA;
        let valueB;

        switch (sortType) {

            case "name-desc":

                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();

                return valueB.localeCompare(valueA);

            case "company-asc":

                valueA = a.company.name.toLowerCase();
                valueB = b.company.name.toLowerCase();

                return valueA.localeCompare(valueB);

            case "email-asc":

                valueA = a.email.toLowerCase();
                valueB = b.email.toLowerCase();

                return valueA.localeCompare(valueB);

            case "name-asc":
            default:

                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();

                return valueA.localeCompare(valueB);

        }

    });

    return sortedUsers;

}

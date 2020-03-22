const Ui = {
    filterInputEl: document.getElementById('searchString'),
    filteredUsersEl: document.getElementById('listUser'),
    filteredGamesEl: document.getElementById('listGame'),
    filteredCharactersEl: document.getElementById('listChar'),
    left: document.getElementById('left'),
    right: document.getElementById('right'),

    listTemplate: null,

    async loadUsListTemplate() {
        const response = await fetch('/templates/user.mst');
        this.listTemplate = await response.text();
    },
    async loadGamListTemplate() {
        const response = await fetch('/templates/game.mst');
        this.listTemplate = await response.text();
    },
    async loadChListTemplate() {
        const response = await fetch('/templates/character.mst');
        this.listTemplate = await response.text();
    },

    setFilter(filter) { this.filterInputEl.value = filter; },

    renderUsers(users) {
        const template = this.listTemplate;
        if (users !== null) {
            if (users.prevVisibility === false) this.left.style.visibility = "hidden";
            if (users.nextVisibility === false) this.right.style.visibility = "hidden";
            if (users.prevVisibility === true) this.left.style.visibility = "visible";
            if (users.nextVisibility === true) this.right.style.visibility = "visible";
            document.getElementById('currPage').value = new Number(JSON.parse(users.currPage));
            document.getElementById('quantity').value = new Number(JSON.parse(users.quantity));
            const renderedHTML = Mustache.render(template, users);
            this.filteredUsersEl.innerHTML = renderedHTML;
        } else {
            this.left.style.visibility = "hidden";
            this.right.style.visibility = "hidden";
            document.getElementById('currPage').value = 0;
            document.getElementById('quantity').value = 0;
            const renderedHTML = Mustache.render(template, { users: [] });
            this.filteredUsersEl.innerHTML = renderedHTML;
        }
    },

    renderGames(games) {
        const template = this.listTemplate;
        if (games !== null) {
            if (games.prevVisibility === false) this.left.style.visibility = "hidden";
            if (games.nextVisibility === false) this.right.style.visibility = "hidden";
            if (games.prevVisibility === true) this.left.style.visibility = "visible";
            if (games.nextVisibility === true) this.right.style.visibility = "visible";
            document.getElementById('currPage').value = new Number(JSON.parse(games.currPage));
            document.getElementById('quantity').value = new Number(JSON.parse(games.quantity));
            const renderedHTML = Mustache.render(template, games);
            this.filteredGamesEl.innerHTML = renderedHTML;
        } else {
            this.left.style.visibility = "hidden";
            this.right.style.visibility = "hidden";
            document.getElementById('currPage').value = 0;
            document.getElementById('quantity').value = 0;
            const renderedHTML = Mustache.render(template, { games: [] });
            this.filteredGamesEl.innerHTML = renderedHTML;
        }
    },
    renderCharacters(characters) {
        const template = this.listTemplate;
        if (characters !== null) {
            if (characters.prevVisibility === false) this.left.style.visibility = "hidden";
            if (characters.nextVisibility === false) this.right.style.visibility = "hidden";
            if (characters.prevVisibility === true) this.left.style.visibility = "visible";
            if (characters.nextVisibility === true) this.right.style.visibility = "visible";
            document.getElementById('currPage').value = new Number(JSON.parse(characters.currPage));
            document.getElementById('quantity').value = new Number(JSON.parse(characters.quantity));
            const renderedHTML = Mustache.render(template, characters);
            this.filteredCharactersEl.innerHTML = renderedHTML;
        } else {
            this.left.style.visibility = "hidden";
            this.right.style.visibility = "hidden";
            document.getElementById('currPage').value = 0;
            document.getElementById('quantity').value = 0;
            const renderedHTML = Mustache.render(template, { characters: [] });
            this.filteredCharactersEl.innerHTML = renderedHTML;
        }
    },
};
const data = {
    games: [],
    _nameFilter: "",
    page: 1,

    get nameFilter() {
        return this._nameFilter.toLowerCase().trim();
    },
    set nameFilter(value) {
        this._nameFilter = value;
        Ui.setFilter(this.nameFilter);
        Ui.renderGames(this.filteredUsers);
    },
    nextPage() {
        this.page = this.page + 1;
    },
    prevPage() {
        this.page = this.page - 1;
    },

    setGames(games) {
        this.games = games.Events;
        let struct = {
            games: this.games,
            quantity: games.quantity,
            currPage: this.page,
            prevVisibility: games.prevVisibility,
            nextVisibility: games.nextVisibility
        };
        Ui.renderGames(struct);
    },
    setPage(num) {
        this.page = num;
    },
    get filteredGames() {
        const filterText = this.nameFilter;
        return !filterText ?
            this.games :
            this.games.filter(x =>
                x.event.toLowerCase()
                .includes(filterText));
    },
};

window.addEventListener('load', async(le) => {
    await Ui.loadGamListTemplate();
    reload();
});

Ui.filterInputEl.addEventListener('change', (e) => {
    data._nameFilter = e.target.value;
    data.setPage(1);
    reload();
});

Ui.left.addEventListener('click', (e) => {
    data.prevPage();
    reload();
});

Ui.right.addEventListener('click', (e) => {
    data.nextPage();
    reload();
});

function reload() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const games = xhr.responseText;
            data.setGames(JSON.parse(games));
        } else if (xhr.readyState == 4 && xhr.status == 204) {
            Ui.renderGames(null);
        }
    }
    xhr.open('GET', '/api/v1/game?find=' + data._nameFilter + '&page=' + data.page, false);
    xhr.send();
}
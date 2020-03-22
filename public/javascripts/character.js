const data = {
    characters: [],
    _nameFilter: "",
    page: 1,

    get nameFilter() {
        return this._nameFilter.toLowerCase().trim();
    },
    set nameFilter(value) {
        this._nameFilter = value;
        Ui.setFilter(this.nameFilter);
        Ui.renderCharacters(this.filteredUsers);
    },
    nextPage() {
        this.page = this.page + 1;
    },
    prevPage() {
        this.page = this.page - 1;
    },

    setCharacters(characters) {
        this.characters = characters.Events;
        let struct = {
            characters: this.characters,
            quantity: characters.quantity,
            currPage: this.page,
            prevVisibility: characters.prevVisibility,
            nextVisibility: characters.nextVisibility
        };
        Ui.renderCharacters(struct);
    },
    setPage(num) {
        this.page = num;
    },
    get filteredCharacters() {
        const filterText = this.nameFilter;
        return !filterText ?
            this.characters :
            this.characters.filter(x =>
                x.event.toLowerCase()
                .includes(filterText));
    },
};

window.addEventListener('load', async(le) => {
    await Ui.loadChListTemplate();
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
            const characters = xhr.responseText;
            data.setCharacters(JSON.parse(characters));
        } else if (xhr.readyState == 4 && xhr.status == 204) {
            Ui.renderCharacters(null);
        }
    }
    xhr.open('GET', '/api/v1/character?find=' + data._nameFilter + '&page=' + data.page, false);
    xhr.send();
}
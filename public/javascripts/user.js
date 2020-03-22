

const data = {
    users: [],
    _nameFilter: "",
    page: 1,

    get nameFilter() {
        return this._nameFilter.toLowerCase().trim();
    },
    set nameFilter(value) {
        this._nameFilter = value;
        Ui.setFilter(this.nameFilter);
        Ui.renderUsers(this.filteredUsers);
    },
    
    nextPage() {
        this.page = this.page + 1;
    },
    prevPage() {
        this.page = this.page - 1;
    },

    setUsers(users) {
        this.users = users.Events;
        let struct = {
            users: this.users,
            quantity : users.quantity,
            currPage : this.page,
            prevVisibility : users.prevVisibility,
            nextVisibility : users.nextVisibility
        };
        Ui.renderUsers(struct);
    },
    setPage(num) {
        this.page = num;
    },
    get filteredUsers() {
        const filterText = this.nameFilter;
        return !filterText
            ? this.users
            : this.users.filter(x =>  
                    x.fullname.toLowerCase()
                        .includes(filterText));
    }, 
};

window.addEventListener('load', async (le) => {
    await Ui.loadUsListTemplate();
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
        if (xhr.readyState == 4 && xhr.status == 200){
            const users = xhr.responseText;
            data.setUsers(JSON.parse(users));
        } else if (xhr.readyState == 4 && xhr.status == 204) {
            Ui.renderUsers(null);
        }
    }
    xhr.open('GET', '/api/v1/user?find='+data._nameFilter+'&page='+data.page, false);
    xhr.send();
}
const Ui = {
    login: document.getElementById('login'),
    pass1: document.getElementById('pass1'),
    pass2: document.getElementById('pass2'),
    error_log: document.getElementById('alreadyExists'),
    error_pass: document.getElementById('passNotEq'),

    listTemplate: null,
    str_pass1: null,
    str_pass2: null,
    logins: [],

    async loadUsListTemplate() {
        const response = await fetch('/templates/err.mst');
        this.listTemplate = await response.text();
    },

    renderReg(login, str) {
        if (login) {
            const renderedHTML = Mustache.render(this.listTemplate, { info: str });
            this.error_log.innerHTML = renderedHTML;
        } else {
            const renderedHTML = Mustache.render(this.listTemplate, { info: str });
            this.error_pass.innerHTML = renderedHTML;
        }
    }
};

window.addEventListener('load', async (le) => {
    Ui.loadUsListTemplate();
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let users = JSON.parse(xhr.responseText);
            Ui.logins = users;
        }
    }
    xhr.open('GET', '/api/v1/get_all_logins', false);
    xhr.send();
});

Ui.login.addEventListener('input', (e) => {
    let isTrue = false;
    for (let i in Ui.logins) {
        if (Ui.logins[i].login === e.target.value) {
            Ui.renderReg(true, "login is already exists!");
            isTrue = true
            break;
        }
    }
    if (!isTrue) {
        Ui.renderReg(true, "");
    }
});

Ui.pass1.addEventListener('input', (e) => {
    Ui.loadUsListTemplate();
    Ui.str_pass1 = e.target.value;
    if (Ui.str_pass1 !== Ui.str_pass2 && Ui.str_pass2.length !== 0 && Ui.str_pass1.length !== 0) {
        Ui.renderReg(false, "Passwords are not equals!");
    } else {
        Ui.renderReg(false, "");
    }
});

Ui.pass2.addEventListener('input', (e) => {
    Ui.loadUsListTemplate();
    Ui.str_pass2 = e.target.value;
    if (Ui.str_pass1 !== Ui.str_pass2 && Ui.str_pass1.length !== 0 && Ui.str_pass2.length !== 0) {
        Ui.renderReg(false, "Passwords are not equals!");
    } else {
        Ui.renderReg(false, "");
    }
});
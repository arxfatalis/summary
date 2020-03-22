const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String },
    fullname: { type: String },
    role: { type: Boolean, default: 0 },
    chatId: { type: String },
    tgUsername: { type: String },
    tgRegistered: { type: Boolean, default: 0 },
    tgMailing: { type: Boolean, default: 0 },
    avaUrl: { type: String, default: '/public/images/user.jpeg' },
    isDisabled: { type: Boolean, default: false },
    bio: { type: String },
    registeredAt: { type: Date, default: Date.now }
})

const UserModel = mongoose.model('User', UserSchema);

class User {
    constructor(id, login, password, role, fullname, registeredAt, avaUrl, isDisabled, bio, tgUsername, tgRegistered, tgMailing, chatId) {
        this.id = id; // user id
        this.login = login; //
        this.password = password;
        this.role = role; // 1 - admin or 0 - user
        this.fullname = fullname; //
        this.registeredAt = registeredAt; // ISO8601
        this.avaUrl = avaUrl; // URL img
        this.isDisabled = isDisabled; //
        this.bio = bio;
        this.tgUsername = tgUsername;
        this.tgRegistered = tgRegistered;
        this.tgMailing = tgMailing;
        this.chatId = chatId;
    }

    static getAllUsers() {
        return UserModel.find({}).sort({ created: -1 });
    }

    static getAll(search) {
        return new Promise((resolve, reject) => {
            UserModel.find().sort({ created: -1 })
                .then(data => {
                    let new_arr = [];
                    for (let p in data) {
                        if (!search || data[p].name.toLowerCase().includes(search.toLowerCase())) {
                            new_arr.push(data[p]);
                        }
                    }
                    resolve(new_arr);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }

    static getById(id) {
        return UserModel.findById(id);
    }

    static insert(user) {
        return new UserModel(user).save();
    }

    static addlink(userID, charID) {
        return this.linkExists(userID, charID)
            .then(user => {
                if (!user) return;
                user.characters.push(charID);
                return UserModel({ '_id': userID }, user);
            })
    }

    static linkExists(userID, charID) {
        this.getById(userID)
            .then(user => {
                let state = false;
                user.characters.forEach(character => {
                    if (character.id == charID) state = true;
                });
                if (state)
                    return user;
                else return
            })
    }

    static verificationOfExistence(login) {
        return UserModel.findOne({ "login": login });
    }

    static verificationOfExistenceTgUsername(tgUsername) {
        return UserModel.findOne({ "tgUsername": tgUsername });
    }

    static verificationOfExistenceTgChatId(chatId) {
        return UserModel.findOne({ "chatId": chatId });
    }

    static updateById(user, id) {
        return UserModel.updateOne({ "_id": id }, { $set: { "login": user.login, "fullname": user.fullname, "bio": user.bio, "tgUsername": user.tgUsername } });
    }

    static registerById(id, chatId) {
        return UserModel.updateOne({ "_id": id }, { $set: { "tgRegistered": true, "chatId": chatId } });
    }

    static setMailing(id, state) {
        return UserModel.updateOne({ "_id": id }, { $set: { "tgMailing": state } });
    }

    static setRole(id, role) {
        return UserModel.updateOne({ "_id": id }, { $set: { "role": role } });
    }
    static googleIdent(id) {
        return UserModel.findOne({ "password": id });
    }
}


module.exports = User;
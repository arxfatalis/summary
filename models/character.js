const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    region: { type: String },
    charYear: { type: Number, required: true },
    rating: { type: Number },
    name2: { type: String },
    img: { type: String },
    lor: { type: String },
    skins: { type: Array },
    addTime: { type: Date, default: Date.now }
})

const CharacterModel = mongoose.model('character', CharacterSchema);

class Character {
    constructor(id, fullname, region, addTime, charYear, rating, name2, img, lor, skins) {
        this.id = id; // id
        this.fullName = fullname; // full name
        this.region = region; // eg Ionia, Runeterra and so on
        this.charYear = charYear; //
        this.rating = rating; //
        this.name2 = name2;
        this.img = img;
        this.lor = lor;
        this.skins = skins;
        this.addTime = addTime; // ISO8601
    }

    static getAllCharacters() {
        return CharacterModel.find({}).sort({ created: -1 });
    }

    static getAll(search) {
        return new Promise((resolve, reject) => {
            CharacterModel.find().sort({ created: -1 }).then(data => {
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
        return CharacterModel.findById(id);
    }

    static insert(char) {
        return CharacterModel(char).save();
    }

    static deleteById(id) {
        return CharacterModel.deleteOne({ "_id": id });
    }

    static updateById(character, id) {
        return CharacterModel.updateOne({ "_id": id }, { $set: { "fullName": character.fullName, "region": character.region, "charYear": character.charYear, "rating": character.rating, "name2": character.name2, "img": character.img, "lor": character.lor, "skins": character.skins } });
    }
}

module.exports = Character;
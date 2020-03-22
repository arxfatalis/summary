const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genre: { type: String },
    year: { type: Number },
    rating: { type: Number },
    creator: { type: String },
    img: { type: String },
    about: { type: String }
})

const GameModel = mongoose.model('Game', GameSchema);

class Game {
    constructor(id, name, genre, year, rating, creator, img, about) {
        this.id = id;
        this.name = name;
        this.genre = genre;
        this.year = year;
        this.rating = rating;
        this.creator = creator;
        this.img = img;
        this.about = about;
    }

    static getAllGames() {
        return GameModel.find({}).sort({ created: -1 });
    }

    static getAll(search) {
        return new Promise((resolve, reject) => {
            GameModel.find().sort({ created: -1 }).then(data => {
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
        return GameModel.findById(id);
    }

    static insert(game) {
        return new GameModel(game).save();
    }

    static deleteById(id) {
        return GameModel.deleteOne({ "_id": id });
    }

    static updateById(game, id) {
        return GameModel.updateOne({ "_id": id }, { $set: { "name": game.name, "genre": game.genre, "year": game.year, "rating": game.rating, "creator": game.creator, "img": game.img, "about": game.about } });
    }
}

module.exports = Game;
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Stations', [

            {
                "name": "Stockholm C"
            },
            {
                "name": "Sundbyberg"
            },
            {
                "name": "Bålsta"
            },
            {
                "name": "Enköping"
            },
            {
                "name": "Västerås C"
            },
            {
                "name": "Köping"
            },
            {
                "name": "Arboga"
            },
            {
                "name": "Örebro C"
            },
            {
                "name": "Örebro Södra"
            },
            {
                "name": "Kumla"
            },
            {
                "name": "Hallsberg"
            },
            {
                "name": "Laxå"
            },
            {
                "name": "Töreboda"
            },
            {
                "name": "Skövde C"
            },
            {
                "name": "Falköping C"
            },
            {
                "name": "Herrljunga"
            },
            {
                "name": "Vårgårda"
            },
            {
                "name": "Alingsås"
            },
            {
                "name": "Göteborg C"
            },
            {
                "name": "Mölndal"
            },
            {
                "name": "Kungsbacka"
            },
            {
                "name": "Åsa"
            },
            {
                "name": "Varberg"
            },
            {
                "name": "Falkenberg"
            },
            {
                "name": "Halmstad C"
            },
            {
                "name": "Laholm"
            },
            {
                "name": "Båstad"
            },
            {
                "name": "Ängelholm"
            },
            {
                "name": "Helsingborg C"
            },
            {
                "name": "Landskrona"
            },
            {
                "name": "Lund C"
            },
            {
                "name": "Malmö C"
            },
            {
                "name": "Triangeln"
            },
            {
                "name": "Hyllie"
            },
            {
                "name": "Ramlösa"
            },
            {
                "name": "Rydebäck"
            },
            {
                "name": "Glumslöv"
            },
            {
                "name": "Häljarp"
            },
            {
                "name": "Dösjebro"
            },
            {
                "name": "Kävlinge"
            },
            {
                "name": "Gunnesbo"
            },
            {
                "name": "Åkarp"
            },
            {
                "name": "Burlöv"
            },
            {
                "name": "Svågertorp / Malmö Syd"
            },
            {
                "name": "Västra Ingelstad"
            },
            {
                "name": "Östra Grevie"
            },
            {
                "name": "Trelleborg"
            }

        ]);

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Stations', null, {});
    }
};

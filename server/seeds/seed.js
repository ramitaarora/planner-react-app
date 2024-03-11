const sequelize = require('../config/connection');

const userData = require('./userData.json');
const notesData = require('./notesData.json');
const parentGoalsData = require('./parentGoalsData.json');
const childGoalsData = require('./childGoalsData.json');
const dailyChecksData = require('./dailyChecksData.json');
const eventsData = require('./eventsData.json');

const { User, Goals, DailyChecks, Events, Notes, DailyChecksHistory, Tasks } = require('../models');

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();
const todaysDate = `${year}-${month}-${day}`;

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const events = await Events.bulkCreate(eventsData, {
        individualHooks: true,
        returning: true,
    })

    const dailyChecks = await DailyChecks.bulkCreate(dailyChecksData, {
        individualHooks: true,
        returning: true,
    })

    const notes = await Notes.bulkCreate(notesData, {
        individualHooks: true,
        returning: true,
    })

    const parentGoals = await Goals.bulkCreate(parentGoalsData, {
        individualHooks: true,
        returning: true,
    })

    const childGoals = await Goals.bulkCreate(childGoalsData, {
        individualHooks: true,
        returning: true,
    })

    for (let i = 0; i < dailyChecksData.length; i++) {
        const dailyChecksHistory = await DailyChecksHistory.create({
            daily_check: dailyChecksData[i].daily_check,
            user_id: dailyChecksData[i].user_id,
            parent_id: dailyChecksData[i].id,
            date: todaysDate,
            completed: false,
        }, {
            individualHooks: true,
            returning: true,
        })
    }



    process.exit(0);
};

seedDatabase();

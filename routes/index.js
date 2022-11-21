const { ensureGuest, ensureAuth } = require('../middlware/authMiddleware');
const router = require('express').Router();
const Story = require('../models/storyModel');

router.get('/', ensureGuest, (req, res) => {
    res.render('login');
});
router.get('/dashboard', ensureAuth, async (req, res) => {
    //console.log(req.user);
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            stories: req.story,
        });
        stories;
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
    // res.render('dashboard', { name: req.user.firstName });
});

module.exports = router;

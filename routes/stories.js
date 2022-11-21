const router = require('express').Router();
const { ensureAuth } = require('../middlware/authMiddleware');
const Story = require('../models/storyModel');

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});
//process the add form
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        const st = await Story.create(req.body);
        res.render('/stories');
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

module.exports = router;

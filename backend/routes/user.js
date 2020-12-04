//import all required packages here
const express = require("express");
const router = express.Router();

//middleware for protected routes
const isAuth=require('../middleware/isAuth')

//importing controllers 
const userController = require("../controllers/user");

router.get("/:id/subscribe",[isAuth],userController.subscribe);
router.get("/history",[isAuth],userController.history);
router.get("/getlikedVideo",[isAuth], userController.likedVideos);
router.get("/Trending",userController.Trending);
router.get("/recommendedChannels",[isAuth], userController.recommendedChannels);
router.get("/subscribedchannelFeed",[isAuth],userController.recommendedChannelsVideos);
router.get('/myfeed',[isAuth],userController.myfeed);
router.post('/editprofile',[isAuth],userController.editProfile);
router.get('/:id/profile',[isAuth],userController.myProfile);
router.get("/:id/watchlater",[isAuth],userController.addToWatchLater);
//router.delete("/:id/remove/watchLater",[isAuth],userController.removeFromWatchLater);
router.get("/WatchLaterVideos",[isAuth],userController.getWatchLater);
router.get('/search',[isAuth],userController.searchUser);
router.get('/Trending/Category',userController.categoryWiseVideos);
module.exports = router;
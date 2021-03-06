const asyncHandler = require('express-async-handler');
const { Op, Sequelize } = require("sequelize");
const User = require('../models/user');
const Video = require('../models/video');
const View = require('../models/view');
const Like = require('../models/like');
const Comment = require('../models/comment');
const Reply = require('../models/replies');
const subscribe = require('../models/subscribe');
const sequelize = require("../utils/database");
const watch = require('../models/watchLater');
const { exception } = require("console");

exports.subscribe = asyncHandler(async (req, res, next) => {
  // console.log(req.user.id);
  // console.log(req.params.id);
  console.log("hello");
  
  if ((req.user.id).toString() === (req.params.id).toString()) {
    return res.status(400).json({ error: "You cannot to subscribe to your own channel" });
  }

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "no user found for id ${req.params.id}" });
  }

  const isSubscribed = await subscribe.findOne({
    where: {
      subscriber: req.user.id,
      subscribeTo: req.params.id,
    },
  });

  if (isSubscribed) {
    user.subscriberCount-=1;
    user.save();
    await subscribe.destroy({
      where: {
        subscriber: req.user.id,
        subscribeTo: req.params.id,
      },
    });
  } else {
    user.subscriberCount+=1;
    user.save();
    await subscribe.create({
      subscriber: req.user.id,
      subscribeTo: req.params.id,
    });
  }

  res.status(200).json({ success: true, data: {} });
});

exports.history = asyncHandler(async (req, res, next) => {
  console.log("hello");
    const videoRelations = await View.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "ASC"]],
    });
  
    const videoIds = videoRelations.map((videoRelation) => videoRelation.videoId);
  
    const videos = await Video.findAll({
      attributes: ["id", "title", "description", "createdAt", "videourl","videoThumbnail"],
      include: {
        model: User,
        attributes: ["id", "name", "profilepic","channelName"],
      },
      where: {
        id: {
          [Op.in]: videoIds,
        },
      },
    });
  
    if (!videos.length) {
      return res.status(200).json({ success: true, data: videos });
    }
  
    videos.forEach(async (video, index) => {
      const views = await View.count({ where: { videoId: video.id } });
      video.setDataValue("views", views);
  
      if (index === videos.length - 1) {
        return res.status(200).json({ success: true, data: videos });
      }
    });
});

exports.likedVideos = asyncHandler(async (req, res, next) => {
  console.log("hello");
  const videoRelations = await Like.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "ASC"]],
  });

  const videoIds = videoRelations.map((videoRelation) => videoRelation.videoId);

  const videos = await Video.findAll({
    attributes: ["id", "title", "description", "createdAt", "videourl","videoThumbnail"],
    include: {
      model: User,
      attributes: ["id", "name", "profilepic", "channelName"],
    },
    where: {
      id: {
        [Op.in]: videoIds,
      },
    },
  });

  if (!videos.length) {
    return res.status(200).json({ success: true, data: videos });
  }

  videos.forEach(async (video, index) => {
    const views = await View.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);

    if (index === videos.length - 1) {
      return res.status(200).json({ success: true, data: videos });
    }
  });
});

exports.Trending =asyncHandler(async(req,res,next)=>{
  const videos = await Video.findAll({
    limit: 20,
    attributes: [
      "id",
      "title",
      "description",
      "videourl",
      "userId",
      "createdAt",
      "viewsCount",
      "likesCount",
      "videoThumbnail"
    ],
    include: [{ model: User, attributes: ["id", "profilepic", "name","channelName" ]}],
    order: [[sequelize.literal('COALESCE(likesCount, 0) + COALESCE(viewsCount, 0)'), 'DESC']]
    // //order: [[sequelize.fn('SUM', sequelize.col('viewsCount'), sequelize.col('likesCount')) ,'DESC']]
    //order : [['viewsCount' ,'DESC']]
    //order: [[Sequelize.fn('SUM', Sequelize.where(Sequelize.col('viewsCount'), '+', Sequelize.col('likesCount'))), 'DESC']]
  });

    return res.status(200).json({ success: true, data: videos });

});

exports.recommendedChannels = asyncHandler(async (req,res,next)=>{
  const userdata = await User.findAll({
    limit: 20,
    attributes: [
      "id",
      "name",
      "email",
      "channelName",
      "profilepic",
      "subscriberCount",
    ],
    where :{
      id: {
        [Op.not]: req.user.id,
      },
    },
    //order: [[sequelize.fn('SUM', sequelize.col('viewsCount'), sequelize.col('likesCount')) ,'DESC']]
    order : [['subscriberCount' ,'DESC']]
  });

    return res.status(200).json({ success: true, data: userdata });
});

exports.recommendedChannelsVideos =asyncHandler(async(req,res,next)=>{
  const subscribers = await subscribe.findAll({
    where:{
      subscriber:req.user.id
    }
  });
  const subscriptions = subscribers.map((sub) => sub.subscribeTo);

  const feed = await Video.findAll({
    include: {
      model: User,
      attributes: ["id", "profilepic", "name","channelName"],
    },
    where: {
      userId: {
        [Op.in]: subscriptions,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ success: true, data: feed });
});

exports.myfeed = asyncHandler ( async (req,res,next)=>{
  const myvideos = await Video.findAll({
    where : {
      userId : req.user.id
    },
    include: [{ model: User, attributes: ["id", "profilepic", "name","channelName" ,"videoThumbnail"]}],
    order :[
      ['createdAt','DESC']
    ]
  })
  return res.status(200).json({ success: true, data: myvideos });
});

exports.editProfile = asyncHandler( async(req,res,next)=>{
  
  const name=req.body.name;
  const image=req.file;
  const about = req.body.about;
  const channelName = req.body.channelName;
  const profilepic = (image.path).split('\\')[1];

  const check = await User.findOne({
    where:{
      channelName:channelName
    }
  });
  // console.log(check.id);
  // console.log(req.user.id);
  if(check)
  {
    if((check.id).toString() !== (req.user.id).toString())
    {
      return res.status(400).json({error:"OOPS!!! channel name already taken"});
    }
  }

  const user = await User.findByPk(req.user.id, {
  attributes: { exclude: ['password','confirmPassword'] }
  });

   console.log(req.file);
//  // user.about = req.body.about;
//   if(req.file)
//   {
//     user.profilepic = (req.file).split('\\')[1];
//   }
//  // user.name = req.body.name;
//   //user.channelName=req.body.channelName;
console.log(user);
user.name = name;
user.profilepic = profilepic;
user.about=about;
//user.about = about;
user.channelName = channelName;
  await user.save();
  res.status(200).json({ success: true, data: user });
});

exports.addToWatchLater = asyncHandler (async (req,res,next)=>{

  const video = await Video.findByPk(req.params.id);

  if (!video) {
    return res.status(404).json({ message:"no video data available for id ${req.params.id}" });
  }

  const added = await watch.findOne({
    where: {
      userId: req.user.id,
      videoId: req.params.id,
    },
  });

  if (added) {
    // return next(res.status(400).json({ message:"already added" }));
    await added.destroy({
      where:{
        userId: req.user.id,
        videoId: req.params.id,
      }
    });

    return res.status(200).json({ message:"removed from watch later" });
  }

  await watch.create({
    userId: req.user.id,
    videoId: req.params.id,
  });
  res.status(200).json({ messgae:"added to watch later" });
});

exports.myProfile = asyncHandler(async(req,res,next)=>{
  
  const user= await User.findByPk(req.params.id,{
    attributes: { exclude: ['password','confirmPassword'] }
  });

  if(!user)
  {
    return res.status(404).json({error:"no user found"});
  }

  const videodata = await Video.findAll({
    where:{
      userId : req.params.id
    }
  });

  const subscribedChannel = await subscribe.findAll({
    where : {
      subscriber : req.params.id
    }
  });

  const channelIds = subscribedChannel.map((sub) => sub.subscribeTo);
  const channels = await User.findAll({
    attributes: ["id", "profilepic", "name","channelName","subscriberCount"],
    where: {
      id: { [Op.in]: channelIds },
    },
  });

  const isSubscribed = await subscribe.findOne({
    where: {
      [Op.and]: [{ subscriber: req.user.id }, { subscribeTo: req.params.id }],
    },
  });

  const isMe = (req.user.id).toString() === (req.params.id).toString();

  user.setDataValue("isSubscribed", !!isSubscribed);
  user.setDataValue("isMe",isMe);
  user.setDataValue("subscribedChannel",channels);
  user.setDataValue("videodata",videodata);
  


  return res.status(200).json({data:user});
});

exports.getWatchLater = asyncHandler(async (req, res, next) => {
  console.log("hello");
  const videoRelations = await watch.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "ASC"]],
  });

  const videoIds = videoRelations.map((videoRelation) => videoRelation.videoId);

  const videos = await Video.findAll({
    attributes: ["id", "title", "description", "createdAt", "videourl","videoThumbnail"],
    include: {
      model: User,
      attributes: ["id", "name", "profilepic", "channelName"],
    },
    where: {
      id: {
        [Op.in]: videoIds,
      },
    },
  });

  if (!videos.length) {
    return res.status(200).json({ success: true, data: videos });
  }

  videos.forEach(async (video, index) => {
    const views = await View.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);

    if (index === videos.length - 1) {
      return res.status(200).json({ success: true, data: videos });
    }
  });
});

exports.searchUser = asyncHandler(async(req,res,next)=>{

  const tosearch=(req.query.item).toString();
  if(!tosearch) 
  {
    return res.status(404).json({error:"please search sth"});
  }

  const userdata = await User.findAll({
    where:{
       channelName :{
         [Op.substring]: tosearch
       }
    },
    attributes: { exclude: ['password','confirmPassword'] }
  });

  const videodata = await Video.findAll({
    
    where:{
      [Op.or]:[
        {
          title:{
            [Op.substring]: tosearch
          }
        },
        {
          description:{
            [Op.substring]: tosearch
          }
        }
      ]
    },
    include: {
      model: User,
      attributes: ["id", "name", "profilepic","channelName"],
    },
  });
  return res.status(200).json({userdata,videodata});

});

exports.categoryWiseVideos = asyncHandler(async (req,res,next)=>{
  const videodata = await Video.findAll({
    where:{
      
      category : req.query.category
    },
    include: [{ model: User, attributes: ["id", "profilepic", "name","channelName" ]}],
    order: [["createdAt", "DESC"]]
  });

  return res.status(200).json({success:videodata});
});




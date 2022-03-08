var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound, checkPointSound, dieSound;

var restart, gameOver;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-20,width,10);
  ground.addImage("ground",groundImage);
  ground.scale = 1.5;
  ground.x = ground.width /2;
  
   gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  // create obstacle and cloud groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(255);
  // displaying score
  text("Score: "+ score, width/2-25,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    // move the ground
    ground.velocityX = -(4+2*score/100);

    // scoring
    score += Math.round(getFrameRate()/30);
    if(score % 500===0 && score > 0){
      checkPointSound.play();
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    // jump when the space key is pressed
    if(keyDown("space") && trex.isTouching(ground)) {
        trex.velocityY = -15;
        jumpSound.play();
        jumpSound.setVolume(0.3);
    }
    
    // add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    // spawn the clouds
    spawnClouds();
  
    // spawn obstacles on the ground
    spawnObstacles();
    
    // the isTouching function
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();

        // AI to the trex
        // trex.velocityY = -12;
        // jumpSound.play();
        // jumpSound.setVolume(0.3);
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      // change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      // set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
     
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);


     if(mousePressedOver(restart) || touches.length > 0 || keyDown("space")){
        console.log("reset the game");
        reset();
        touches = [];
      }
   }
  
 
  // stop trex from falling down
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-35,10,40);
   obstacle.velocityX = -(6+2*score/100);
   
    // generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    // assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   // add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  // write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,height-165,40,10);
    cloud.y = Math.round(random(10,3*height/4));
    cloud.addImage(cloudImage);
    cloud.scale = 0.9;
    cloud.velocityX = -3;
    
     // assign lifetime to the variable
    cloud.lifetime = width/3;
    
    // adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    // adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  score = 0;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running");
  gameState = PLAY;

}
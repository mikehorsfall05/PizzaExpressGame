let stage="welcome";

let doughImg,sauceImg;
let sauceBtnImg
let doughBounds,sauceBounds
let uncookedBounds={}
let cookedBounds={}
let toppingImgs={}
let bowlImgs={}
let bowlBounds={}
let uncookedImgs={}
let cookedImgs={}
let bgImg
let welcomeBgImg
let endBgImg
let gameFont
let flameImg
let cheeseParticleImg
let cheeseParticleSprite

let pizzaX,pizzaY

let baseSize=300
let pulse=0
let pulseSpeed=0.08
let doughGrowth=90
let maxSize=baseSize+doughGrowth
let pizzaWidthScale=1.12
let pizzaRenderScale=1.125

let doughStopped=false

let sauceBtn,bakeBtn,finishBtn,replayBtn

let fadeStart,bakeStart

let toppings=[]
let tray=[]
let dragged=null

let slicesNeeded
let sliceStart=null
let slices=[]
let currentSlice=null
let linesNeeded=0
let sliceLayer
let sauceLayer
let cheeseRevealLayer
let sliceCutWidth=9
let stopwatchStartMs=0
let stopwatchElapsedMs=0
let stopwatchRunning=false

let cheeseParticles=[]
let steam=[]
let confetti=[]
let flourParticles=[]
let transitionStart=0

let presentationStars=0
let slicingStars=0
let overallStars=0
let overallCapStars=5
let endRevealStartMs=0
let endRevealStarted=false

const END_BOUNCE_MS=420
const END_STAR_STAGGER_MS=140

const TOPPING_LABELS={
  pepperoni:"Pepperoni",
  ham:"Ham",
  chicken:"Chicken",
  jalapeno:"Jalapenos",
  mushroom:"Mushrooms",
  pepper:"Peppers",
  onion:"Onions",
  peppadew:"Peppadews",
  groundBeef:"Ground Beef",
  olive:"Olives"
}

const RECIPES=[
  {id:"americanHot",name:"American Hot",pepperoni:10,jalapeno:5},
  {id:"laReine",name:"La Reine",ham:3,mushroom:6,olive:6},
  {id:"polloAdAstra",name:"Pollo Ad Astra",chicken:5,onion:5,peppadew:5},
  {id:"sloppyGiuseppe",name:"Sloppy Giuseppe",groundBeef:9,onion:3,pepper:3}
]

let recipe
let usedCounts={}
let counterAlpha=255
let recipeLineAlpha={}
let cheeseProgress=0
let cheeseStrokePoints=[]
let cheeseSamples=[]
let cheeseCoveredCount=0
let cheeseRequiredCount=0
let cheeseBrushRadius=48
let allCorrect=false
let trayAlpha=255

function preload(){
  gameFont=loadFont("Sauce Tomato Font/Sauce Tomato.otf")
  flameImg=loadImage("PNG Pizza Express Photos/Flame.png")
  cheeseParticleImg=loadImage("PNG Pizza Express Photos/Cheese.png")
  bgImg=loadImage("PNG Pizza Express Photos/Background.jpg")
  welcomeBgImg=loadImage("PNG Pizza Express Photos/WelcomeBackground.avif")
  endBgImg=loadImage("PNG Pizza Express Photos/end screen background.jpg")
  doughImg=loadImage("PNG Pizza Express Photos/Dough.png")
  sauceImg=loadImage("PNG Pizza Express Photos/SaucedBase.png")
  sauceBtnImg=loadImage("PNG Pizza Express Photos/Sauce.png")
  
  toppingImgs.pepperoni=loadImage("PNG Pizza Express Photos/Pepperoni.png")
  toppingImgs.jalapeno=loadImage("PNG Pizza Express Photos/Jalapeno.png")
  toppingImgs.ham=loadImage("PNG Pizza Express Photos/Ham.png")
  toppingImgs.mushroom=loadImage("PNG Pizza Express Photos/Mushroom.png")
  toppingImgs.olive=loadImage("PNG Pizza Express Photos/Olive.png")
  toppingImgs.chicken=loadImage("PNG Pizza Express Photos/Chicken.png")
  toppingImgs.onion=loadImage("PNG Pizza Express Photos/Onion.png")
  toppingImgs.peppadew=loadImage("PNG Pizza Express Photos/Peppadew.png")
  toppingImgs.groundBeef=loadImage("PNG Pizza Express Photos/GroundBeef.png")
  toppingImgs.pepper=loadImage("PNG Pizza Express Photos/Pepper.png")

  bowlImgs.pepperoni=loadImage("PNG Pizza Express Photos/PepperoniBowl.png")
  bowlImgs.jalapeno=loadImage("PNG Pizza Express Photos/JalapenoBowl.png")
  bowlImgs.ham=loadImage("PNG Pizza Express Photos/HamBowl.png")
  bowlImgs.mushroom=loadImage("PNG Pizza Express Photos/MushroomBowl.png")
  bowlImgs.olive=loadImage("PNG Pizza Express Photos/OliveBowl.png")
  bowlImgs.chicken=loadImage("PNG Pizza Express Photos/ChickenBowl.png")
  bowlImgs.onion=loadImage("PNG Pizza Express Photos/OnionBowl.png")
  bowlImgs.peppadew=loadImage("PNG Pizza Express Photos/PeppadewBowl.png")
  bowlImgs.groundBeef=loadImage("PNG Pizza Express Photos/GroundBeefBowl.png")
  bowlImgs.pepper=loadImage("PNG Pizza Express Photos/PepperBowl.png")

  uncookedImgs.americanHot=loadImage("PNG Pizza Express Photos/UncookedAmericanHot.png")
  cookedImgs.americanHot=loadImage("PNG Pizza Express Photos/AmericanHot.png")
  uncookedImgs.laReine=loadImage("PNG Pizza Express Photos/UncookedLaReine.png")
  cookedImgs.laReine=loadImage("PNG Pizza Express Photos/LaReine.png")
  uncookedImgs.polloAdAstra=loadImage("PNG Pizza Express Photos/UncookedPolloAdAstra.png")
  cookedImgs.polloAdAstra=loadImage("PNG Pizza Express Photos/PolloAdAstra.png")
  uncookedImgs.sloppyGiuseppe=loadImage("PNG Pizza Express Photos/UncookedSloppyGiuseppe.png")
  cookedImgs.sloppyGiuseppe=loadImage("PNG Pizza Express Photos/SloppyGiuseppe.png")
}

function setup(){
  createCanvas(1000,700)
  textFont(gameFont)
  sliceLayer=createGraphics(width,height)
  initCheeseParticleSprite()
  pizzaX=width/2
  pizzaY=height/2+25

  recipe=random(RECIPES)
  usedCounts={};
  for(let k in recipe) if(k!="id" && k!="name") usedCounts[k]=0;
  recipeLineAlpha={}
  for(let k in recipe) if(k!="id" && k!="name") recipeLineAlpha[k]=255;
  slicesNeeded=random([4,6,8])
  linesNeeded=slicesNeeded/2

  sauceBtn={x:width-140,y:height/2,w:190,h:190}
  bakeBtn=new Button(width-150,height-80,"Bake")
  finishBtn=new Button(width-210,height/2-70,"✔")
  finishBtn.w=150
  finishBtn.h=150
  replayBtn=new Button(width/2-70,height/2+140,"Replay")
  
  createTray()

  for(let key in bowlImgs){
    bowlBounds[key]=getOpaqueBounds(bowlImgs[key])
  }
  doughBounds=getOpaqueBounds(doughImg)
  sauceBounds=getOpaqueBounds(sauceImg)
  for(let key in uncookedImgs){
    uncookedBounds[key]=getOpaqueBounds(uncookedImgs[key])
  }
  for(let key in cookedImgs){
    cookedBounds[key]=getOpaqueBounds(cookedImgs[key])
  }
}

function draw(){
  if(stage=="welcome" && welcomeBgImg){
    imageMode(CORNER)
    image(welcomeBgImg,0,0,width,height)
  } else if(bgImg){
    imageMode(CORNER)
    image(bgImg,0,0,width,height)
    noStroke()
    fill(255,255,255,26)
    rect(0,0,width,height)
  } else {
    background(245)
  }
  imageMode(CENTER)

  if(stage=="welcome") drawWelcome()
  if(stage=="startTransition") drawStartTransition()
  if(stage=="dough") drawDough()
  if(stage=="sauceFade") drawSauceFade()
  if(stage=="toppings") drawToppings()
  if(stage=="cheeseAnim") drawCheese()
  if(stage=="readyBake") drawReadyBake()
  if(stage=="baking") drawBake()
  if(stage=="slice") drawSlice()
  if(stage=="end") drawEnd()

  if(stopwatchRunning){
    stopwatchElapsedMs=millis()-stopwatchStartMs
  }
  if(stage!="welcome" && stage!="startTransition" && stage!="end"){
    drawStopwatch()
  }
}

function drawWelcome(){
  textAlign(CENTER,CENTER)
  textSize(38)
  textStyle(BOLD)
  stroke(255)
  strokeWeight(6)
  fill(0)
  text("Do YOU think you've got what it takes\nto become a pizzaiolo pro?",width/2,height/2-25)
  noStroke()
  drawStartButton(255)
}

function drawStartTransition(){
  let coverMs=2500
  let revealMs=2500
  let totalMs=coverMs+revealMs
  let elapsed=millis()-transitionStart

  if(elapsed<coverMs){
    // Flour sprinkles and builds white cover over welcome screen.
    for(let i=0;i<30;i++) flourParticles.push(new FlourParticle())
    drawWelcomeFaded(255)

    let coverAlpha=constrain(map(elapsed,0,coverMs,0,255),0,255)
    for(let p of flourParticles){
      p.update()
      p.show(coverAlpha)
    }
    noStroke()
    fill(255,coverAlpha)
    rect(0,0,width,height)
    return
  }

  // White fades away while dough image + dough text fade in.
  let revealT=constrain(elapsed-coverMs,0,revealMs)
  let doughAlpha=constrain(map(revealT,0,revealMs,0,255),0,255)
  let whiteAlpha=constrain(map(revealT,0,revealMs,255,0),0,255)

  if(flourParticles.length>0){
    flourParticles=[]
  }

  drawDoughTransitionFrame(doughAlpha)
  noStroke()
  fill(255,whiteAlpha)
  rect(0,0,width,height)

  if(elapsed>=totalMs){
    flourParticles=[]
    pulse=-HALF_PI
    doughStopped=false
    stopwatchStartMs=millis()
    stopwatchElapsedMs=0
    stopwatchRunning=true
    stage="dough"
  }
}

function drawWelcomeFaded(alpha){
  if(welcomeBgImg){
    push()
    imageMode(CORNER)
    tint(255,alpha)
    image(welcomeBgImg,0,0,width,height)
    noTint()
    pop()
  }
  push()
  textAlign(CENTER,CENTER)
  textSize(38)
  textStyle(BOLD)
  stroke(255,alpha)
  strokeWeight(6)
  fill(0,alpha)
  text("Do YOU think you've got what it takes\nto become a pizzaiolo pro?",width/2,height/2-25)
  noStroke()
  pop()
  drawStartButton(alpha)
}

function drawDoughTransitionFrame(alpha){
  let size=baseSize+sin(-HALF_PI)*doughGrowth
  let pizzaW=size*pizzaWidthScale*pizzaRenderScale
  let pizzaH=size*pizzaRenderScale
  drawPizzaBase(doughImg,doughBounds,pizzaW,pizzaH,alpha)

  textAlign(CENTER)
  textSize(24)
  textStyle(NORMAL)
  stroke(255,alpha)
  strokeWeight(4)
  fill(0,alpha)
  text("Press when the dough is at its biggest",width/2,60)
  noStroke()
}

function drawDough(){
  textAlign(CENTER)
  textSize(24)
  textStyle(NORMAL)
  stroke(255)
  strokeWeight(4)
  fill(0)
  text("Press when the dough is at its biggest",width/2,60)
  noStroke()
  
  if(!doughStopped) pulse+=pulseSpeed
  let size=baseSize+sin(pulse)*doughGrowth
  let pizzaW=size*pizzaWidthScale*pizzaRenderScale
  let pizzaH=size*pizzaRenderScale
  
  drawPizzaBase(doughImg,doughBounds,pizzaW,pizzaH,255)
  
  if(doughStopped){
    drawSauceButton()
  }
}

function drawSauceFade(){
  let t=millis()-fadeStart
  let fade=constrain(map(t,0,2000,0,255),0,255)
  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  
  // Seamless crossfade: dough fades out as sauce fades in.
  drawPizzaBase(doughImg,doughBounds,pizzaW,pizzaH,255-fade)
  drawPizzaBase(sauceImg,sauceBounds,pizzaW,pizzaH,fade)
  
  if(t>2000) stage="toppings"
}

function drawToppings(){
  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  drawPizzaBase(sauceImg,sauceBounds,pizzaW,pizzaH,255)

  for(let bowl of tray){
    let need=recipe[bowl.type]||0
    let have=usedCounts[bowl.type]||0
    bowl.setCompleted(need>0 && have>=need)
  }

  textAlign(CENTER,TOP)
  textSize(27)
  textStyle(BOLD)
  stroke(255)
  strokeWeight(5)
  fill(0)
  text(recipe.name,width/2,12)
  textSize(16)
  textStyle(NORMAL)
  text("You'll need:",width/2,54)
  noStroke()

  drawTray(trayAlpha)
  
  for(let t of toppings){
    t.update()
    t.show()
  }
  
  allCorrect = true;
  let idx=0;
  for(let k in recipe){
    if(k!="id" && k!="name"){
      let have = usedCounts[k]||0;
      if(have < recipe[k]){
        allCorrect=false;
      }
    }
  }

  if(allCorrect){
    trayAlpha=max(0,trayAlpha-8)
    if(trayAlpha<=0){
      initCheeseCoverage()
      stage="cheeseAnim"
      return
    }
  } else {
    trayAlpha=255
  }
  
  // counter just below recipe at the top
  push();
  translate(width/2,90);
  textAlign(CENTER,TOP);
  textSize(12);
  idx=0;
  for(let k in recipe){
    if(k!="id" && k!="name"){
      let have = usedCounts[k]||0;
      let targetAlpha = have>=recipe[k] ? 0 : counterAlpha;
      let currentAlpha = recipeLineAlpha[k]===undefined ? counterAlpha : recipeLineAlpha[k];
      recipeLineAlpha[k]=lerp(currentAlpha,targetAlpha,0.2);
      stroke(255,recipeLineAlpha[k]);
      strokeWeight(3);
      fill(0,recipeLineAlpha[k]);
      text(recipe[k]+" "+toppingDisplayName(k), 0, idx*24);
      noStroke();
      idx++;
    }
  }
  pop();
  
  // labels last so they are in front of all assets
  drawTrayHoverLabels(trayAlpha)
}

function drawCheese(){
  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  
  if(sauceLayer){
    imageMode(CORNER)
    image(sauceLayer,0,0)
    imageMode(CENTER)
  } else {
    drawPizzaBase(sauceImg,sauceBounds,pizzaW,pizzaH,255)
  }
  
  for(let t of toppings){
    t.showFade(255)
  }

  if(cheeseRevealLayer){
    imageMode(CORNER)
    image(cheeseRevealLayer,0,0)
    imageMode(CENTER)
  }
  
  for(let i=cheeseParticles.length-1;i>=0;i--){
    let p=cheeseParticles[i]
    p.update()
    p.show()
    if(p.isDead()) cheeseParticles.splice(i,1)
  }

  textAlign(CENTER,TOP)
  textStyle(BOLD)
  textSize(24)
  stroke(255)
  strokeWeight(5)
  fill(0)
  text("Don't forget to add the cheese!",width/2,22)
  textStyle(NORMAL)
  textSize(14)
  strokeWeight(3)
  text("(Pro tip: Click and drag the mouse across the pizza to add the cheese)",width/2,56)
  noStroke()
  
  if(cheeseProgress>=1) stage="readyBake"
}

function drawReadyBake(){
  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  drawPizzaBase(uncookedImgs[recipe.id],uncookedBounds[recipe.id],pizzaW,pizzaH,255)
  drawFlameBtn()
}

function drawBake(){
  let t=millis()-bakeStart
  let fade=map(t,0,5000,0,255)
  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  
  // Spawn steam continuously during baking
  if(t<5000 && random(1)<0.9){
    steam.push(new Steam())
  }
  
  drawPizzaBase(uncookedImgs[recipe.id],uncookedBounds[recipe.id],pizzaW,pizzaH,255-fade)
  drawPizzaBase(cookedImgs[recipe.id],cookedBounds[recipe.id],pizzaW,pizzaH,fade)
  
  // Draw steam in front
  for(let i=steam.length-1;i>=0;i--){
    let s=steam[i]
    s.update()
    s.show()
    if(s.isDead()) steam.splice(i,1)
  }
  
  if(t>5000){
    stage="slice"
  }
}

function drawSlice(){
  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  let cookedImg=cookedImgs[recipe.id]
  let cookedB=cookedBounds[recipe.id]

  // Build pizza on an offscreen layer, then cut through it so only pizza pixels are erased.
  sliceLayer.clear()
  sliceLayer.push()
  sliceLayer.tint(255,255)
  sliceLayer.image(
    cookedImg,
    pizzaX-pizzaW/2,
    pizzaY-pizzaH/2,
    pizzaW,
    pizzaH,
    cookedB.x,
    cookedB.y,
    cookedB.w,
    cookedB.h
  )
  sliceLayer.noTint()

  let sctx=sliceLayer.drawingContext
  sctx.save()
  sctx.globalCompositeOperation="destination-out"
  sctx.strokeStyle="rgba(0,0,0,1)"
  sctx.lineCap="round"
  sctx.lineJoin="round"
  sctx.lineWidth=sliceCutWidth

  for(let sliceLine of slices){
    sctx.beginPath()
    sctx.moveTo(sliceLine.x1,sliceLine.y1)
    sctx.lineTo(sliceLine.x2,sliceLine.y2)
    sctx.stroke()
  }

  // Live preview while dragging: preview cut is erased on pizza, not drawn as an overlay line.
  if(currentSlice){
    sctx.beginPath()
    sctx.moveTo(currentSlice.x1,currentSlice.y1)
    sctx.lineTo(currentSlice.x2,currentSlice.y2)
    sctx.stroke()
  }

  sctx.restore()
  sliceLayer.pop()
  imageMode(CORNER)
  image(sliceLayer,0,0)
  
  for(let s of steam){
    s.update()
    s.show()
  }
  
  textFont(gameFont);
  textAlign(CENTER)
  textSize(20)
  textStyle(NORMAL)
  stroke(255)
  strokeWeight(4)
  fill(0)
  text("Click and drag across the pizza to slice it into "+slicesNeeded+" pieces",width/2,60)
  noStroke()
  
  if(slices.length>=linesNeeded){
    drawFinishTick()
  }
}

function drawEnd(){
  if(!endRevealStarted){
    startEndRevealAnimation()
  }

  if(endBgImg){
    imageMode(CORNER)
    image(endBgImg,0,0,width,height)
    noStroke()
    fill(255,255,255,36)
    rect(0,0,width,height)
    imageMode(CENTER)
  } else {
    background(240)
  }

  let elapsed=max(0,millis()-endRevealStartMs)
  let timerStart=0
  let scoreStart=timerStart+END_BOUNCE_MS
  let starsStart=scoreStart+END_BOUNCE_MS
  let starsTotalMs=END_BOUNCE_MS+(overallCapStars-1)*END_STAR_STAGGER_MS
  let messageStart=starsStart+starsTotalMs

  let centerY=height/2
  let timerY=centerY-150
  let scoreY=centerY-65
  let starsY=centerY+10
  let messageY=centerY+90

  textFont(gameFont);

  drawStampedText("Time: "+stopwatchText(),width/2,timerY,30,elapsed,timerStart,END_BOUNCE_MS)
  drawStampedText("Your Score",width/2,scoreY,24,elapsed,scoreStart,END_BOUNCE_MS)
  drawStampedStars(width/2-90,starsY,overallStars,overallCapStars,elapsed,starsStart,END_BOUNCE_MS,END_STAR_STAGGER_MS)

  let starsForMessage=constrain(round(overallStars),1,5)
  let endMessage=""
  if(starsForMessage===5){
    endMessage="WOW! You really are a pro,\nenjoy a free pizza on us!"
  } else if(starsForMessage===4){
    endMessage="Well done! You've earnt yourself\na classic margherita!"
  } else if(starsForMessage===3){
    endMessage="Almost there,\nenjoy a free soft drink!"
  } else if(starsForMessage===2){
    endMessage="Unlucky,\nat least you still get 10% off"
  } else {
    endMessage="Is that really the best you can do?\nHopefully some dough balls will cheer you up?"
  }

  drawStampedText(endMessage,width/2,messageY,16,elapsed,messageStart,END_BOUNCE_MS,true,28)

  noStroke()
  for(let c of confetti){
    c.update()
    c.show()
  }

  replayBtn.x=width/2-replayBtn.w/2
  replayBtn.y=centerY+155
  replayBtn.show()
}

function mousePressed(){
  if(stage=="welcome" && startBtnHover()){
    transitionStart=millis()
    flourParticles=[]
    stage="startTransition"
    return
  }

  if(stage=="startTransition") return

  if(stage=="dough"){
    let size=baseSize+sin(pulse)*doughGrowth
    if(abs(size-maxSize)<8){
      doughStopped=true
    }else{
      pulseSpeed*=1.25
    }
  }

  if(stage=="dough" && doughStopped && sauceBtnHover()){
    fadeStart=millis()
    stage="sauceFade"
  }
  
  if(stage=="toppings"){
    for(let i=toppings.length-1;i>=0;i--){
      let t=toppings[i]
      if(t.hover()){
        dragged=t
        dragged.dragging=true
        return
      }
    }

    if(trayAlpha>0){
      for(let t of tray){
        if(t.hover()){
          let n=new Topping(t.type,mouseX,mouseY)
          n.correct = recipe.hasOwnProperty(t.type) && recipe[t.type] > 0
          toppings.push(n)
          dragged=n
          n.dragging=true
          return
        }
      }
    }

  }
  
  if(stage=="readyBake" && flameBtnHover()){
    bakeStart=millis()
    stage="baking"
  }
  
  if(stage=="slice" && slices.length>=linesNeeded && finishBtn.hover()){
    if(stopwatchRunning){
      stopwatchElapsedMs=millis()-stopwatchStartMs
      stopwatchRunning=false
    }
    calculateScore()
    spawnConfetti()
    startEndRevealAnimation()
    stage="end"
    return
  }
  
  if(stage=="slice" && slices.length<linesNeeded){
    sliceStart={x:mouseX,y:mouseY}
    currentSlice={x1:mouseX,y1:mouseY,x2:mouseX,y2:mouseY}
  }
  
  if(stage=="end" && replayBtn.hover()){
    location.reload()
  }
}

function mouseDragged(){
  if(stage=="slice" && sliceStart && currentSlice){
    currentSlice.x2=mouseX
    currentSlice.y2=mouseY
  }

  if(stage=="cheeseAnim"){
    paintCheeseStroke(pmouseX,pmouseY,mouseX,mouseY)
  }
  
  if(dragged) dragged.dragging=true
}

function mouseReleased(){
  if(dragged){
    if(stage=="toppings"){
      dragged.dragging=false;
      if(pointOnSauceOpaqueArea(dragged.x,dragged.y)){
        if(!dragged.onPizza){
          dragged.onPizza=true;
          usedCounts[dragged.type] = (usedCounts[dragged.type]||0)+1;
          if(!dragged.correct){
            let bowl=getTrayItemForType(dragged.type)
            if(bowl) bowl.triggerWrongDrop()
          }
        }
      } else {
        dragged.fading=true;
        dragged.fadeStart=millis();
        if(dragged.onPizza){
          dragged.onPizza=false;
          usedCounts[dragged.type] = max(0,(usedCounts[dragged.type]||0)-1);
        }
      }
    }
    dragged=null;
  }
  
  if(stage=="slice" && currentSlice && sliceStart){
    let lineLength=dist(currentSlice.x1,currentSlice.y1,currentSlice.x2,currentSlice.y2)
    if(lineLength>20){
      slices.push(currentSlice)
    }
    currentSlice=null
    sliceStart=null
  }
}

function syncPointerFromTouch(){
  if(touches && touches.length>0){
    mouseX=touches[0].x
    mouseY=touches[0].y
  }
}

function touchStarted(){
  syncPointerFromTouch()
  mousePressed()
  return false
}

function touchMoved(){
  syncPointerFromTouch()
  mouseDragged()
  return false
}

function touchEnded(){
  mouseReleased()
  return false
}

function createTray(){
  let keys=["pepperoni","ham","chicken","jalapeno","mushroom","pepper","onion","peppadew","groundBeef","olive"]
  let leftX=95
  let rightX=width-95
  let startY=75
  let spacingY=130
  for(let i=0;i<keys.length;i++){
    let col=i%2
    let row=floor(i/2)
    let x=col==0 ? leftX : rightX
    tray.push(new TrayItem(keys[i],x,startY+row*spacingY))
  }
}

function getTrayItemForType(type){
  for(let t of tray){
    if(t.type===type) return t
  }
  return null
}

function initCheeseCoverage(){
  cheeseProgress=0
  cheeseParticles=[]
  cheeseStrokePoints=[]
  cheeseSamples=[]
  cheeseCoveredCount=0
  cheeseRequiredCount=0

  sauceLayer=createGraphics(width,height)
  sauceLayer.imageMode(CENTER)
  sauceLayer.clear()
  sauceLayer.push()
  sauceLayer.tint(255,255)
  sauceLayer.image(sauceImg,pizzaX,pizzaY,maxSize*pizzaWidthScale*pizzaRenderScale,maxSize*pizzaRenderScale,sauceBounds.x,sauceBounds.y,sauceBounds.w,sauceBounds.h)
  sauceLayer.noTint()
  sauceLayer.pop()

  cheeseRevealLayer=createGraphics(width,height)
  cheeseRevealLayer.imageMode(CENTER)
  cheeseRevealLayer.clear()

  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  let left=pizzaX-pizzaW/2
  let top=pizzaY-pizzaH/2
  let step=14

  for(let y=top;y<=top+pizzaH;y+=step){
    for(let x=left;x<=left+pizzaW;x+=step){
      if(pointOnSauceOpaqueArea(x,y)){
        cheeseSamples.push({x:x,y:y,covered:false})
      }
    }
  }

  cheeseRequiredCount=cheeseSamples.length
}

function paintCheeseStroke(x1,y1,x2,y2){
  let d=dist(x1,y1,x2,y2)
  let stepDist=max(6,cheeseBrushRadius*0.45)
  let steps=max(1,floor(d/stepDist))

  for(let i=0;i<=steps;i++){
    let t=steps===0 ? 1 : i/steps
    let x=lerp(x1,x2,t)
    let y=lerp(y1,y2,t)
    paintCheeseAt(x,y)
  }
}

function paintCheeseAt(x,y){
  if(!pointOnSauceOpaqueArea(x,y)) return

  cheeseStrokePoints.push({x:x,y:y})

  if(sauceLayer){
    let ctx=sauceLayer.drawingContext
    ctx.save()
    ctx.globalCompositeOperation="destination-out"
    ctx.fillStyle="rgba(0,0,0,1)"
    ctx.beginPath()
    ctx.arc(x,y,cheeseBrushRadius,0,TWO_PI)
    ctx.fill()
    ctx.restore()
  }

  if(cheeseRevealLayer){
    let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
    let pizzaH=maxSize*pizzaRenderScale
    let uncookedImg=uncookedImgs[recipe.id]
    let uncookedB=uncookedBounds[recipe.id]
    let ctx=cheeseRevealLayer.drawingContext
    ctx.save()
    ctx.beginPath()
    ctx.arc(x,y,cheeseBrushRadius,0,TWO_PI)
    ctx.clip()
    cheeseRevealLayer.image(
      uncookedImg,
      pizzaX,
      pizzaY,
      pizzaW,
      pizzaH,
      uncookedB.x,
      uncookedB.y,
      uncookedB.w,
      uncookedB.h
    )
    ctx.restore()
  }

  for(let i=0;i<2;i++) cheeseParticles.push(new CheeseParticle(x,y))

  let r2=cheeseBrushRadius*cheeseBrushRadius
  for(let s of cheeseSamples){
    if(!s.covered){
      let dx=s.x-x
      let dy=s.y-y
      if(dx*dx+dy*dy<=r2){
        s.covered=true
        cheeseCoveredCount++
      }
    }
  }

  if(cheeseRequiredCount>0){
    cheeseProgress=constrain(cheeseCoveredCount/cheeseRequiredCount,0,1)
  } else {
    cheeseProgress=1
  }
}

function pointOnSauceOpaqueArea(x,y){
  if(!sauceImg || !sauceBounds) return false
  if(!sauceImg.pixels || sauceImg.pixels.length===0) sauceImg.loadPixels()

  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  let left=pizzaX-pizzaW/2
  let top=pizzaY-pizzaH/2

  if(x<left || x>left+pizzaW || y<top || y>top+pizzaH) return false

  let u=(x-left)/pizzaW
  let v=(y-top)/pizzaH
  let srcX=floor(sauceBounds.x + u*sauceBounds.w)
  let srcY=floor(sauceBounds.y + v*sauceBounds.h)

  srcX=constrain(srcX,sauceBounds.x,sauceBounds.x+sauceBounds.w-1)
  srcY=constrain(srcY,sauceBounds.y,sauceBounds.y+sauceBounds.h-1)

  let idx=(srcY*sauceImg.width+srcX)*4+3
  return sauceImg.pixels[idx]>5
}

function pointOnUncookedOpaqueArea(x,y){
  if(!recipe || !uncookedImgs[recipe.id] || !uncookedBounds[recipe.id]) return false
  let img=uncookedImgs[recipe.id]
  let bounds=uncookedBounds[recipe.id]
  
  if(!img.pixels || img.pixels.length===0) img.loadPixels()

  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  let left=pizzaX-pizzaW/2
  let top=pizzaY-pizzaH/2

  if(x<left || x>left+pizzaW || y<top || y>top+pizzaH) return false

  let u=(x-left)/pizzaW
  let v=(y-top)/pizzaH
  let srcX=floor(bounds.x + u*bounds.w)
  let srcY=floor(bounds.y + v*bounds.h)

  srcX=constrain(srcX,bounds.x,bounds.x+bounds.w-1)
  srcY=constrain(srcY,bounds.y,bounds.y+bounds.h-1)

  let idx=(srcY*img.width+srcX)*4+3
  return img.pixels[idx]>5
}

function pointOnCookedOpaqueArea(x,y){
  if(!recipe || !cookedImgs[recipe.id] || !cookedBounds[recipe.id]) return false
  let img=cookedImgs[recipe.id]
  let bounds=cookedBounds[recipe.id]

  if(!img.pixels || img.pixels.length===0) img.loadPixels()

  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  let left=pizzaX-pizzaW/2
  let top=pizzaY-pizzaH/2

  if(x<left || x>left+pizzaW || y<top || y>top+pizzaH) return false

  let u=(x-left)/pizzaW
  let v=(y-top)/pizzaH
  let srcX=floor(bounds.x + u*bounds.w)
  let srcY=floor(bounds.y + v*bounds.h)

  srcX=constrain(srcX,bounds.x,bounds.x+bounds.w-1)
  srcY=constrain(srcY,bounds.y,bounds.y+bounds.h-1)

  let idx=(srcY*img.width+srcX)*4+3
  return img.pixels[idx]>5
}

function drawPizzaBase(img,bounds,destW,destH,alpha){
  tint(255,alpha)
  image(img,pizzaX,pizzaY,destW,destH,bounds.x,bounds.y,bounds.w,bounds.h)
  noTint()
}

function sauceBtnHover(){
  return dist(mouseX,mouseY,sauceBtn.x,sauceBtn.y)<max(sauceBtn.w,sauceBtn.h)/2
}

function drawSauceButton(){
  push()
  if(sauceBtnHover()) tint(255,220)
  image(sauceBtnImg,sauceBtn.x,sauceBtn.y,sauceBtn.w,sauceBtn.h)
  noTint()
  pop()
}

function flameBtnHover(){
  let flameX=width-130
  let flameY=height/2
  let flameSize=160
  return dist(mouseX,mouseY,flameX,flameY)<flameSize/2
}

function stopwatchText(){
  let totalSeconds=floor(stopwatchElapsedMs/1000)
  let mins=floor(totalSeconds/60)
  let secs=totalSeconds%60
  return nf(mins,2)+":"+nf(secs,2)
}

function drawStopwatch(){
  push()
  textAlign(CENTER,BOTTOM)
  textStyle(BOLD)
  textSize(26)
  stroke(255)
  strokeWeight(4)
  fill(0)
  text(stopwatchText(),width/2,height-14)
  noStroke()
  pop()
}

function drawFlameBtn(){
  let flameX=width-130
  let flameY=height/2
  let flameSize=160
  push()
  if(flameBtnHover()) tint(255,220)
  image(flameImg,flameX,flameY,flameSize,flameSize)
  noTint()
  pop()
}

function startEndRevealAnimation(){
  endRevealStartMs=millis()
  endRevealStarted=true
}

function revealProgress(elapsed,startMs,durationMs){
  return constrain((elapsed-startMs)/max(1,durationMs),0,1)
}

function easeOutCubic(t){
  return 1-pow(1-t,3)
}

function easeInOutQuad(t){
  if(t<0.5) return 2*t*t
  return 1-pow(-2*t+2,2)/2
}

function stampScaleFromProgress(p){
  if(p<=0) return 0.01
  if(p>=1) return 1

  if(p<0.45){
    return lerp(0.01,1.24,easeOutCubic(p/0.45))
  }
  if(p<0.75){
    return lerp(1.24,0.93,easeInOutQuad((p-0.45)/0.30))
  }
  return lerp(0.93,1,easeOutCubic((p-0.75)/0.25))
}

function revealAlphaFromProgress(p){
  return constrain(map(p,0,0.25,0,255),0,255)
}

function drawStampedText(message,x,y,size,elapsed,startMs,durationMs,isCentered,leading){
  let p=revealProgress(elapsed,startMs,durationMs)
  if(p<=0) return

  let s=stampScaleFromProgress(p)
  let a=revealAlphaFromProgress(p)

  push()
  translate(x,y)
  scale(s)
  textAlign(CENTER,isCentered?CENTER:BASELINE)
  textStyle(NORMAL)
  textSize(size)
  stroke(255,a)
  strokeWeight(4)
  fill(0,a)
  if(leading!==undefined) textLeading(leading)
  text(message,0,0)
  pop()
}

function drawStampedStars(x,y,filled,total,elapsed,startMs,durationMs,staggerMs){
  let roundedFilled=constrain(round(filled),0,total)
  for(let i=0;i<total;i++){
    let p=revealProgress(elapsed,startMs+i*staggerMs,durationMs)
    if(p<=0) continue

    let s=stampScaleFromProgress(p)
    let a=revealAlphaFromProgress(p)

    push()
    translate(x+i*40,y)
    scale(s)
    if(i<roundedFilled){
      fill(255,220,0,a)
      stroke(200,160,0,a)
    } else {
      fill(235,235,235,a)
      stroke(170,170,170,a)
    }
    star(0,0,10,20,5)
    pop()
  }
}

function drawFinishTick(){
  let cx=finishBtn.x+finishBtn.w/2
  let cy=finishBtn.y+finishBtn.h/2
  let tickSize=130
  push()
  translate(cx,cy)
  if(finishBtn.hover()){
    noStroke()
    fill(255,255,255,120)
    ellipse(0,0,tickSize+30,tickSize+30)
  }
  stroke(34,160,70)
  strokeWeight(16)
  strokeCap(ROUND)
  noFill()
  line(-32,8,-10,30)
  line(-10,30,38,-28)
  pop()
}

function initCheeseParticleSprite(){
  if(!cheeseParticleImg) return

  let src=cheeseParticleImg
  src.loadPixels()

  let minX=src.width
  let minY=src.height
  let maxX=-1
  let maxY=-1

  for(let y=0;y<src.height;y++){
    for(let x=0;x<src.width;x++){
      let i=(y*src.width+x)*4
      let r=src.pixels[i]
      let g=src.pixels[i+1]
      let b=src.pixels[i+2]
      // Treat near-white background as empty.
      if(!(r>235 && g>235 && b>235)){
        if(x<minX) minX=x
        if(y<minY) minY=y
        if(x>maxX) maxX=x
        if(y>maxY) maxY=y
      }
    }
  }

  if(maxX<0 || maxY<0){
    cheeseParticleSprite=src
    return
  }

  cheeseParticleSprite=src.get(minX,minY,maxX-minX+1,maxY-minY+1)
  cheeseParticleSprite.loadPixels()
  for(let y=0;y<cheeseParticleSprite.height;y++){
    for(let x=0;x<cheeseParticleSprite.width;x++){
      let i=(y*cheeseParticleSprite.width+x)*4
      let r=cheeseParticleSprite.pixels[i]
      let g=cheeseParticleSprite.pixels[i+1]
      let b=cheeseParticleSprite.pixels[i+2]
      if(r>235 && g>235 && b>235){
        cheeseParticleSprite.pixels[i+3]=0
      }
    }
  }
  cheeseParticleSprite.updatePixels()
}

function startBtnHover(){
  let btnW=220
  let btnH=68
  let btnX=width/2
  let btnY=height/2+90
  return mouseX>btnX-btnW/2 && mouseX<btnX+btnW/2 &&
         mouseY>btnY-btnH/2 && mouseY<btnY+btnH/2;
}

function drawStartButton(alpha){
  let btnW=220
  let btnH=68
  let btnX=width/2
  let btnY=height/2+90
  push()
  rectMode(CENTER)
  if(startBtnHover()) fill(26,170,71,alpha); else fill(30,191,84,alpha)
  noStroke()
  rect(btnX,btnY,btnW,btnH,12)
  fill(255,alpha)
  textAlign(CENTER,CENTER)
  textStyle(BOLD)
  textSize(26)
  stroke(0,alpha)
  strokeWeight(3)
  text("TRY NOW!",btnX,btnY-8)
  noStroke()
  pop()
}

function getOpaqueBounds(img){
  img.loadPixels()
  let minX=img.width
  let minY=img.height
  let maxX=-1
  let maxY=-1

  for(let y=0;y<img.height;y++){
    for(let x=0;x<img.width;x++){
      let i=(y*img.width+x)*4
      let alpha=img.pixels[i+3]
      if(alpha>5){
        if(x<minX) minX=x
        if(y<minY) minY=y
        if(x>maxX) maxX=x
        if(y>maxY) maxY=y
      }
    }
  }

  if(maxX<0 || maxY<0){
    return {x:0,y:0,w:img.width,h:img.height}
  }

  return {
    x:minX,
    y:minY,
    w:maxX-minX+1,
    h:maxY-minY+1
  }
}

function drawTray(alpha){
  for(let t of tray) t.show(alpha)
}

function drawTrayHoverLabels(alpha){
  if(alpha<=0) return
  for(let t of tray) t.showHoverLabel(alpha)
}

function recipeText(){
  let needs=[]
  for(let k in recipe){
    if(k!="id" && k!="name") needs.push(recipe[k]+" "+toppingDisplayName(k))
  }

  if(needs.length===0) return "You'll need:"
  if(needs.length===1) return "You'll need: "+needs[0]
  if(needs.length===2) return "You'll need: "+needs[0]+" and "+needs[1]
  return "You'll need: "+needs.slice(0,needs.length-1).join(", ")+" and "+needs[needs.length-1]
}

function toppingDisplayName(key){
  return TOPPING_LABELS[key] || key.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/\b\w/g,function(letter){
    return letter.toUpperCase()
  })
}

function distancePointToSegment(px,py,x1,y1,x2,y2){
  let dx=x2-x1
  let dy=y2-y1
  let lenSq=dx*dx+dy*dy
  if(lenSq===0) return dist(px,py,x1,y1)
  let t=((px-x1)*dx+(py-y1)*dy)/lenSq
  t=constrain(t,0,1)
  let cx=x1+t*dx
  let cy=y1+t*dy
  return dist(px,py,cx,cy)
}

function maxOverallStarsFromTime(seconds){
  if(seconds<46) return 5
  if(seconds<51) return 4
  if(seconds<61) return 3
  if(seconds<71) return 2
  return 1
}

function calculatePresentationStars(){
  let points=[]
  for(let t of toppings){
    if(t.onPizza && !t.fading && pointOnSauceOpaqueArea(t.x,t.y)){
      points.push({x:t.x,y:t.y})
    }
  }

  let n=points.length
  if(n===0) return 0
  if(n===1) return 1

  let bins=8
  let counts=[]
  for(let i=0;i<bins;i++) counts.push(0)

  for(let p of points){
    let a=atan2(p.y-pizzaY,p.x-pizzaX)
    if(a<0) a+=TWO_PI
    let idx=floor((a/TWO_PI)*bins)
    idx=constrain(idx,0,bins-1)
    counts[idx]++
  }

  let expected=n/bins
  let deviation=0
  for(let c of counts) deviation+=abs(c-expected)
  let maxDeviation=2*n*(1-1/bins)
  let angularBalance=1-constrain(deviation/maxDeviation,0,1)

  let nearestDistances=[]
  for(let i=0;i<n;i++){
    let best=Infinity
    for(let j=0;j<n;j++){
      if(i===j) continue
      let d=dist(points[i].x,points[i].y,points[j].x,points[j].y)
      if(d<best) best=d
    }
    if(best<Infinity) nearestDistances.push(best)
  }

  let avgNearest=0
  for(let d of nearestDistances) avgNearest+=d
  avgNearest/=max(1,nearestDistances.length)

  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  let areaEstimate=PI*(pizzaW*0.5)*(pizzaH*0.5)
  let idealNearest=sqrt(areaEstimate/n)
  let spacingScore=constrain(avgNearest/(idealNearest*0.95),0,1)

  let quality=0.55*spacingScore+0.45*angularBalance
  return constrain(round(quality*5),0,5)
}

function calculateSlicingStars(){
  if(slices.length===0) return 0

  let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
  let pizzaH=maxSize*pizzaRenderScale
  let left=pizzaX-pizzaW/2
  let top=pizzaY-pizzaH/2
  let step=8

  let cells={}
  let keys=[]

  for(let y=top;y<=top+pizzaH;y+=step){
    for(let x=left;x<=left+pizzaW;x+=step){
      if(!pointOnCookedOpaqueArea(x,y)) continue

      let cut=false
      for(let s of slices){
        if(distancePointToSegment(x,y,s.x1,s.y1,s.x2,s.y2)<=sliceCutWidth*0.5){
          cut=true
          break
        }
      }
      if(cut) continue

      let gx=floor((x-left)/step)
      let gy=floor((y-top)/step)
      let key=gx+","+gy
      cells[key]=1
      keys.push(key)
    }
  }

  if(keys.length===0) return 0

  let visited={}
  let components=[]
  let dirs=[[1,0],[-1,0],[0,1],[0,-1]]

  for(let key of keys){
    if(visited[key]) continue
    let stack=[key]
    visited[key]=1
    let size=0

    while(stack.length>0){
      let cur=stack.pop()
      size++
      let parts=cur.split(",")
      let cx=parseInt(parts[0])
      let cy=parseInt(parts[1])

      for(let d of dirs){
        let nx=cx+d[0]
        let ny=cy+d[1]
        let nkey=nx+","+ny
        if(cells[nkey] && !visited[nkey]){
          visited[nkey]=1
          stack.push(nkey)
        }
      }
    }
    components.push(size)
  }

  let total=0
  for(let c of components) total+=c
  let filtered=[]
  for(let c of components){
    if(c>=total*0.02) filtered.push(c)
  }
  if(filtered.length===0) filtered=components.slice()

  filtered.sort(function(a,b){ return b-a })
  let segmentCount=filtered.length
  let target=slicesNeeded
  let countScore=1-constrain(abs(segmentCount-target)/target,0,1)

  let areas=filtered.slice(0,min(target,filtered.length))
  let mean=0
  for(let a of areas) mean+=a
  mean/=max(1,areas.length)

  let variance=0
  for(let a of areas) variance+=(a-mean)*(a-mean)
  variance/=max(1,areas.length)
  let std=sqrt(variance)
  let cv=(mean>0)?std/mean:1
  let evennessScore=1-constrain(cv/0.6,0,1)

  let quality=0.6*countScore+0.4*evennessScore
  return constrain(round(quality*5),0,5)
}

function calculateScore(){
  presentationStars=calculatePresentationStars()
  slicingStars=calculateSlicingStars()
  let timeStars=maxOverallStarsFromTime(stopwatchElapsedMs/1000)

  let avgStars=(presentationStars+slicingStars+timeStars)/3
  overallStars=constrain(round(avgStars),0,5)
}

function drawStars(x,y,n,total){
  let filled=constrain(round(n),0,total)
  for(let i=0;i<total;i++){
    push()
    translate(x+i*40,y)
    if(i<filled){
      fill(255,220,0)
      stroke(200,160,0)
    } else {
      fill(235)
      stroke(170)
    }
    star(0,0,10,20,5)
    pop()
  }
}

function star(x,y,r1,r2,n){
  beginShape()
  for(let i=0;i<n*2;i++){
    let a=i*PI/n
    let r=i%2?r1:r2
    vertex(cos(a)*r,sin(a)*r)
  }
  endShape(CLOSE)
}

class Topping{
  constructor(type,x,y){
    this.type=type; this.x=x; this.y=y; this.size=248; this.dragging=false;
    this.correct=false;
    this.onPizza=false;
    this.fading=false;
    this.fadeStart=0;
    this.fadeDuration=1000;
    this.alpha=255;
  }
  hover(){ return dist(mouseX,mouseY,this.x,this.y)<this.size/2 }
  update(){
    if(this.dragging){ this.x=mouseX; this.y=mouseY }
    if(this.fading){
      let t=millis()-this.fadeStart;
      this.alpha=map(t,0,this.fadeDuration,255,0);
      if(t>this.fadeDuration){
        let idx=toppings.indexOf(this);
        if(idx>-1) toppings.splice(idx,1);
      }
    }
  }
  show(){
    if(this.dragging){
      let glowSize=(this.size+20)*0.5;
      noStroke();
      if(this.correct) fill(0,255,0,100);
      else fill(255,0,0,100);
      ellipse(this.x,this.y,glowSize,glowSize);
    }
    if(this.fading) tint(255,this.alpha);
    image(toppingImgs[this.type],this.x,this.y,this.size,this.size);
    if(this.fading) noTint();
  }
  showFade(alpha){ tint(255,alpha); image(toppingImgs[this.type],this.x,this.y,this.size,this.size); noTint() }
}

class TrayItem{
  constructor(type,x,y){
    this.type=type
    this.x=x
    this.y=y
    this.size=120
    this.completed=false
    this.completeAnimStart=-1
    this.wrongAnimStart=-1
    this.wrongAnimMs=420
  }
  hover(){ return dist(mouseX,mouseY,this.x,this.y)<this.size/2 }
  setCompleted(isCompleted){
    if(isCompleted && !this.completed){
      this.completed=true
      this.completeAnimStart=millis()
    } else if(!isCompleted && this.completed){
      this.completed=false
      this.completeAnimStart=-1
    }
  }
  tickScale(){
    if(!this.completed) return 0
    if(this.completeAnimStart<0) return 1.05
    let t=millis()-this.completeAnimStart
    if(t<=180) return map(t,0,180,0,1.25)
    if(t<=360) return map(t,180,360,1.25,1.05)
    return 1.05
  }
  triggerWrongDrop(){
    this.wrongAnimStart=millis()
  }
  wrongAnimProgress(){
    if(this.wrongAnimStart<0) return -1
    let t=millis()-this.wrongAnimStart
    if(t>this.wrongAnimMs){
      this.wrongAnimStart=-1
      return -1
    }
    return t
  }
  crossScale(t){
    if(t<0) return 0
    if(t<=170) return map(t,0,170,0,1.25)
    if(t<=340) return map(t,170,340,1.25,1.03)
    return map(t,340,this.wrongAnimMs,1.03,1)
  }
  drawWrongCross(alpha){
    let t=this.wrongAnimProgress()
    if(t<0 || alpha<=0) return
    let s=this.crossScale(t)
    let a=min(alpha,map(t,0,this.wrongAnimMs,255,185))
    push()
    translate(this.x,this.y)
    scale(s)
    noStroke()
    fill(255,255,255,min(a,220))
    ellipse(0,0,this.size*0.86,this.size*0.86)
    stroke(200,45,45,a)
    strokeWeight(10)
    strokeCap(ROUND)
    line(-18,-18,18,18)
    line(18,-18,-18,18)
    pop()
  }
  drawCompletionTick(alpha){
    if(!this.completed || alpha<=0) return
    let s=this.tickScale()
    push()
    translate(this.x,this.y)
    scale(s)
    noStroke()
    fill(255,255,255,min(alpha,220))
    ellipse(0,0,this.size*0.86,this.size*0.86)
    stroke(34,160,70,alpha)
    strokeWeight(12)
    strokeCap(ROUND)
    line(-22,2,-4,22)
    line(-4,22,30,-16)
    pop()
  }
  show(alpha){
    let drawSize=this.size;
    if(this.hover()){
      noStroke();
      fill(255,255,255,min(alpha,120));
      ellipse(this.x,this.y,drawSize+20,drawSize+20);
    }
    let b=bowlBounds[this.type]
    tint(255,alpha)
    image(bowlImgs[this.type],this.x,this.y,drawSize,drawSize,b.x,b.y,b.w,b.h);
    noTint()
    this.drawWrongCross(alpha)
    this.drawCompletionTick(alpha)
  }
  showHoverLabel(alpha){
    if(this.hover()){
      let drawSize=this.size
      let isCorrect = recipe.hasOwnProperty(this.type) && recipe[this.type] > 0
      let outlineCol = isCorrect ? color(34,160,70,alpha) : color(200,45,45,alpha)
      stroke(outlineCol);
      strokeWeight(4);
      fill(255,alpha);
      textAlign(CENTER,TOP);
      textSize(14);
      textStyle(BOLD);
      text(TOPPING_LABELS[this.type],this.x,this.y+drawSize/2+10);
      noStroke();
      textStyle(NORMAL);
    }
  }
}

class CheeseParticle{
  constructor(x,y){
    this.x=x+random(-12,12)
    this.y=y+random(-12,12)
    let a=random(TWO_PI)
    let speed=random(0.8,2.6)
    this.vx=cos(a)*speed*0.6
    this.vy=sin(a)*speed*0.6+random(-0.6,0.2)
    this.size=random(10,18)
    this.life=255
  }
  update(){
    this.x+=this.vx
    this.y+=this.vy
    this.vy+=0.03
    this.life-=10
  }
  show(){
    push()
    imageMode(CENTER)
    if(cheeseParticleSprite){
      tint(255,this.life)
      image(cheeseParticleSprite,this.x,this.y,this.size,this.size)
      noTint()
    } else {
      fill(255,240,120,this.life)
      noStroke()
      ellipse(this.x,this.y,this.size,this.size)
    }
    pop()
  }
  isDead(){ return this.life<=0 }
}

class FlourParticle{
  constructor(){
    this.x=random(width)
    this.y=random(-140,0)
    this.v=random(3,8)
    this.size=random(4,9)
  }
  update(){
    this.y+=this.v
    if(this.y>height){
      this.y=height
      this.v=0
    }
  }
  show(alpha){
    noStroke()
    fill(255,min(alpha+40,255))
    ellipse(this.x,this.y,this.size,this.size)
  }
}

class Steam{ constructor(){
    let pizzaW=maxSize*pizzaWidthScale*pizzaRenderScale
    let pizzaH=maxSize*pizzaRenderScale
    let left=pizzaX-pizzaW/2
    let top=pizzaY-pizzaH/2
    
    // Find valid position on opaque pizza area
    let found=false
    let attempts=0
    while(!found && attempts<10){
      this.x=random(left,left+pizzaW)
      this.y=random(top,top+pizzaH)
      if(pointOnUncookedOpaqueArea(this.x,this.y)){
        found=true
      }
      attempts++
    }
    
    if(!found){
      this.x=pizzaX
      this.y=pizzaY
    }
    
    this.vx=random(-0.5,0.5)
    this.vy=random(-1.5,-0.5)
    this.alpha=150
    this.age=0
  }
  update(){
    this.x+=this.vx
    this.y+=this.vy
    this.alpha*=0.98
    this.age++
  }
  isDead(){
    return this.alpha<5
  }
  show(){
    push()
    noStroke()
    fill(200,200,200,this.alpha)
    // Draw cloud shape with overlapping circles
    circle(this.x-12,this.y,16)
    circle(this.x,this.y-8,20)
    circle(this.x+12,this.y,16)
    circle(this.x-8,this.y+6,14)
    circle(this.x+8,this.y+6,14)
    pop()
  }
}

class Confetti{ constructor(){ this.x=random(width); this.y=random(-100,0); this.v=random(2,5); this.size=random(3,5); this.col=random(['red','green','white']) }
  update(){ this.y+=this.v }
  show(){ fill(this.col); noStroke(); rect(this.x,this.y,this.size,this.size) }
}

function spawnConfetti(){ for(let i=0;i<600;i++) confetti.push(new Confetti()) }

class Button{
  constructor(x,y,label,color){ this.x=x; this.y=y; this.w=120; this.h=45; this.label=label; this.color=color }
  hover(){
    return mouseX>this.x && mouseX<this.x+this.w &&
           mouseY>this.y && mouseY<this.y+this.h;
  }
  show(){
    if(this.hover()) fill(255,255,255,70); else fill(220);
    rect(this.x,this.y,this.w,this.h,10);
    fill(0);
    textStyle(NORMAL);
    textAlign(CENTER,CENTER);
    textSize(14);
    stroke(255);
    strokeWeight(3);
    text(this.label,this.x+this.w/2,this.y+this.h/2)
    noStroke();
  }
}

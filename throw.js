let marbleX = 0;
let marbleY = 0;
let t = 0;
let isMarbleMoving = true;
let isMarbleVisible = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(210, 195, 160); // 바탕

  drawWarehouse();

  if (isMarbleMoving && isMarbleVisible) {
    // 포물선 경로 계산 (굴뚝 안으로 들어가도록 조정)
    let startX = 0;
    let startY = 0;
    let cp1X = width * 0.05;   // 굴뚝 위치 기준으로 가까이
    let cp1Y = height * 0.05;
    let cp2X = width * 0.1;
    let cp2Y = height * 0.1;
    let endX = width / 2 - 230;   // 굴뚝 중심 x 위치와 맞춤
    let endY = height / 2 - 135 - 60; // 굴뚝 안쪽 y 위치

    marbleX = bezierPoint(startX, cp1X, cp2X, endX, t);
    marbleY = bezierPoint(startY, cp1Y, cp2Y, endY, t);

    drawMarble(marbleX, marbleY, 30);

    t += 0.01;
    if (t >= 1) {
      isMarbleMoving = false;
      isMarbleVisible = false; // 도착 후 사라지게
    }
  }
}

function drawWarehouse() {
  push();
  translate(width / 2, height / 2);
  rectMode(CENTER);
  
  noStroke();
  for (let i = 0; i < 150; i++) {
    let px = random(-285, 285);
    let py = random(-150, 150);
    fill(50 + random(-10, 10), 50 + random(-10, 10), 50 + random(-10, 10), 100);
    ellipse(px, py, random(2, 6));
  }

  // 본체
  fill(100);
  stroke(60);
  strokeWeight(1.5);
  rect(0, 75, 600, 375, 3);

  // 문
  fill(80);
  stroke(40);
  rect(0, 150, 180, 210);

  // 손잡이
  noStroke();
  fill(30);
  ellipse(45, 150, 15, 15);
  pop();

  // 지붕 + 굴뚝
  push();
  translate(width / 2, height / 2 - 135);
  fill(70);
  stroke(40);
  rectMode(CENTER);
  rect(0, 0, 660, 45); // 지붕

  // 굴뚝
  let chimneyW = 50;
  let chimneyH = 120;
  let chimneyX = -230; // 지붕 기준 왼쪽

  fill(90);
  stroke(50);
  strokeWeight(1.5);
  rect(chimneyX, -chimneyH / 2 - 10, chimneyW, chimneyH, 5); // 굴뚝 본체

  fill(60);
  rect(chimneyX, -chimneyH - 20, chimneyW + 20, 20, 3); // 굴뚝 입구

  pop();
}

function drawMarble(x, y, r) {
  push();
  translate(x, y);

  // 구슬 그라데이션 효과
  let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, r);
  gradient.addColorStop(0, 'rgba(200, 200, 200, 1)');
  gradient.addColorStop(0.5, 'rgba(150, 150, 150, 1)');
  gradient.addColorStop(1, 'rgba(100, 100, 100, 1)');

  drawingContext.fillStyle = gradient;
  noStroke();
  ellipse(0, 0, r * 2);

  // 하이라이트 효과
  fill(255, 255, 255, 50);
  ellipse(-r/3, -r/3, r/2);

  pop();
}

function mousePressed() {
  let handleX = width / 2 + 45;
  let handleY = height / 2 + 150;
  if (dist(mouseX, mouseY, handleX, handleY) < 15) {
    window.location.replace('open.html');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

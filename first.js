let faceX, faceY;
let hairColor;
let eyeColor;
let skinColor;

let marbles = [];
let isRolling = false;
let pastelColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5']; // 파스텔 빨강, 파랑, 노랑 순서
let startButton;
let spawnInterval = 1000; // 구슬 생성 간격
let lastSpawnTime = 0;
let marbleCount = 0;
let maxMarbles = 6;

// 구슬 순서 정의 (0: 빨강, 1: 파랑, 2: 노랑)
let marbleOrder = [0, 2, 1, 0, 1, 2]; // 빨강-노랑-파랑-빨강-파랑-노랑

let slopeStart, slopeEnd;
let floorY;
let slots = [];
let filledSlots = 0;

// 확대 애니메이션을 위한 변수들
let isEnlarging = false;
let enlargedMarble = null;
let enlargeProgress = 0;
let enlargeDuration = 60; // 프레임 단위로 애니메이션 지속 시간
let isAllMarblesStopped = false; // 모든 구슬이 멈췄는지 확인

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // 대각선 발판 설정 (화면 크기에 맞게 조정)
  slopeStart = createVector(windowWidth * 0.1, windowHeight * 0.2);
  slopeEnd = createVector(windowWidth * 0.7, windowHeight * 0.8);
  floorY = slopeEnd.y + 20;

  // 슬롯 좌표 미리 계산 (화면 크기에 맞게 조정)
  for (let i = 0; i < maxMarbles; i++) {
    let spacing = windowWidth * 0.07;
    let x = slopeEnd.x - (maxMarbles - 1 - i) * spacing;
    let y = floorY - 20;
    slots.push({ 
      x, 
      y, 
      filled: false,
      stackHeight: 0,
      marbles: []
    });
  }

  startButton = createButton('Start');
  startButton.position(windowWidth / 2 - 30, windowHeight / 2);
  startButton.mousePressed(() => {
    startButton.hide();
    RollInMarbles();
  });

  // 캐릭터 위치 설정
  faceX = width/2;
  faceY = height/2;
  
  // 색상 설정
  hairColor = color(139, 69, 19); // 갈색 머리
  eyeColor = color(0); // 검은 눈
  skinColor = color(255, 218, 185); // 피부색
}

function draw() {
  background(245);
  
  // 배경 그라데이션
  drawBackground();

  // 대각선 발판 그리기
  drawSlope();

  // 바구니 그리기
  drawBasket();

  // 구슬 그리기
  for (let marble of marbles) {
    if (!marble.stopped) {
      // 구슬 이동 및 회전
      marble.x += marble.vx;
      marble.y += marble.vy;
      marble.rotation += marble.vx * 2;

      // 바구니 안에 닿으면 슬롯에 넣기
      if (marble.y >= floorY - marble.r / 2) {
        let slot = findNextAvailableSlot();
        if (slot) {
          // 구슬을 슬롯에 추가
          slot.marbles.push(marble);
          slot.stackHeight += marble.r * 0.8;
          
          // 구슬 위치 조정 (바구니 안쪽으로)
          marble.x = slot.x;
          marble.y = floorY - slot.stackHeight - 10;
          marble.vx = 0;
          marble.vy = 0;
          marble.stopped = true;
          slot.filled = true;
          filledSlots++;

          // 모든 구슬이 멈췄는지 확인
          if (filledSlots >= maxMarbles && !isAllMarblesStopped) {
            isAllMarblesStopped = true;
            // 첫 번째 빨간 구슬 찾기
            let firstRedMarble = findFirstRedMarble();
            if (firstRedMarble) {
              isEnlarging = true;
              enlargedMarble = {...firstRedMarble};
              enlargeProgress = 0;
              // 첫 번째 빨간 구슬 제거
              removeMarble(firstRedMarble);
            }
          }
        }
      }
    }

    // 구슬 그리기
    drawMarble(marble);
  }

  // 확대된 구슬 그리기
  if (isEnlarging && enlargedMarble) {
    drawEnlargedMarble();
  }

  // 구슬 계속 굴리기
  if (isRolling) {
    if (millis() - lastSpawnTime > spawnInterval && marbleCount < maxMarbles) {
      spawnMarble();
      lastSpawnTime = millis();
    }
  }

  // 모든 구슬이 멈췄고 확대 애니메이션이 완료되면 문구 표시
  if (isAllMarblesStopped && !isEnlarging) {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text("문 손잡이를 눌러 문을 열어주세요", width/2, height/2 + 150);
  }
}

function drawFace() {
  // 얼굴 본체
  fill(skinColor);
  noStroke();
  ellipse(faceX, faceY, 200, 250);
}

function drawHair() {
  // 머리카락
  fill(hairColor);
  noStroke();
  
  // 머리카락 본체
  beginShape();
  vertex(faceX - 100, faceY - 125);
  vertex(faceX + 100, faceY - 125);
  vertex(faceX + 120, faceY - 50);
  vertex(faceX + 110, faceY + 50);
  vertex(faceX + 90, faceY + 100);
  vertex(faceX + 50, faceY + 125);
  vertex(faceX - 50, faceY + 125);
  vertex(faceX - 90, faceY + 100);
  vertex(faceX - 110, faceY + 50);
  vertex(faceX - 120, faceY - 50);
  endShape(CLOSE);
  
  // 앞머리
  beginShape();
  vertex(faceX - 80, faceY - 125);
  vertex(faceX + 80, faceY - 125);
  vertex(faceX + 60, faceY - 75);
  vertex(faceX + 40, faceY - 50);
  vertex(faceX, faceY - 40);
  vertex(faceX - 40, faceY - 50);
  vertex(faceX - 60, faceY - 75);
  endShape(CLOSE);
}

function drawEyes() {
  // 왼쪽 눈
  fill(255);
  ellipse(faceX - 40, faceY - 20, 40, 25);
  
  // 오른쪽 눈
  ellipse(faceX + 40, faceY - 20, 40, 25);
  
  // 왼쪽 눈동자
  fill(eyeColor);
  ellipse(faceX - 40, faceY - 20, 20, 20);
  
  // 오른쪽 눈동자
  ellipse(faceX + 40, faceY - 20, 20, 20);
  
  // 왼쪽 눈 하이라이트
  fill(255);
  ellipse(faceX - 45, faceY - 25, 10, 10);
  
  // 오른쪽 눈 하이라이트
  ellipse(faceX + 35, faceY - 25, 10, 10);
}

function drawNose() {
  // 코
  stroke(0);
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(faceX, faceY - 10);
  vertex(faceX, faceY + 20);
  endShape();
  
  // 콧볼
  noStroke();
  fill(255, 200, 200);
  ellipse(faceX - 5, faceY + 20, 10, 5);
  ellipse(faceX + 5, faceY + 20, 10, 5);
}

function drawMouth() {
  // 입
  noFill();
  stroke(0);
  strokeWeight(2);
  arc(faceX, faceY + 40, 60, 30, 0, PI);
}

function drawEyebrows() {
  // 왼쪽 눈썹
  noFill();
  stroke(0);
  strokeWeight(2);
  arc(faceX - 40, faceY - 40, 40, 20, PI, 0);
  
  // 오른쪽 눈썹
  arc(faceX + 40, faceY - 40, 40, 20, PI, 0);
}

function drawBackground() {
  // 배경 그라데이션
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 255), color(240, 240, 245), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawSlope() {
  // 대각선 발판 그림자
  stroke(160);
  strokeWeight(12);
  line(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
  
  // 대각선 발판 본체
  stroke(180);
  strokeWeight(8);
  line(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
  
  // 발판 하이라이트
  stroke(200);
  strokeWeight(4);
  line(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
}

function drawBasket() {
  // 바구니 크기를 화면 크기에 맞게 조정
  let basketWidth = windowWidth * 0.4;
  let basketHeight = windowHeight * 0.2;
  
  // 바구니 배경
  noStroke();
  fill(220, 220, 220, 100);
  rect(slopeEnd.x - basketWidth/2, floorY - basketHeight, basketWidth, basketHeight);

  // 바구니 테두리
  stroke(180);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(slopeEnd.x - basketWidth/2, floorY - basketHeight);
  vertex(slopeEnd.x + basketWidth/2, floorY - basketHeight);
  vertex(slopeEnd.x + basketWidth/2, floorY);
  vertex(slopeEnd.x - basketWidth/2, floorY);
  endShape(CLOSE);

  // 바구니 패턴
  stroke(160);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let y = floorY - basketHeight + i * (basketHeight/5);
    line(slopeEnd.x - basketWidth/2, y, slopeEnd.x + basketWidth/2, y);
  }
  for (let i = 0; i < 8; i++) {
    let x = slopeEnd.x - basketWidth/2 + i * (basketWidth/8);
    line(x, floorY - basketHeight, x, floorY);
  }

  // 바구니 그림자
  noStroke();
  fill(0, 0, 0, 20);
  rect(slopeEnd.x - basketWidth/2, floorY, basketWidth, 10);
}

function drawMarble(marble) {
  push();
  translate(marble.x, marble.y);
  rotate(marble.rotation);
  
  // 구슬 그림자
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(2, 2, marble.r, marble.r);
  
  // 구슬 본체
  fill(marble.color);
  ellipse(0, 0, marble.r, marble.r);
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-marble.r/4, -marble.r/4, marble.r/3, marble.r/3);
  
  pop();
}

function drawEnlargedMarble() {
  push();
  
  // 중앙으로 이동하는 애니메이션
  let targetX = width/2;
  let targetY = height/2;
  let currentX = map(enlargeProgress, 0, enlargeDuration, enlargedMarble.x, targetX);
  let currentY = map(enlargeProgress, 0, enlargeDuration, enlargedMarble.y, targetY);
  
  translate(currentX, currentY);
  
  // 확대 애니메이션 (8배로 확대)
  let scaleAmount = map(enlargeProgress, 0, enlargeDuration, 1, 8);
  scale(scaleAmount);
  
  // 구슬 그림자
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(2, 2, enlargedMarble.r, enlargedMarble.r);
  
  // 구슬 본체
  fill(enlargedMarble.color);
  ellipse(0, 0, enlargedMarble.r, enlargedMarble.r);
  
  // 구슬 하이라이트
  fill(255, 255, 255, 100);
  ellipse(-enlargedMarble.r/4, -enlargedMarble.r/4, enlargedMarble.r/3, enlargedMarble.r/3);
  
  pop();
  
  // 애니메이션이 완료되면 텍스트 표시
  if (enlargeProgress >= enlargeDuration) {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text("추억을 보려면 구슬을 누르세요", width/2, height/2 + 100);
  }
  
  // 애니메이션 진행
  if (enlargeProgress < enlargeDuration) {
    enlargeProgress++;
  }
}

function mousePressed() {
  // 확대된 구슬이 있고 애니메이션이 완료된 경우에만 클릭 감지
  if (isEnlarging && enlargedMarble && enlargeProgress >= enlargeDuration) {
    // 마우스 위치가 확대된 구슬 안에 있는지 확인
    let targetX = width/2;
    let targetY = height/2;
    let scaleAmount = 8; // 최종 확대 크기
    let radius = enlargedMarble.r * scaleAmount;
    
    // 마우스와 구슬 중심 사이의 거리 계산
    let d = dist(mouseX, mouseY, targetX, targetY);
    
    // 마우스가 구슬 안에 있는지 확인
    if (d < radius/2) {
      // red.html로 이동
      window.location.href = 'red.html';
    }
  }
}

function RollInMarbles() {
  if (marbleCount < maxMarbles) {
    isRolling = true;
    lastSpawnTime = millis();
  }
}

function spawnMarble() {
  let startX = slopeStart.x - 50;
  let startY = slopeStart.y - 50;
  let angle = atan2(slopeEnd.y - slopeStart.y, slopeEnd.x - slopeStart.x);
  let speed = 5;

  // 지정된 순서대로 색상 지정
  let colorIndex = marbleOrder[marbleCount];
  let color = pastelColors[colorIndex];

  marbles.push({
    x: startX,
    y: startY,
    vx: cos(angle) * speed,
    vy: sin(angle) * speed,
    r: 40,
    color: color,
    rotation: random(0, 360),
    stopped: false
  });

  marbleCount++;
}

function findNextAvailableSlot() {
  for (let i = 0; i < slots.length; i++) {
    if (!slots[i].filled) return slots[i];
  }
  return null;
}

// 첫 번째 빨간 구슬 찾기
function findFirstRedMarble() {
  // 슬롯을 순서대로 검사
  for (let slot of slots) {
    // 각 슬롯의 구슬들을 순서대로 검사
    for (let marble of slot.marbles) {
      // 첫 번째로 발견되는 빨간 구슬 반환
      if (marble.color === pastelColors[0]) {
        return marble;
      }
    }
  }
  return null;
}

// 구슬 제거 함수
function removeMarble(marbleToRemove) {
  // marbles 배열에서 제거
  marbles = marbles.filter(m => m !== marbleToRemove);
  
  // 슬롯에서도 제거
  for (let slot of slots) {
    slot.marbles = slot.marbles.filter(m => m !== marbleToRemove);
    if (slot.marbles.length === 0) {
      slot.filled = false;
      slot.stackHeight = 0;
    }
  }
  
  // 남은 구슬들의 위치 재조정
  for (let slot of slots) {
    if (slot.marbles.length > 0) {
      let newStackHeight = 0;
      for (let marble of slot.marbles) {
        marble.y = floorY - newStackHeight - 10;
        newStackHeight += marble.r * 0.8;
      }
      slot.stackHeight = newStackHeight;
    }
  }
  
  filledSlots--;
}

// 창 크기가 변경될 때 캔버스 크기도 조정
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 대각선 발판 위치 재조정
  slopeStart = createVector(windowWidth * 0.1, windowHeight * 0.2);
  slopeEnd = createVector(windowWidth * 0.7, windowHeight * 0.8);
  floorY = slopeEnd.y + 20;

  // 슬롯 위치 재조정
  for (let i = 0; i < slots.length; i++) {
    let spacing = windowWidth * 0.07;
    slots[i].x = slopeEnd.x - (maxMarbles - 1 - i) * spacing;
    slots[i].y = floorY - 20;
  }
} 
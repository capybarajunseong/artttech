let isHovering = false;
let buttonScale = 1;
let cursorScale = 1;
let cursorRotation = 0;
let buttonX, buttonY, buttonWidth, buttonHeight;
let buttonDepth = 5; // 버튼의 두께
let cursorAngle = 0;
let cursorDistance = 0;
let isClicking = false;
let clickProgress = 0;

function setup() {
  createCanvas(800, 600);
  
  // 버튼 위치와 크기 설정
  buttonWidth = 100;
  buttonHeight = 50;
  buttonX = width/2 - buttonWidth/2;
  buttonY = height/2 - buttonHeight/2;
}

function draw() {
  background(240);
  
  // 마우스가 버튼 위에 있는지 확인
  isHovering = mouseX > buttonX && mouseX < buttonX + buttonWidth &&
               mouseY > buttonY && mouseY < buttonY + buttonHeight;
  
  // SKIP 버튼 그리기
  push();
  translate(width/2, height/2);
  scale(buttonScale);
  
  // 버튼 받침대 그리기
  noStroke();
  // 받침대 그림자
  fill(100);
  rect(-buttonWidth/2 - 10, buttonHeight/2 + 5, buttonWidth + 20, 15, 3);
  // 받침대 본체
  fill(150);
  rect(-buttonWidth/2 - 10, buttonHeight/2 + 5, buttonWidth + 20, 10, 3);
  // 받침대 하이라이트
  fill(180);
  rect(-buttonWidth/2 - 10, buttonHeight/2 + 5, buttonWidth + 20, 3, 3);
  
  // 버튼 그림자
  fill(150, 0, 0);
  rect(-buttonWidth/2 + 3, -buttonHeight/2 + 3, buttonWidth, buttonHeight, 2);
  
  // 버튼 본체
  noStroke();
  fill(200, 0, 0);
  rect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 2);
  
  // 버튼 상단 하이라이트
  fill(255, 50, 50);
  beginShape();
  vertex(-buttonWidth/2, -buttonHeight/2);
  vertex(buttonWidth/2, -buttonHeight/2);
  vertex(buttonWidth/2 - 3, -buttonHeight/2 + 3);
  vertex(-buttonWidth/2 + 3, -buttonHeight/2 + 3);
  endShape(CLOSE);
  
  // 버튼 왼쪽 하이라이트
  fill(255, 50, 50);
  beginShape();
  vertex(-buttonWidth/2, -buttonHeight/2);
  vertex(-buttonWidth/2 + 3, -buttonHeight/2 + 3);
  vertex(-buttonWidth/2 + 3, buttonHeight/2 - 3);
  vertex(-buttonWidth/2, buttonHeight/2);
  endShape(CLOSE);
  
  // 버튼 오른쪽 그림자
  fill(150, 0, 0);
  beginShape();
  vertex(buttonWidth/2, -buttonHeight/2);
  vertex(buttonWidth/2, buttonHeight/2);
  vertex(buttonWidth/2 - 3, buttonHeight/2 - 3);
  vertex(buttonWidth/2 - 3, -buttonHeight/2 + 3);
  endShape(CLOSE);
  
  // 버튼 하단 그림자
  fill(150, 0, 0);
  beginShape();
  vertex(-buttonWidth/2, buttonHeight/2);
  vertex(buttonWidth/2, buttonHeight/2);
  vertex(buttonWidth/2 - 3, buttonHeight/2 - 3);
  vertex(-buttonWidth/2 + 3, buttonHeight/2 - 3);
  endShape(CLOSE);
  
  // 버튼 텍스트
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text('SKIP', 0, 0);
  
  // 호버링 효과 - 버튼이 살짝 올라오는 효과
  if (isHovering) {
    translate(0, -3);
  }
  
  pop();
  
  // 커서 위치 계산
  let targetX = mouseX;
  let targetY = mouseY;
  let buttonCenterX = width/2;
  let buttonCenterY = height/2;
  
  // 버튼과의 거리에 따른 커서의 위치 조정
  if (isHovering) {
    cursorDistance = lerp(cursorDistance, 20, 0.1);
    cursorAngle = lerp(cursorAngle, atan2(buttonCenterY - targetY, buttonCenterX - targetX), 0.1);
  } else {
    cursorDistance = lerp(cursorDistance, 0, 0.1);
    cursorAngle = lerp(cursorAngle, 0, 0.1);
  }
  
  // 클릭 애니메이션 업데이트
  if (isClicking) {
    clickProgress = lerp(clickProgress, 1, 0.2);
  } else {
    clickProgress = lerp(clickProgress, 0, 0.2);
  }
  
  // 커서 그리기
  drawCursor(targetX, targetY);
}

function drawCursor(x, y) {
  push();
  translate(x, y);
  rotate(cursorAngle);
  
  // 커서 그림자
  push();
  translate(3, 3);
  scale(0.95);
  drawCursorShape(50);
  pop();
  
  // 커서 본체
  drawCursorShape(255);
  
  // 클릭 효과
  if (clickProgress > 0) {
    push();
    translate(0, 10 * clickProgress);
    scale(1 - clickProgress * 0.2);
    drawCursorShape(200);
    pop();
  }
  
  pop();
}

function drawCursorShape(alpha) {
  // 커서 본체
  noStroke();
  fill(50, 50, 50, alpha);
  beginShape();
  vertex(0, 0);
  vertex(15, 15);
  vertex(5, 15);
  vertex(0, 25);
  vertex(-5, 15);
  vertex(-15, 15);
  endShape(CLOSE);
  
  // 커서 하이라이트
  fill(100, 100, 100, alpha);
  beginShape();
  vertex(0, 0);
  vertex(12, 12);
  vertex(4, 12);
  vertex(0, 20);
  vertex(-4, 12);
  vertex(-12, 12);
  endShape(CLOSE);
  
  // 커서 테두리
  stroke(0, 0, 0, alpha);
  strokeWeight(1);
  noFill();
  beginShape();
  vertex(0, 0);
  vertex(15, 15);
  vertex(5, 15);
  vertex(0, 25);
  vertex(-5, 15);
  vertex(-15, 15);
  endShape(CLOSE);
}

function mousePressed() {
  // 버튼 클릭 확인
  if (isHovering) {
    buttonScale = 0.9;
    setTimeout(() => {
      buttonScale = 1;
    }, 100);

    // SKIP 버튼 클릭 시 throw.html로 이동
    window.location.replace('throw.html');
  }
  
  isClicking = true;
  clickProgress = 0;
}

function mouseReleased() {
  isClicking = false;
}

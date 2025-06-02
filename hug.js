let marbles = [];
let marbleColors = ['#FFB3B3', '#A5D8FF', '#FFF5A5', '#FFB3B3', '#A5D8FF'];
let startTime;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  startTime = millis();
  
  // 구슬 위치를 캐릭터 기준으로 아래쪽에 배치
  let centerX = width / 2;
  let centerY = height / 2 + 60;
  let spacing = 70;
  
  for (let i = 0; i < 5; i++) {
    let x = centerX + (i - 2) * spacing;
    let y = centerY + (abs(i - 2) * 10); // 살짝 곡선 배치
    let m = new Marble(x, y);
    m.isGray = false;
    m.color = color(marbleColors[i]);
    marbles.push(m);
  }
}

function draw() {
  background(255, 240, 245);

  drawCharacter();
  
  for (let m of marbles) {
    m.display();
  }

  drawArms();

  // 3초 후 final.html로 이동
  if (millis() - startTime > 3000) {
    window.location.href = 'final.html';
  }
}

function drawCharacter() {
  push();
  translate(width/2, height/2);

  // 얼굴
  fill(255, 220, 200);
  ellipse(0, 0, 120, 120);
  
  // 눈
  fill(80);
  ellipse(-20, -10, 10, 15);
  ellipse(20, -10, 10, 15);
  
  // 웃는 입
  noFill();
  stroke(100);
  strokeWeight(3);
  arc(0, 10, 40, 30, 0, PI);
  
  pop();
}

function drawArms() {
  push();
  translate(width/2, height/2 + 40);

  // 왼팔
  stroke(255, 220, 200);
  strokeWeight(25);
  noFill();
  beginShape();
  curveVertex(-90, -10);
  curveVertex(-90, -10);
  curveVertex(-60, 20);
  curveVertex(-40, 50);
  endShape();

  // 오른팔
  beginShape();
  curveVertex(90, -10);
  curveVertex(90, -10);
  curveVertex(60, 20);
  curveVertex(40, 50);
  endShape();

  pop();
}

// 네 기존 Marble 클래스를 그대로 사용
class Marble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80;
    this.isGray = true;
    this.color = null;
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // 그라데이션
    let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.size/2);
    if (this.isGray) {
      gradient.addColorStop(0, 'rgba(180,180,180,1)');
      gradient.addColorStop(1, 'rgba(120,120,120,1)');
    } else {
      let c = this.color;
      let r = red(c);
      let g = green(c);
      let b = blue(c);
      gradient.addColorStop(0, `rgba(${r+50}, ${g+50}, ${b+50}, 1)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 1)`);
      gradient.addColorStop(1, `rgba(${r-30}, ${g-30}, ${b-30}, 1)`);
    }
    drawingContext.fillStyle = gradient;
    circle(0, 0, this.size);
    
    // 하이라이트
    fill(255, 255, 255, 50);
    ellipse(-this.size/6, -this.size/6, this.size/3);

    pop();
  }
}
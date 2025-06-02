function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();  // 애니메이션 없이 한 번만 그리기
  }
  
  function draw() {
    background(210, 195, 160); // 바탕: 낡은 느낌의 베이지
  
    // 창고 본체
    push();
    translate(width / 2, height / 2);
    rectMode(CENTER);
  
    // 본체
    fill(100); // 어두운 회색 철제 느낌
    stroke(60);
    strokeWeight(1.5);
    rect(0, 75, 600, 375, 3); // 본체 크기
  
    // 녹슨 자국 (수직 선들)
    stroke(80, 60, 30, 90);
    for (let i = -270; i <= 270; i += 25) {
      let len = random(120, 330); // 세로길이
      line(i, -105, i, -105 + len);
    }
  
    // 낡은 철판 점들
    noStroke();
    for (let i = 0; i < 150; i++) {
      let px = random(-285, 285);
      let py = random(-150, 150);
      fill(50 + random(-10, 10), 50 + random(-10, 10), 50 + random(-10, 10), 100);
      ellipse(px, py, random(2, 6));
    }
  
    // 큰 철문
    fill(80);
    stroke(40);
    rect(0, 150, 180, 210);
  
    // 문 손잡이
    noStroke();
    fill(30);
    ellipse(45, 150, 15, 15);
  
    pop();
    
    push();
  translate(width / 2, height / 2 - 135);
  fill(70);
  stroke(40);
  rectMode(CENTER);
  rect(0, 0, 660, 45); // 지붕

    // 지붕
    push();
    translate(width / 2, height / 2 - 135);
    fill(70);
    stroke(40);
    rectMode(CENTER);
    pop();

    let chimneyW = 50;
    let chimneyH = 120;
    let chimneyX = -230; // 지붕 기준 왼쪽
  
    fill(90);
    stroke(50);
    strokeWeight(1.5);
    rect(chimneyX, -chimneyH / 2 - 10, chimneyW, chimneyH, 5); // 굴뚝 본체 (아래로 살짝 내림)
  
    fill(60);
    rect(chimneyX, -chimneyH - 20, chimneyW + 20, 20, 3); // 굴뚝 입구 (본체 기준 아래로 조금 더 내림)
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
    redraw();
  }
  
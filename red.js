let ball = {
    x: 400,
    y: 300,
    size: 50,
    color: [255, 186, 186], // 파스텔 빨강
    scaleFactor: 1,
    alpha: 255
};

let isAnimating = false;
let transitionStarted = false;

// SKIP 버튼 관련 변수들
let isHovering = false;
let buttonScale = 1;
let buttonX, buttonY, buttonWidth, buttonHeight;
let buttonDepth = 5;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    // Start animation immediately when loaded
    isAnimating = true;
    transitionStarted = true;

    // 버튼 위치와 크기 설정
    buttonWidth = 100;
    buttonHeight = 50;
    buttonX = width/2 - buttonWidth/2;
    buttonY = height/2 - buttonHeight/2;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function drawAngryGirl(x, y, scaleFactor) {
    push();
    translate(x, y);
    scale(scaleFactor);
    
    // 머리
    fill(255, 186, 186);
    noStroke();
    ellipse(0, 0, 100, 120);
    
    // 눈
    fill(255);
    ellipse(-25, -20, 30, 30);
    ellipse(25, -20, 30, 30);
    
    // 눈동자
    fill(0);
    ellipse(-25, -20, 15, 15);
    ellipse(25, -20, 15, 15);
    
    // 화난 표정
    stroke(0);
    strokeWeight(3);
    // 눈썹
    line(-40, -40, -10, -40);
    line(10, -40, 40, -40);
    // 입
    line(-20, 30, 20, 30);
    
    pop();
}

function drawSkipButton() {
    // 마우스가 버튼 위에 있는지 확인
    isHovering = mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                 mouseY > buttonY && mouseY < buttonY + buttonHeight;
    
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
}

function draw() {
    background(255, 240, 245);
    
    if (transitionStarted) {
        // 구슬 그리기
        push();
        translate(ball.x, ball.y);
        scale(ball.scaleFactor);
        noStroke();
        fill(ball.color[0], ball.color[1], ball.color[2], ball.alpha);
        circle(0, 0, ball.size);
        pop();
        
        // 애니메이션 실행
        if (isAnimating) {
            // 구슬 확대 및 투명도 감소
            if (ball.scaleFactor < 5) {
                ball.scaleFactor += 0.1;
                ball.alpha = map(ball.scaleFactor, 1, 5, 255, 0);
            }
            
            // 화난 소녀 그리기
            drawAngryGirl(ball.x, ball.y, ball.scaleFactor);
        }
    }

    // SKIP 버튼 그리기
    drawSkipButton();
}

function mousePressed() {
    // SKIP 버튼 클릭 확인
    if (isHovering) {
        buttonScale = 0.9;
        setTimeout(() => {
            buttonScale = 1;
        }, 100);

        // SKIP 버튼 클릭 시 throw.html로 이동
        window.location.replace('throw.html');
    }
}
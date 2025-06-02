let fadeIn = 0;
let textY = 0;
let namesY = 0;
let startTime;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    startTime = millis(); // 시작 시간 저장
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255, 240, 245);
    
    // 메인 메시지
    push();
    translate(width/2, height/2 + textY);
    fill(100, 100, 100, fadeIn);
    textSize(min(windowWidth, windowHeight) * 0.05); // 화면 크기에 비례하여 텍스트 크기 설정
    textStyle(BOLD);
    text("기쁜 나도, 슬픈 나도 괜찮아", 0, 0);
    pop();
    
    // 이름들
    push();
    translate(width/2, height/2 + min(windowHeight * 0.15, 100) + namesY);
    fill(150, 150, 150, fadeIn);
    textSize(min(windowWidth, windowHeight) * 0.025); // 화면 크기에 비례하여 텍스트 크기 설정
    textStyle(NORMAL);
    text("권경은, 김준성, 윤채원", 0, 0);
    pop();
    
    // 페이드인 애니메이션
    if (fadeIn < 255) {
        fadeIn += 2;
    }
    
    // 텍스트 움직임 애니메이션
    if (textY > -min(windowHeight * 0.03, 20)) {
        textY -= 0.5;
    }
    
    // 이름 움직임 애니메이션
    if (namesY > -min(windowHeight * 0.015, 10)) {
        namesY -= 0.3;
    }

    // 3초 후 first.html로 이동
    if (millis() - startTime > 3000) {
        window.location.href = 'first.html';
    }
}

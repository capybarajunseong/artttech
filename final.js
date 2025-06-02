let fadeIn = 0;
let textY = 0;
let startTime;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    startTime = millis();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255, 240, 245);
    
    // 메시지들
    push();
    translate(width/2, height/2 + textY);
    
    // 권경은
    fill(100, 100, 100, fadeIn);
    textSize(min(windowWidth, windowHeight) * 0.04);
    textStyle(BOLD);
    text("권경은 - 감사합니다", 0, -min(windowHeight * 0.1, 60));
    
    // 김준성
    text("김준성 - 감사합니다", 0, 0);
    
    // 윤채원
    text("윤채원 - 감사합니다", 0, min(windowHeight * 0.1, 60));
    pop();
    
    // 페이드인 애니메이션
    if (fadeIn < 255) {
        fadeIn += 2;
    }
    
    // 텍스트 움직임 애니메이션
    if (textY > -min(windowHeight * 0.05, 30)) {
        textY -= 0.5;
    }
}

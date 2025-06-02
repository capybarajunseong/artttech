// 전역 변수들
let marbles = []; // 구슬 객체들을 저장할 배열
let isDragging = false; // 드래그 상태
let draggedMarble = null; // 현재 드래그 중인 구슬
let restoredMarbles = []; // 복원된 구슬들을 저장할 배열
let handX = 400; // 손의 x 위치
let handY = 500; // 손의 y 위치
let rubbingProgress = 0; // 문지르기 진행도
let isRubbing = false; // 문지르기 중인지 여부
let prevMouseX = 0; // 이전 마우스 X 위치
let prevMouseY = 0; // 이전 마우스 Y 위치
let rubbingThreshold = 5; // 문지르기로 인정할 최소 이동 거리
let requiredRubbingCount = 3; // 필요한 문지르기 횟수
let isDraggingMode = true; // 드래그 모드인지 문지르기 모드인지 구분
let originalPositions = []; // 구슬들의 원래 위치 저장
let colorOrder = []; // 색상 순서 저장

// 구슬 클래스
class Marble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isGray = true;
        this.isRestored = false;
        this.size = min(windowWidth, windowHeight) * 0.15; // 화면 크기에 비례하여 구슬 크기 설정
        this.targetX = x;
        this.targetY = y;
        this.color = null;
        this.isGrabbed = false;
        this.rubbingCount = 0; // 문지른 횟수
        this.lastRubbingTime = 0; // 마지막 문지른 시간
    }

    display() {
        noStroke();
        push();
        translate(this.x, this.y);
        
        // 구슬 그라데이션 효과
        let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.size/2);
        if (this.isGray) {
            gradient.addColorStop(0, 'rgba(180, 180, 180, 1)');
            gradient.addColorStop(0.5, 'rgba(150, 150, 150, 1)');
            gradient.addColorStop(1, 'rgba(120, 120, 120, 1)');
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
        
        // 하이라이트 효과
        fill(255, 255, 255, 50);
        ellipse(-this.size/6, -this.size/6, this.size/3);
        
        // 문지르기 진행도 표시
        if (this.isGrabbed && this.isGray) {
            // 진행도 바 배경
            fill(200, 200, 200, 100);
            rect(-this.size/2, -this.size/2 - 20, this.size, 10, 5);
            
            // 진행도 바
            let progressWidth = (this.rubbingCount / requiredRubbingCount) * this.size;
            fill(100, 200, 255, 200);
            rect(-this.size/2, -this.size/2 - 20, progressWidth, 10, 5);
            
            // 진행도 텍스트
            fill(0);
            textSize(this.size * 0.12);
            textAlign(CENTER);
            text(`${this.rubbingCount}/${requiredRubbingCount}`, 0, -this.size/2 - 25);
        }
        
        pop();
    }

    isMouseOver() {
        return dist(mouseX, mouseY, this.x, this.y) < this.size/2;
    }

    isHandOver() {
        return dist(handX, handY, this.x, this.y) < this.size/2;
    }

    restore() {
        if (this.isGray) {
            // 최소 100ms 간격으로 문지르기 카운트 증가
            let currentTime = millis();
            if (currentTime - this.lastRubbingTime > 100) {
                this.rubbingCount++;
                this.lastRubbingTime = currentTime;
                
                if (this.rubbingCount >= requiredRubbingCount) {
                    this.isGray = false;
                    this.color = color(colorOrder[restoredMarbles.length]);
                    return true;
                }
            }
        }
        return false;
    }

    moveTo(x, y) {
        if (isDraggingMode) {
            // 드래그 모드일 때는 구슬이 움직일 수 있음
            this.targetX = x;
            this.targetY = y;
        } else {
            // 문지르기 모드일 때는 구슬이 고정됨
            this.targetX = this.x;
            this.targetY = this.y;
        }
    }

    update() {
        if (isDraggingMode) {
            // 드래그 모드일 때는 부드럽게 이동
            this.x = lerp(this.x, this.targetX, 0.1);
            this.y = lerp(this.y, this.targetY, 0.1);
        } else {
            // 문지르기 모드일 때는 고정
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // 색상 순서 랜덤 생성 (각 색상 3개씩)
    let colors = [
        '#FFB3B3', '#FFB3B3', '#FFB3B3',  // 연한 빨간색 3개
        '#A5D8FF', '#A5D8FF', '#A5D8FF',  // 하늘색 3개
        '#FFF5A5', '#FFF5A5', '#FFF5A5'   // 연한 노란색 3개
    ];
    // Fisher-Yates 셔플 알고리즘으로 색상 순서 섞기
    for (let i = colors.length - 1; i > 0; i--) {
        let j = Math.floor(random(i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    colorOrder = colors;
    
    // 구슬 생성 (9개)
    for (let i = 0; i < 9; i++) {
        let x = random(width * 0.1, width * 0.2);
        let y = random(height * 0.2, height * 0.8);
        let marble = new Marble(x, y);
        originalPositions.push({x: x, y: y}); // 원래 위치 저장
        marbles.push(marble);
    }
}

function draw() {
    background(240);
    
    handX = mouseX;
    handY = mouseY;
    
    // 구슬들 표시
    for (let marble of marbles) {
        marble.update();
        marble.display();
    }
    
    for (let marble of restoredMarbles) {
        marble.update();
        marble.display();
    }
    
    // 손수건 표시
    if (isRubbing) {
        drawHandkerchief();
    }
    
    drawHand();

    // 모든 구슬이 복원되었을 때 안내 문구 표시
    if (marbles.length === 0 && restoredMarbles.length === 9) {
        textAlign(CENTER);
        textSize(20);
        fill(100);
        text("c를 누르면 구슬 정렬", width/2, height - 30);
    }
}

function drawHandkerchief() {
    push();
    translate(handX, handY);
    // 마우스 움직임에 따라 손수건 회전
    let angle = atan2(mouseY - prevMouseY, mouseX - prevMouseX);
    rotate(angle);
    
    // 손수건 본체
    fill(255, 255, 255, 230);
    stroke(200, 200, 200);
    strokeWeight(2);
    rect(-40, -40, 80, 80, 10);
    
    // 손수건 장식
    fill(200, 200, 255, 150);
    noStroke();
    rect(-35, -35, 70, 70, 5);
    
    // 손수건 테두리 장식
    stroke(150, 150, 200);
    strokeWeight(1);
    noFill();
    rect(-38, -38, 76, 76, 12);
    
    pop();
}

function drawHand() {
    push();
    translate(handX, handY);
    
    // 손바닥
    fill(255, 220, 180);
    noStroke();
    ellipse(0, 0, 50, 35);
    
    // 손가락들
    let fingerAngles = [-PI/4, -PI/8, 0, PI/8, PI/4];
    let fingerLengths = [35, 40, 45, 40, 35];
    
    for (let i = 0; i < 5; i++) {
        push();
        rotate(fingerAngles[i]);
        // 손가락 본체
        fill(255, 220, 180);
        ellipse(0, -fingerLengths[i]/2, 15, fingerLengths[i]);
        // 손가락 끝
        fill(255, 210, 170);
        ellipse(0, -fingerLengths[i], 12, 12);
        pop();
    }
    
    // 손톱
    fill(255, 240, 230);
    for (let i = 0; i < 5; i++) {
        push();
        rotate(fingerAngles[i]);
        ellipse(0, -fingerLengths[i] + 2, 8, 6);
        pop();
    }
    
    pop();
}

function mousePressed() {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    
    for (let marble of marbles) {
        if (marble.isHandOver()) {
            if (isDraggingMode) {
                // 드래그 모드일 때
                marble.isGrabbed = true;
                draggedMarble = marble;
                isDragging = true;
            } else {
                // 문지르기 모드일 때
                marble.isGrabbed = true;
                draggedMarble = marble;
                isRubbing = true;
            }
            break;
        }
    }
}

function mouseReleased() {
    if (draggedMarble) {
        if (isDraggingMode) {
            // 드래그 모드에서 마우스를 놓으면 문지르기 모드로 전환
            isDraggingMode = false;
            draggedMarble.isGrabbed = false;
            // 구슬을 화면 중앙으로 이동
            draggedMarble.moveTo(width/2, height/2);
        } else {
            // 문지르기 모드에서 마우스를 놓으면 초기화
            draggedMarble.isGrabbed = false;
            if (!draggedMarble.isGray) {
                draggedMarble.moveTo(draggedMarble.x, draggedMarble.y);
                restoredMarbles.push(draggedMarble);
                marbles = marbles.filter(m => m !== draggedMarble);
            }
            isDraggingMode = true; // 다시 드래그 모드로 전환
        }
        draggedMarble = null;
    }
    isDragging = false;
    isRubbing = false;
}

function mouseDragged() {
    if (draggedMarble) {
        if (isDraggingMode) {
            // 드래그 모드일 때는 구슬을 마우스 위치로 이동
            draggedMarble.moveTo(mouseX, mouseY);
        } else if (draggedMarble.isGray) {
            // 문지르기 모드일 때는 문지르기 동작 수행
            let moveDistance = dist(mouseX, mouseY, prevMouseX, prevMouseY);
            if (moveDistance > rubbingThreshold) {
                draggedMarble.restore();
                prevMouseX = mouseX;
                prevMouseY = mouseY;
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // 구슬 크기 업데이트
    for (let marble of marbles) {
        marble.size = min(windowWidth, windowHeight) * 0.15;
    }
    for (let marble of restoredMarbles) {
        marble.size = min(windowWidth, windowHeight) * 0.15;
    }
}

function keyPressed() {
    if (key === 'c' || key === 'C') {
        // 색상별로 구슬 분류
        let redMarbles = [];
        let blueMarbles = [];
        let yellowMarbles = [];
        
        for (let marble of restoredMarbles) {
            let c = marble.color;
            let r = red(c);
            let g = green(c);
            let b = blue(c);
            
            // 색상 비교를 더 정확하게 수정
            if (r === 255 && g === 179 && b === 179) { // 연한 빨간색 (#FFB3B3)
                redMarbles.push(marble);
            } else if (r === 165 && g === 216 && b === 255) { // 하늘색 (#A5D8FF)
                blueMarbles.push(marble);
            } else if (r === 255 && g === 245 && b === 165) { // 연한 노란색 (#FFF5A5)
                yellowMarbles.push(marble);
            }
        }
        
        // 각 색상별로 겹쳐서 정렬 (화면 중앙 기준)
        let spacing = min(windowWidth, windowHeight) * 0.15; // 구슬 간격
        let centerX = width/2;
        let centerY = height/2;
        let overlap = 0.3; // 겹침 정도 (0~1 사이 값)
        
        // 연한 빨간색 구슬 배치 (왼쪽)
        for (let i = 0; i < redMarbles.length; i++) {
            let offset = i * spacing * (1 - overlap);
            redMarbles[i].moveTo(
                centerX - spacing + random(-10, 10),
                centerY - spacing + offset + random(-10, 10)
            );
        }
        
        // 하늘색 구슬 배치 (중앙)
        for (let i = 0; i < blueMarbles.length; i++) {
            let offset = i * spacing * (1 - overlap);
            blueMarbles[i].moveTo(
                centerX + random(-10, 10),
                centerY - spacing + offset + random(-10, 10)
            );
        }
        
        // 연한 노란색 구슬 배치 (오른쪽)
        for (let i = 0; i < yellowMarbles.length; i++) {
            let offset = i * spacing * (1 - overlap);
            yellowMarbles[i].moveTo(
                centerX + spacing + random(-10, 10),
                centerY - spacing + offset + random(-10, 10)
            );
        }
        
        // 회색 구슬들을 원래 위치로 정리
        for (let i = 0; i < marbles.length; i++) {
            marbles[i].moveTo(originalPositions[i].x, originalPositions[i].y);
        }

        // 3초 후 hug.html로 이동
        setTimeout(() => {
            window.location.href = 'hug.html';
        }, 3000);
    }
}

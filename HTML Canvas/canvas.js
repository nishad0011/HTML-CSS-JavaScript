
window.addEventListener("load",()=>{
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Draw rectangle with (x,y,width,height)

    ctx.strokeStyle = "blue"; //Border Colour
    ctx.fillStyle = "blue"; //fill colour

    ctx.lineWidth = 5;

    ctx.fillRect(500,50,200,300);   //solid fill
    ctx.strokeRect(700,50,200,300);   //border only

    //Lines
    ctx.beginPath();
    ctx.moveTo(100,200);
    ctx.lineTo(200,200);
    ctx.stroke();

    //Drawing with Mouse
    let drawing = false;

    function startPosition(){
        drawing = true;
    }
    function finishPosition(){
        drawing = false;
        ctx.beginPath();
    }
    function draw(e){
        if(!drawing)return;

        ctx.lineWidth = 10;
        ctx.lineCap="round";

        ctx.lineTo(e.clientX,e.clientY)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX,e.clientY);
    }

    canvas.addEventListener("mousedown",startPosition);
    canvas.addEventListener("mouseup",finishPosition);
    canvas.addEventListener("mousemove",draw);
})
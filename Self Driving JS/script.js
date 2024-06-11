
const carCanvas = document.querySelector("#carCanvas");

const networkCanvas = document.querySelector("#networkCanvas");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const width = 200;
carCanvas.width = width;
networkCanvas.width = 300;

const road = new Road(width / 2, width);
const N = 500;
const cars = generateCars(N);
let bestCarBrain = cars[0];

if (localStorage.getItem('bestCarBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestCarBrain'));

        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(2), -100, 30, 50, 'DUMMYCAR', 2),
    new Car(road.getLaneCenter(0), -100, 30, 50, 'DUMMYCAR', 2),
    new Car(road.getLaneCenter(1), -300, 30, 50, 'DUMMYCAR', 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMYCAR', 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, 'DUMMYCAR', 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMYCAR', 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMYCAR', 2),
];

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

animate();

function save() {
    localStorage.setItem("bestCarBrain", JSON.stringify(bestCarBrain.brain));
}
function discard() {
    localStorage.removeItem('bestCarBrain');
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.border, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.border, traffic);
    }
    //car.update(road.border, traffic);

    bestCarBrain = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    //ctx.save();
    carCtx.translate(0, -bestCarBrain.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'green');
    }
    carCtx.globalAlpha = 0.3;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'blue');
        carCtx.globalAlpha = 0.3;
    }
    carCtx.globalAlpha = 1;
    bestCarBrain.draw(carCtx, 'blue', drawSensors = true);

    networkCtx.lineDashOffset = - time / 100;
    Visualizer.drawNetwork(networkCtx, bestCarBrain.brain);
    requestAnimationFrame(animate);
}
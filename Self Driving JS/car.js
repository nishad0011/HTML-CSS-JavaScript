class Car {
    constructor(x, y, width, height, controlType, maxspeed = 4) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.polygon = [];

        this.speed = 0;
        this.accelaration = 0.3;
        this.friction = 0.05;
        this.maxspeed = maxspeed;
        this.angle = 0;
        this.damaged = false;
        this.controlType = controlType;

        this.useAI = (controlType == 'AI');

        if (controlType != "DUMMYCAR") {
            this.sensor = new Sensors(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 8, 4]);
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorder, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon(traffic);
            this.damaged = this.#assessDamage(roadBorder, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorder, traffic);
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            // console.log(outputs);

            if (this.useAI) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.backward = outputs[3];
            }
        }
    }

    #assessDamage(roadBorder, traffic) {
        for (let i = 0; i < roadBorder.length; i++) {
            if (polyIntersect(this.polygon, roadBorder[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polyIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon(traffic) {
        const points = [];
        const rad = Math.hypot(this.height, this.width) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(-this.angle - alpha) * rad,
            y: this.y - Math.cos(-this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + -this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + -this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + -this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + -this.angle - alpha) * rad
        });

        points.push({
            x: this.x - Math.sin(-this.angle + alpha) * rad,
            y: this.y - Math.cos(-this.angle + alpha) * rad
        });
        // if (this.controlType == "DUMMYCAR") { console.log(points) };
        return points;
    }

    #move() {
        // Increasign/decreasing car speed within range of maxspeed.
        if (this.controls.forward && this.speed <= this.maxspeed) {
            this.speed += this.accelaration;
        }
        if (this.controls.backward && this.speed >= -this.maxspeed) {
            this.speed -= this.accelaration;
        }

        // Left Right Movement
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1; // If speed is -ve then car is moving in reverse. Hence, car should rotate in opposite direction of the pressed arrow key.

            if (this.controls.left)
                this.angle -= 0.03 * flip;
            if (this.controls.right)
                this.angle += 0.03 * flip;
        }

        // Slowing speed with friction.
        if (this.speed > 0)
            this.speed -= this.friction;

        if (this.speed < 0)
            this.speed += this.friction;

        // If absolute value of speed < this.friction then set speed to 0 (avoids drifting when no key is pressed).
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Updating car position according to current speed and angle.
        this.x -= (-Math.sin(this.angle)) * this.speed;
        this.y -= (Math.cos(this.angle)) * this.speed;
    }

    draw(ctx, color, drawSensors = false) {
        if (this.damaged) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = color;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        /*         ctx.beginPath();
                ctx.strokeStyle = "black";
                for (let i = 0; i <= this.polygon.length; i++) {
                    ctx.lineTo(this.polygon[i % this.polygon.length].x, this.polygon[i % this.polygon.length].y);
                }
                ctx.stroke(); */

        if (this.sensor && drawSensors) {
            this.sensor.draw(ctx);
        }
    }
}
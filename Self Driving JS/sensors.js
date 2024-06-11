class Sensors {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2; //45 degree.

        this.rays = [];
        this.readings = [];
    }

    update(roadBorder, traffic) {
        this.#castRays()
        this.readings = [];

        // For each ray
        for (let i = 0; i < this.rayCount; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorder, traffic)
            )
        }
    }

    #getReading(ray, roadBorder, traffic) {
        //For each road border
        let alltouches = [];
        for (let i = 0; i < roadBorder.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorder[i][0],
                roadBorder[i][1]
            );
            if (touch) {
                alltouches.push(touch);
            }
        }

        //For each car
        for (let i = 0; i < traffic.length; i++) {
            const pol = traffic[i].polygon;
            for (let j = 0; j < pol.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    pol[j],
                    pol[(j + 1) % pol.length]
                );
                if (value) {
                    alltouches.push(value);
                }
            }
        }

        if (alltouches.length == 0) {
            return null;
        } else {
            const offsets = alltouches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return alltouches.find(e => e.offset == minOffset);
        }
    }

    #castRays() {
        this.rays = [];

        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                (this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1))
            )
                - this.car.angle;
            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - (this.rayLength * Math.sin(rayAngle)),
                y: this.car.y - (this.rayLength * Math.cos(rayAngle))
            };
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {

            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i]
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.moveTo(
                end.x,
                end.y
            );
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();
        }
    }
}
class Road {
    constructor(centerOfRoad, width, lanecount = 3) {
        this.centerOfRoad = centerOfRoad;
        this.width = width;
        this.lanecount = lanecount;

        // Side lanes of the road
        this.left = centerOfRoad - (width / 2) * 0.9;
        this.right = centerOfRoad + (width / 2) * 0.9;

        const infinite = 10000;
        this.top = -infinite;
        this.bottom = +infinite;

        // Defining left and roght borders of the roads.
        const top_left = { x: this.left, y: this.top };
        const top_right = { x: this.right, y: this.top };
        const bottom_left = { x: this.left, y: this.bottom };
        const bottom_right = { x: this.right, y: this.bottom };

        this.border = [[top_left, bottom_left], [top_right, bottom_right]];
    }

    getLaneCenter(laneIndex) {
        const laneWidth = (this.right - this.left) / this.lanecount;
        return this.left + (Math.min(laneIndex, this.lanecount - 1) * laneWidth) + (laneWidth / 2);
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // Middle Lanes.
        for (let i = 1; i < this.lanecount; i++) {
            const X = lerp(this.left, this.right, i / this.lanecount);

            ctx.setLineDash([/* visible */20, /* gap */20]);
            ctx.beginPath();
            ctx.moveTo(X, this.top);
            ctx.lineTo(X, this.bottom);
            ctx.stroke();
        }

        // Border Lanes.
        ctx.setLineDash([]);
        this.border.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })

    }
}

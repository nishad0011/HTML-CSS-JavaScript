class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(height - levelHeight, 0, network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1))

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight,
                i == network.levels.length - 1 ? ['↑', '←', '→', '↓'] : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, symbols) {
        const right = left + width;
        const bottom = top + height;
        const nodeRad = 18;
        const { inputs, outputs, weights, biases } = level;


        //Input Nodes
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNode(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNode(outputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();

            }
        }

        // Output Nodes
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNode(inputs, i, left, right)

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRad, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRad * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();


        }

        // Edges
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNode(outputs, i, left, right)

            ctx.beginPath();
            ctx.arc(x, top, nodeRad, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRad * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRad * 0.8, 0, Math.PI * 2)
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);


            if (symbols[i]) {
                ctx.beginPath();
                ctx.textAlign = 'center';
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = 'white';
                ctx.font = (nodeRad * 1.1) + "px Mono bold";
                ctx.fillText(symbols[i], x, top);
                ctx.lineWidth = 1;
                ctx.strokeText(symbols[i], x, top);

            }
        }


    }
    static #getNode(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}
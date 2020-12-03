export const templates = {
    container: () => {
        return `<div class="score-box">
                    YOUR SCORE: <span id="score-total">0</span> pts
                </div>
                <div class="score-current">
                    CURRENT TURN: <span id="score-current">1000</span> pts
                </div>
                <div class="canvas-container"></div>
                <div id="answer"></div>
                <button id="skip">Next</button>
                <button id="reveal">Reveal</button>
                <button id="submit">Submit</button>
                <div id="text"></div>`
    },
    movie: () => {
        return `<canvas id="poster" width="1920" height="800"></canvas>
                <canvas id="calculate" width="1920" height="800"></canvas>`
    }
}

// export default templates;
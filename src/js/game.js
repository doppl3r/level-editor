import { HemisphereLight, Scene } from 'three';
import { Bodies, Engine } from 'matter-js';
import { Background } from './background';
import { Player } from './player';

class Game {
    constructor() {
        this.scene = new Scene();
        this.player = new Player();
        this.background = new Background();
        this.engine = new Engine.create();
    }

    init(app) {
        // Add background and bind to player position
        this.scene.add(this.background);

        // Add basic environment light
        var hemisphere = new HemisphereLight('#ffffff', '#000000', 1);
        hemisphere.position.set(0, -1, 2);
        this.scene.add(hemisphere);
    }

    update(renderDelta, renderAlpha, physicsDelta) {
        // Update children 3D objects
        for (var i = 0; i < this.scene.children.length; i++) {
            var child = this.scene.children[i];

            // Update 3D object to rigid body position
            if (child.update) {
                child.update(renderDelta, renderAlpha, physicsDelta);
            }
        }

        // Step through world
        if (physicsDelta > 0) {
            Engine.update(this.engine);
        }
    }
}

export { Game };
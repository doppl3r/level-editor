import { HemisphereLight, Scene } from 'three';
import { Body, Box, Material, Vec3, World } from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { Background } from './background';
import { Player } from './player';

class Game {
    constructor() {
        this.scene = new Scene();
        this.player = new Player();
        this.background = new Background();
        this.world = new World({ allowSleep: true, gravity: new Vec3(0, 0, -9.82) });
        this.debugger = new CannonDebugger(this, this.world, { color: '#00ff00', scale: 1 });
        this.debug = false;
    }

    init(app) {
        // Add background and bind to player position
        this.scene.add(this.background);

        // Add basic environment light
        var hemisphere = new HemisphereLight('#ffffff', '#000000', 1);
        hemisphere.position.set(0, -1, 2);
        this.scene.add(hemisphere);
    }

    updateRender(delta, alpha) {
        // Update children 3D objects
        for (var i = 0; i < this.scene.children.length; i++) {
            var child = this.scene.children[i];

            // Update 3D object to rigid body position
            if (child.update) {
                child.update(delta, alpha);
            }

            // Update animations
            if (child.animation) {
                child.animation.update(delta);
            }
        }
    }

    updatePhysics(delta, alpha) {
        // Update children physics
        for (var i = 0; i < this.scene.children.length; i++) {
            var child = this.scene.children[i];

            // Update 3D object physics
            if (child.updatePhysics) {
                child.updatePhysics(delta, alpha);
            }
        }

        // Step world
        this.world.step(delta);
        if (this.debug) this.debugger.update();
    }
}

export { Game };
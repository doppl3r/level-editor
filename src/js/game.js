import { HemisphereLight, PerspectiveCamera, Scene } from 'three';
import { Bodies, Engine } from 'matter-js';
import { Background } from './background';
import { Player } from './player';
import { Editor } from './editor';

class Game {
    constructor() {
        this.sceneDefault = new Scene();
        this.scene = this.sceneDefault;
        this.cameraDefault = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera = this.cameraDefault;
        this.camera.position.z = 10;
        this.player = new Player();
        this.background = new Background();
        this.engine = new Engine.create();
        this.editor = new Editor();
    }

    init(app) {
        // Inherit app from instantiator
        this.app = app;
        this.editor.init(app);

        // Add background and bind to player position
        this.background.setTarget(this.camera);
        this.background.scale.set(100, 100, 100);
        this.scene.add(this.background);

        // Add basic environment light
        var hemisphere = new HemisphereLight('#ffffff', '#000000', 1);
        hemisphere.position.set(0, -1, 2);
        this.scene.add(hemisphere);

        // Set editor camera to current camera
        this.camera = this.editor.camera;
        this.scene = this.editor.scene;
    }

    update(renderDelta, renderAlpha, physicsDelta) {
        // Update editor
        this.editor.update(renderDelta, renderAlpha, physicsDelta);

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
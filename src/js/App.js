import { Clock, HemisphereLight, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutlinePass } from './OutlinePass.js';
import { Engine } from 'matter-js';
import { Assets } from './Assets';
import { Background } from './Background';
import { Player } from './Player';
import { Editor } from './Editor';
import Stats from './Stats.js';

class App {
    constructor() {
        var _this = this;
        this.clock = new Clock();
        this.clock.scale = 1;
        this.renderDeltaSum = 0;
        this.renderTickRate = -1; // Ex: 24 = 24fps, -1 = unlimited
        this.renderInterval = 1 / this.renderTickRate;
        this.physicsDeltaSum = 0;
        this.physicsTickRate = 30; // Calculations per second
        this.physicsInterval = 1 / this.physicsTickRate;
        this.stats = new Stats();
        this.assets = new Assets();
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = 10;
        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        // Assign post processing on top of renderer
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.outlinePass = new OutlinePass({}, this.scene, this.camera);
        this.smaaPass = new SMAAPass(0, 0); // Use window resize to set width/height
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderPass); // Renderer
        this.composer.addPass(this.outlinePass); // Border glow
        this.composer.addPass(this.smaaPass); // Anti-aliasing

        // Game library
        this.player = new Player();
        this.background = new Background();
        this.engine = new Engine.create();
        this.editor = new Editor();

        // Append renderer to canvas
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(this.stats.dom);
        
        // Add event listeners
        document.addEventListener('visibilitychange', function(e) { _this.visibilityChange(); });
        window.addEventListener('resize', function(e) { _this.resizeWindow(e); });

        // Resize window
        this.resizeWindow();

        // Initialize app after loading assets
        this.assets.load(function() {
            _this.init();
            _this.renderer.setAnimationLoop(function() { _this.loop(); });
        });
    }

    init() {
        // Inherit app from instantiator
        this.editor.init(this);

        // Add background and bind to player position
        this.background.setTarget(this.camera);
        this.background.scale.set(100, 100, 100);
        this.scene.add(this.background);

        // Add basic environment light
        var hemisphere = new HemisphereLight('#ffffff', '#000000', 1);
        hemisphere.position.set(0, -1, 2);
        this.scene.add(hemisphere);

        // Set editor camera to current camera (Including Postprocessing objects)
        this.camera = this.renderPass.camera = this.outlinePass.renderCamera = this.editor.camera;
        this.scene = this.renderPass.scene = this.outlinePass.renderScene = this.editor.scene;
    }

    loop() {
        // Update time factors
        this.stats.begin(); // Begin FPS counter
        var renderDelta = this.clock.getDelta() * this.clock.scale;
        var renderAlpha = this.physicsDeltaSum / this.physicsInterval; // Interpolation factor
        var physicsDelta = 0; // 0 = Do not update physics

        // Refresh renderer on a higher interval
        this.renderDeltaSum += renderDelta;
        if (this.renderDeltaSum > this.renderInterval) {
            this.renderDeltaSum %= this.renderInterval;
            if (this.renderTickRate > 0) renderDelta = this.renderInterval; // (optional) Lock render
            this.composer.render(); // Similar to this.renderer.render(this.scene, this.camera);
        }
        
        // Update engine on a lessor interval
        this.physicsDeltaSum += renderDelta;
        if (this.physicsDeltaSum > this.physicsInterval) {
            this.physicsDeltaSum %= this.physicsInterval; // reset with remainder
            physicsDelta = this.physicsInterval;
        }

        // Update game
        this.update(renderDelta, renderAlpha, physicsDelta);
        this.stats.end(); // End FPS counter
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

    setCamera(camera) {
        this.camera.isActive = false;
        this.camera = camera;
        this.camera.isActive = true;
    }

    resizeWindow(e) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    pause(play = false) {
        this.play = play;
        this.clock.stop();
        this.clock.elapsedTimePaused = this.clock.getElapsedTime();
    }

    resume(play = true) {
        this.play = play;
        this.clock.start();
        this.clock.elapsedTime = this.clock.elapsedTimePaused || 0;
    }

    visibilityChange() {
        if (document.visibilityState == 'visible') this.resume(this.play);
        else this.pause(this.play);
    }
}

// Expose app to window for debugging
window.app = new App();
import { Clock, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Assets } from './assets';
import { Game } from './game';
import Stats from './stats.js';

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
        this.renderer = new WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

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
        this.game = new Game();
        this.game.init(this);
        this.scene = this.game.scene;
        this.camera = this.game.camera;
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
            this.renderer.render(this.scene, this.camera); // Repaint scene
        }
        
        // Update engine on a lessor interval
        this.physicsDeltaSum += renderDelta;
        if (this.physicsDeltaSum > this.physicsInterval) {
            this.physicsDeltaSum %= this.physicsInterval; // reset with remainder
            physicsDelta = this.physicsInterval;
        }

        // Update game
        this.game.update(renderDelta, renderAlpha, physicsDelta);
        this.stats.end(); // End FPS counter
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
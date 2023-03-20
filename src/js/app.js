import { Clock, PCFSoftShadowMap, PerspectiveCamera, WebGLRenderer } from 'three';
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
        this.game = new Game();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.rotation.set(Math.PI / 2, 0, 0);
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
        this.game.init(this);
    }

    loop() {
        // Update time factors
        var delta = this.clock.getDelta() * this.clock.scale;
        var alpha = this.physicsDeltaSum / this.physicsInterval; // Interpolation factor
        var updateRen = false;
        var updatePhy = false;

        // Refresh renderer on a higher interval
        this.renderDeltaSum += delta;
        if (this.renderDeltaSum > this.renderInterval) {
            updateRen = true;
            this.renderDeltaSum %= this.renderInterval;
            this.updateRender(delta, alpha);
        }
        
        // Update engine on a lessor interval
        this.physicsDeltaSum += delta;
        if (this.physicsDeltaSum > this.physicsInterval) {
            updatePhy = true;
            alpha = (this.physicsDeltaSum - delta) / this.physicsInterval; // Request new position from physics
            this.physicsDeltaSum %= this.physicsInterval; // reset with remainder
            this.updatePhysics(this.physicsInterval, alpha);
        }
    }
    
    updateRender(delta, alpha) {
        // Set delta to target renderInterval
        if (this.renderTickRate > 0) delta = this.renderInterval;

        // Loop through all child objects
        this.game.updateRender(delta, alpha);

        // Render new scene
        this.renderer.render(this.game.scene, this.camera);
        this.stats.end(); // End FPS counter
    }

    updatePhysics(delta, alpha) {
        this.stats.begin(); // Begin FPS counter
        this.game.updatePhysics(delta, alpha);
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
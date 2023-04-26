import { AnimationMixer, LoopOnce, LoopRepeat } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import json from '../json/models.json';

class Models {
	constructor(manager) {
		this.cache = {};
		this.loader = new GLTFLoader(manager);
	}

	load() {
		var _this = this;
		for (const [key, value] of Object.entries(json)) {
			this.loader.load(value.url, function(gltf) {
				// Load model from gltf.scene Object3D (includes SkinnedMesh)
				var model = gltf.scene;
				model.name = key;
				model.animations = gltf.animations;
				model.userData = { ...value.userData };
				_this.applyUserData(model);
				_this.cache[key] = model;
			});
		}
	}

	clone(object) {
		// Optional - Get object from cache by name key
		if (typeof object == 'string') object = this.cache[object];

		// Utilize SkeletonUtils.js clone function
		var model = clone(object);
		model.animations = [...object.animations]; // Clone animations object
		model.traverse(function(node) { if (node.isMesh) { node.material = node.material.clone(); }}); // Clone material
		model.position.copy(object.position);

		// Add mixer animations
		this.applyUserData(model);

		// Add physics interpolation function
		model.update = this.update;

		// Return new model object
		return model;
	}

	applyUserData(model) {
		// Set object properties from userData
		if (model.userData.position) { model.position.set(model.userData.position.x, model.userData.position.y, model.userData.position.z); }
		if (model.userData.rotation) { model.rotation.set(model.userData.rotation.x, model.userData.rotation.y, model.userData.rotation.z); }
		if (model.userData.scale) { model.scale.set(model.userData.scale.x, model.userData.scale.y, model.userData.scale.z); }

		// Check if animations exist
		if (model.animations.length > 0) {
			// Initialize loop type
			var loopType = (model.userData?.animation?.loop == true) ? LoopRepeat : LoopOnce;
			model.traverse(function(obj) { obj.frustumCulled = false; }); // Disable offscreen clipping
			model.mixer = new AnimationMixer(model);
			model.clips = [];

			// Add all animations (for nested models)
			for (var i = 0; i < model.animations.length; i++) {
				model.clips.push(model.mixer.clipAction(model.animations[i]));
				model.clips[i].setLoop(loopType);
				model.clips[i].reset();
			}

			// Add basic functions
			model.animation = {
				play: function() { for (var i = 0; i < model.clips.length; i++) { model.clips[i].play(); }},
				reset: function() { for (var i = 0; i < model.clips.length; i++) { model.clips[i].reset(); }},
				update: function(delta = 1 / 60) { model.mixer.update(delta); }
			}

			// Start animation if looping
			if (loopType == LoopRepeat) model.animation.play();
		}
	}

	update(delta, alpha) {
		if (this.body && this.body.mass > 0) {
			// Convert CannonJS quaternion to threeJS quaternion
			this.body.quaternion._x = this.body.quaternion.x;
			this.body.quaternion._y = this.body.quaternion.y;
			this.body.quaternion._z = this.body.quaternion.z;
			this.body.quaternion._w = this.body.quaternion.w;

			// Interpolate position and rotation (quaternion)
			this.position.lerpVectors(this.body['previousPosition'], this.body['position'], alpha);
			this.quaternion.slerpQuaternions(this.body['previousQuaternion'], this.body['quaternion'], alpha);
		}
	}
}

export { Models };
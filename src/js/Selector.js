import { Frustum, Vector2, Vector3, Matrix4, Quaternion } from 'three';

const _frustum = new Frustum();
const _center = new Vector3();
const _tmpPoint = new Vector3();
const _vecNear = new Vector3();
const _vecTopLeft = new Vector3();
const _vecTopRight = new Vector3();
const _vecDownRight = new Vector3();
const _vecDownLeft = new Vector3();
const _vecFarTopLeft = new Vector3();
const _vecFarTopRight = new Vector3();
const _vecFarDownRight = new Vector3();
const _vecFarDownLeft = new Vector3();
const _vectemp1 = new Vector3();
const _vectemp2 = new Vector3();
const _vectemp3 = new Vector3();
const _matrix = new Matrix4();
const _quaternion = new Quaternion();
const _scale = new Vector3();

// This class combines the SelectionBox.js and SelectionHelper.js functionality to leverage context based event listeners

class Selector {
	constructor(camera, scene, renderer, cssClassName) {
		this.camera = camera;
		this.scene = scene;
		this.startPoint = new Vector3();
		this.endPoint = new Vector3();
		this.collection = [];
		this.instances = {};
		this.deep = Number.MAX_VALUE;
		this.filter = { name: null, value: null };
        
        // HTML Helper elements
        this.element = document.createElement('div');
		this.element.classList.add(cssClassName);
		this.element.style.pointerEvents = 'none';
		this.renderer = renderer;
		this.startBox = new Vector2();
		this.pointTopLeft = new Vector2();
		this.pointBottomRight = new Vector2();
		this.isDown = false;
	}

	select(startPoint, endPoint) {
		this.startPoint = startPoint || this.startPoint;
		this.endPoint = endPoint || this.endPoint;
		this.collection = [];
		this.updateFrustum(this.startPoint, this.endPoint);
		this.searchChildInFrustum(_frustum, this.scene);
		return this.collection;
	}

	updateFrustum(startPoint, endPoint) {
		startPoint = startPoint || this.startPoint;
		endPoint = endPoint || this.endPoint;

		// Avoid invalid frustum
		if (startPoint.x === endPoint.x) {
			endPoint.x += Number.EPSILON;
		}

		if (startPoint.y === endPoint.y) {
			endPoint.y += Number.EPSILON;
		}

		this.camera.updateProjectionMatrix();
		this.camera.updateMatrixWorld();

		if (this.camera.isPerspectiveCamera) {
			_tmpPoint.copy(startPoint);
			_tmpPoint.x = Math.min(startPoint.x, endPoint.x);
			_tmpPoint.y = Math.max(startPoint.y, endPoint.y);
			endPoint.x = Math.max(startPoint.x, endPoint.x);
			endPoint.y = Math.min(startPoint.y, endPoint.y);
			_vecNear.setFromMatrixPosition(this.camera.matrixWorld);
			_vecTopLeft.copy(_tmpPoint);
			_vecTopRight.set(endPoint.x, _tmpPoint.y, 0);
			_vecDownRight.copy(endPoint);
			_vecDownLeft.set(_tmpPoint.x, endPoint.y, 0);
			_vecTopLeft.unproject(this.camera);
			_vecTopRight.unproject(this.camera);
			_vecDownRight.unproject(this.camera);
			_vecDownLeft.unproject(this.camera);
			_vectemp1.copy(_vecTopLeft).sub(_vecNear);
			_vectemp2.copy(_vecTopRight).sub(_vecNear);
			_vectemp3.copy(_vecDownRight).sub(_vecNear);
			_vectemp1.normalize();
			_vectemp2.normalize();
			_vectemp3.normalize();
			_vectemp1.multiplyScalar(this.deep);
			_vectemp2.multiplyScalar(this.deep);
			_vectemp3.multiplyScalar(this.deep);
			_vectemp1.add(_vecNear);
			_vectemp2.add(_vecNear);
			_vectemp3.add(_vecNear);
			const planes = _frustum.planes;
			planes[ 0 ].setFromCoplanarPoints(_vecNear, _vecTopLeft, _vecTopRight);
			planes[ 1 ].setFromCoplanarPoints(_vecNear, _vecTopRight, _vecDownRight);
			planes[ 2 ].setFromCoplanarPoints(_vecDownRight, _vecDownLeft, _vecNear);
			planes[ 3 ].setFromCoplanarPoints(_vecDownLeft, _vecTopLeft, _vecNear);
			planes[ 4 ].setFromCoplanarPoints(_vecTopRight, _vecDownRight, _vecDownLeft);
			planes[ 5 ].setFromCoplanarPoints(_vectemp3, _vectemp2, _vectemp1);
			planes[ 5 ].normal.multiplyScalar(- 1);
		}
        else if (this.camera.isOrthographicCamera) {
			const left = Math.min(startPoint.x, endPoint.x);
			const top = Math.max(startPoint.y, endPoint.y);
			const right = Math.max(startPoint.x, endPoint.x);
			const down = Math.min(startPoint.y, endPoint.y);
			_vecTopLeft.set(left, top, - 1);
			_vecTopRight.set(right, top, - 1);
			_vecDownRight.set(right, down, - 1);
			_vecDownLeft.set(left, down, - 1);
			_vecFarTopLeft.set(left, top, 1);
			_vecFarTopRight.set(right, top, 1);
			_vecFarDownRight.set(right, down, 1);
			_vecFarDownLeft.set(left, down, 1);
			_vecTopLeft.unproject(this.camera);
			_vecTopRight.unproject(this.camera);
			_vecDownRight.unproject(this.camera);
			_vecDownLeft.unproject(this.camera);
			_vecFarTopLeft.unproject(this.camera);
			_vecFarTopRight.unproject(this.camera);
			_vecFarDownRight.unproject(this.camera);
			_vecFarDownLeft.unproject(this.camera);
			const planes = _frustum.planes;
			planes[ 0 ].setFromCoplanarPoints(_vecTopLeft, _vecFarTopLeft, _vecFarTopRight);
			planes[ 1 ].setFromCoplanarPoints(_vecTopRight, _vecFarTopRight, _vecFarDownRight);
			planes[ 2 ].setFromCoplanarPoints(_vecFarDownRight, _vecFarDownLeft, _vecDownLeft);
			planes[ 3 ].setFromCoplanarPoints(_vecFarDownLeft, _vecFarTopLeft, _vecTopLeft);
			planes[ 4 ].setFromCoplanarPoints(_vecTopRight, _vecDownRight, _vecDownLeft);
			planes[ 5 ].setFromCoplanarPoints(_vecFarDownRight, _vecFarTopRight, _vecFarTopLeft);
			planes[ 5 ].normal.multiplyScalar(- 1);
		}
        else {
			console.error('THREE.Selector: Unsupported camera type.');
		}
	}

	setPropertyFilter(name, value) {
		this.filter = { name: name, value: value };
	}

	searchChildInFrustum(frustum, object) {
		if (object.isMesh || object.isLine || object.isPoints) {
            // Check InstancedMesh type
			if (object.isInstancedMesh) {
				this.instances[object.uuid] = [];

                // Loop through groups of meshes
				for (let instanceId = 0; instanceId < object.count; instanceId++) {
					object.getMatrixAt(instanceId, _matrix);
					_matrix.decompose(_center, _quaternion, _scale);
					_center.applyMatrix4(object.matrixWorld);

                    // Check if the center is selected
					if (frustum.containsPoint(_center)) {
						if (object[this.filter.name] == this.filter.value) {
							this.instances[ object.uuid ].push(instanceId);
						}
					}
				}
			}
            else {
                // Check standard object type
				if (object.geometry.boundingSphere === null) object.geometry.computeBoundingSphere();
				_center.copy(object.geometry.boundingSphere.center);
				_center.applyMatrix4(object.matrixWorld);

				if (frustum.containsPoint(_center)) {
					if (object[this.filter.name] == this.filter.value) {
						this.collection.push(object);
					}
				}
			}
		}

        // Recursively check objects
		if (object.children.length > 0) {
			for (let x = 0; x < object.children.length; x++) {
				this.searchChildInFrustum(frustum, object.children[ x ]);
			}
		}
	}

    connect() {
        this.renderer.domElement.addEventListener('mousedown', this.mouseDown);
		this.renderer.domElement.addEventListener('mousemove', this.mouseMove);
		this.renderer.domElement.addEventListener('mouseup', this.mouseUp);
    }

    dispose() {
		this.renderer.domElement.removeEventListener('mousedown', this.mouseDown);
		this.renderer.domElement.removeEventListener('mousemove', this.mouseMove);
		this.renderer.domElement.removeEventListener('mouseup', this.mouseUp);
	}

    getMouse(e) {
        return { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1, z: 0.5 };
    }

	mouseDown(event) {
        // Must start on renderer DOM element
        if (event.target == this.renderer.domElement) {
            // Update 3D start point
            this.startPoint.copy(this.getMouse(event));
            
            // Update 2D start point
            this.isDown = true;
            this.element.style.display = 'none';
            this.renderer.domElement.parentElement.appendChild(this.element);
            this.element.style.left = event.clientX + 'px';
            this.element.style.top = event.clientY + 'px';
            this.element.style.width = '0px';
            this.element.style.height = '0px';
            this.startBox.x = event.clientX;
            this.startBox.y = event.clientY;
        }
	}

	mouseMove(event) {
        if (this.isDown) {
            this.element.style.display = 'block';
            this.pointBottomRight.x = Math.max(this.startBox.x, event.clientX);
            this.pointBottomRight.y = Math.max(this.startBox.y, event.clientY);
            this.pointTopLeft.x = Math.min(this.startBox.x, event.clientX);
            this.pointTopLeft.y = Math.min(this.startBox.y, event.clientY);
            this.element.style.left = this.pointTopLeft.x + 'px';
            this.element.style.top = this.pointTopLeft.y + 'px';
            this.element.style.width = (this.pointBottomRight.x - this.pointTopLeft.x) + 'px';
            this.element.style.height = (this.pointBottomRight.y - this.pointTopLeft.y) + 'px';
        }
	}

	mouseUp(event) {
        // Update 3D end point
        this.endPoint.copy(this.getMouse(event));

        // Remove 2D select box
        if (this.isDown) {
            this.element.parentElement.removeChild(this.element);
            this.isDown = false;
        }
	}
}

export { Selector };

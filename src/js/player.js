import { Group, PerspectiveCamera, Raycaster, Vector3 } from 'three';
import { Body, Sphere, Material } from 'cannon-es';

class Player extends Group {
    constructor() {
        super();
        this.name = 'Player';
        
    }
}

export { Player };
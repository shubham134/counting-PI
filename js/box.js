class Box {
    constructor(id, pos, size, mass, velocity) {
        this.id = id;
        this.pos = pos;
        this.size = size;
        this.mass = mass;
        this.velocity = velocity;
    }

    update() {
        this.pos += this.velocity;
    }

    bounce(other) {
        var Msum = this.mass + other.mass;
        var Mdiff = this.mass - other.mass;
        return (Mdiff * this.velocity) / Msum + (2 * other.mass * other.velocity) / Msum;
    }

    collide(other) {
        return !(this.pos + this.size < other.pos);
    }

    wallCollide() {
        return this.pos <= 0;
    }

    reverse() {
        this.velocity *= -1;
    }
}
function addBall() {
    var size = Math.random() * 0.2 + 0.1;
    var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);

    var ball = new Entity.Circle(size, null, null, pos, vel);

    PhysicsScene.addEntity(ball);
}
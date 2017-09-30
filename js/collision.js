//hitTestRectangle

function hitTestRectangle(r1, r2)
{
    //A variable to determine whether there's a collision
    var hit = false;

    //Calculate the distance vector
    var vx = r1.centerX() - r2.centerX();
    var vy = r1.centerY() - r2.centerY();

    //Figure out the combined half-widths and half-heights
    var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
    var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

    //Check for a collision on the x axis
    if(Math.abs(vx) < combinedHalfWidths)
    {
        //A collision might be occuring. Check for a collision on the y axis
        if(Math.abs(vy) < combinedHalfHeights)
        {
            //There's definitely a collision happening
            hit = true;
        }
        else
        {
            //There's no collision on the y axis
            hit = false;
        }
    }
    else
    {
        //There's no collision on the x axis
        hit = false;
    }

    return hit;
}
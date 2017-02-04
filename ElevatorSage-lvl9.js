// Level 9 PASSED!

{
    
    init: function(elevators, floors) {

        var elevator = elevators[0]; // Let's use the first elevator
        var downButtonPressed = [];
        var upButtonPressed = [];



        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function () {
                // Maybe tell an elevator to go to this floor?
                if (!alreadyPressed(floor.floorNum(), upButtonPressed)) {
                    upButtonPressed.push(floor.floorNum());
                }
            })

            floor.on("down_button_pressed", function () {
                if (!alreadyPressed(floor.floorNum(), downButtonPressed)) {
                    downButtonPressed.push(floor.floorNum());
                }
            })
        })

        elevators.forEach(function (elevator) {
            elevator.on("idle", function () {

                // let's go to all the floors (or did we forget one?)
                var goTo = 0
                if (downButtonPressed.length > 0) {
                    goTo = downButtonPressed.shift();
                } else if (upButtonPressed.length > 0) {
                    goTo = upButtonPressed.shift();
                }
                elevator.goToFloor(goTo);
            });

            elevator.on("passing_floor", function (floorNum, direction) {
                if (elevator.destinationDirection() === "up") {
                    if (stopAtFloor(upButtonPressed, this, floorNum)) {
                        if (elevator.loadFactor() < 1) {
                            elevator.goToFloor(floorNum, true);
                        }
                    }

                }

                if (elevator.destinationDirection() === "down") {
                    if (stopAtFloor(downButtonPressed, this, floorNum)) {
                        if (elevator.loadFactor() < 1) {
                            elevator.goToFloor(floorNum, true);
                        }
                    }
                }
            });



            elevator.on("floor_button_pressed", function (floorNum) {
                // Maybe tell the elevator to go to that floor?
                var destination = elevator.destinationDirection();
                if (!alreadyPressed(floorNum, elevator.destinationQueue)) {
                    elevator.destinationQueue.push(floorNum);
                    elevator.checkDestinationQueue();
                }
                console.debug(elevator.destinationQueue);
                var goto = goToNearest(elevator.destinationQueue, destination, this);
                elevator.goToFloor(goto);
            })



            elevator.on("stopped_at_floor", function (floorNum) {
                // Maybe decide where to go next?
            })
        });

        function stopAtFloor(anArray, elevator, floor) {
            var destinations = anArray;
            if (destinations.length > 0) {
                for (var i = 0; i < destinations.length; i++) {
                    if (floor === destinations[i]) {
                        var x = destinations[0];
                        destinations[0] = destinations[i]
                        destinations[i] = x;
                        destinations.shift();
                        return true;
                    }
                }
            }
            return false;
        }

        function alreadyPressed(floor, anArray) {
            var alreadyP = false;
            if (anArray.length > 0)
                for (var i = 0; i < anArray.length; i++) {
                    if (anArray[i] === floor)
                        alreadyP = true;
                }
            return alreadyP;
        }



        function goToNearest(anArray, destination, elevator) {
            var current = elevator.currentFloor();
            var floorDestination = 0;
            if (destination === "up") {
                floorDestination = floors.length - 1;
            }

            var numbers = anArray;
            numbers.sort();
            var nearest = current;
            if (numbers.length > 0) {
                if (destination === "up") {
                    for (var i = 0; i < numbers.length; i++) {
                        if (nearest < numbers[i] && numbers[i] <= floorDestination) {
                            return numbers[i];
                        }
                    }
                }

                if (destination === "down") {
                    for (var i = numbers.length - 1; i >= 0; i--) {
                        if (numbers[i] < nearest && numbers[i] <= floorDestination) {
                            return numbers[i];
                        }
                    }
                }
            }
            return floorDestination;
        }



    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}



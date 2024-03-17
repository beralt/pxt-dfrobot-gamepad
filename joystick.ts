// Add your code here

//% color=#242491 icon="\uf11b"
namespace gamepad {

    let initialized = false

    export enum Direction {
        //% block="Forward"
        Forward = 0,
        //% block="Backward"
        Backward,
        //% block="Left"
        Left,
        //% block="Right"
        Right,
    }

    export enum Axis {
        X = 0,
        Y,
    }

    export enum Button {
        //% block="Green"
        Green = 0,
        //% block="Yellow"
        Yellow,
        //% block="Red"
        Red,
        //% block="Blue"
        Blue,
        A,
        B,
        Z,
    }

    function init() {
        if (initialized)
            return
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
        initialized = true
    }

    //% blockId=joystick_value block="joystick %axis value"
    //% weight=10
    export function joystick_value(axis: Axis): number {
        let x = pins.analogReadPin(AnalogPin.P1)
        let y = pins.analogReadPin(AnalogPin.P2)
        if (axis == Axis.X) {
            if (x > 400 && x < 600)
                return remap(y)
            return 0
        } else {
            if (y > 400 && y < 600)
                return remap(x)
            return 0
        }
    }

    //% blockId=joystick_direction block="joystick %direction direction"
    //% weight=10
    export function joystick_direction(direction: Direction): boolean {
        let x = pins.analogReadPin(AnalogPin.P1)
        let y = pins.analogReadPin(AnalogPin.P2)
        switch (direction) {
            case Direction.Forward:
                return y >= 600
            case Direction.Backward:
                return y <= 400
            case Direction.Left:
                return x <= 400
            case Direction.Right:
                return x >= 600
        }
    }

    function remap(value: number): number {
        return Math.round((value - 512) / 102.4)
    }

    //% blockId=button_pressed block="%button button pressed"
    //% weight=10
    export function button_pressed(button: Button): boolean {
        init()
        switch(button) {
            case Button.Green:
                return pins.digitalReadPin(DigitalPin.P13) == 0
            case Button.Yellow:
                return pins.digitalReadPin(DigitalPin.P14) == 0
            case Button.Red:
                return pins.digitalReadPin(DigitalPin.P15) == 0
            case Button.Blue:
                return pins.digitalReadPin(DigitalPin.P16) == 0
            case Button.A:
                return pins.digitalReadPin(DigitalPin.P5) == 0
            case Button.B:
                return pins.digitalReadPin(DigitalPin.P11) == 0
            case Button.Z:
                return pins.digitalReadPin(DigitalPin.P8) == 0
        }
        return false
    }

    //% blockId=vibrate block="set vibrate to %on"
    //% on.shadow="toggleOnOff"
    export function vibrate(on: boolean): void {
        if (on) {
            pins.digitalWritePin(DigitalPin.P12, 1)
        } else {
            pins.digitalWritePin(DigitalPin.P12, 0)
        }
    }

    //% blockId=button_callback block="when %button is pressed"
    export function on_button_pressed(button: Button, callback: () => void) {
        init()
        switch (button) {
            case Button.Green:
                pins.onPulsed(DigitalPin.P13, PulseValue.Low, callback)
            case Button.Yellow:
                pins.onPulsed(DigitalPin.P14, PulseValue.Low, callback)
            case Button.Red:
                pins.onPulsed(DigitalPin.P15, PulseValue.Low, callback)
            case Button.Blue:
                pins.onPulsed(DigitalPin.P16, PulseValue.Low, callback)
            case Button.A:
                pins.onPulsed(DigitalPin.P5, PulseValue.Low, callback)
            case Button.B:
                pins.onPulsed(DigitalPin.P11, PulseValue.Low, callback)
            case Button.Z:
                pins.onPulsed(DigitalPin.P8, PulseValue.Low, callback)
        }
    }

}
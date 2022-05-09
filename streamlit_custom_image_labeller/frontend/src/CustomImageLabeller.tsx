import React, { useEffect, useState, useRef} from "react"
import {
    ComponentProps,
    Streamlit,
    withStreamlitConnection,
} from "streamlit-component-lib"
import { fabric } from "fabric"
import styles from "./StreamlitImgLabel.module.css"
import { Point } from "fabric/fabric-impl"

interface PointProps {
  x:number
  y:number
}

interface PythonArgs {
    canvasWidth: number
    canvasHeight: number
    point: PointProps
    pointColor: string
    imageData: Uint8ClampedArray
}


const addPoint = (canvas:fabric.Canvas, pointX:number, pointY:number, pointColor:string) => {
    const pointObj = new fabric.Circle({
            radius: 2,
            fill: pointColor,
            left: pointX,
            top: pointY,
            selectable: true,
            originX: "center",
            originY: "center",
            hoverCursor: "auto",
            lockScalingX: true,
            lockScalingY: true,
        })          
    canvas.add(pointObj);
    canvas.renderAll()

}

const initCanvas = ({ canvasWidth, canvasHeight, imageData, pointX, pointY, pointColor }: {canvasWidth: number; canvasHeight: number; imageData: Uint8ClampedArray, pointX:number, pointY:number, pointColor:string }) => {
    // const imageObj = new ImageData(imageData, canvasWidth, canvasHeight);
    const canvas = new fabric.Canvas("canvas", {height :canvasHeight, width:canvasWidth, backgroundColor: "gray"})
    addPoint(canvas, pointX, pointY, pointColor)
    return canvas
}

const CustomImageLabeller = (props: ComponentProps) => {
    const { canvasWidth, canvasHeight, imageData }: PythonArgs = props.args
    const pointColor = props.args.pointColor
    const [mode, setMode] = useState<string>("light")
    const [canvas, setCanvas] = useState<fabric.Canvas|null>(null)
    const [ pointX, setPointX] = useState<number>(props.args.point.x)
    const [ pointY, setPointY] = useState<number>(props.args.point.y)

    useEffect(() => {
        const canvas = initCanvas({ canvasWidth, canvasHeight, imageData, pointX, pointY, pointColor })
        canvas.on('mouse:down', (options):void => {
            setPointX(options.e.clientX)
            setPointY(options.e.clientY)
        });
        setCanvas(canvas)
        console.log(pointX, pointY)
        Streamlit.setFrameHeight()
    }, [pointX, pointY])
    return (
        <>
            <canvas
                id="canvas"
                className={mode === "dark" ? styles.dark : ""}
                width={canvasWidth}
                height={canvasHeight}
            />
        </>
    )
}

export default withStreamlitConnection(CustomImageLabeller)
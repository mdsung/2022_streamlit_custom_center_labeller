import React, { useEffect, useState} from "react"
import {
    ComponentProps,
    Streamlit,
    withStreamlitConnection,
} from "streamlit-component-lib"
import { fabric } from "fabric"
import styles from "./StreamlitImgLabel.module.css"

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

const getImage = (canvasWidth:number, canvasHeight:number, imageData: Uint8ClampedArray):string =>{
    let dataUri: any
    const invisCanvas = document.createElement("canvas")
    invisCanvas.width = canvasWidth
    invisCanvas.height = canvasHeight
    const ctx = invisCanvas.getContext("2d")
    if (ctx) {
        const idata = ctx.createImageData(canvasWidth, canvasHeight)
        // set our buffer as source
        idata.data.set(imageData)
        // update canvas with new data
        ctx.putImageData(idata, 0, 0)
        dataUri = invisCanvas.toDataURL()
    } else {
        dataUri = ""
    }    
    return dataUri
}
const addPoint = (canvas:fabric.Canvas, pointX:number, pointY:number, pointColor:string) => {
    const pointObj = new fabric.Circle({
            radius: 3,
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
}

const initCanvas = ({ canvasWidth, canvasHeight, imageData, pointX, pointY, pointColor }: {canvasWidth: number; canvasHeight: number; imageData: Uint8ClampedArray, pointX:number, pointY:number, pointColor:string }) => {
    const datauri = getImage(canvasWidth, canvasHeight, imageData)
    const canvas = new fabric.Canvas("canvas", {height :canvasHeight, width:canvasWidth, backgroundImage: datauri})
    addPoint(canvas, pointX, pointY, pointColor)
    return canvas
}

const CustomImageLabeller = (props: ComponentProps) => {
    const { canvasWidth, canvasHeight, imageData }: PythonArgs = props.args
    const pointColor = props.args.pointColor
    const [mode, setMode ] = useState<string>("light")
    const [, setCanvas ] = useState<fabric.Canvas|null>(null)
    const [ pointX, setPointX ] = useState<number>(props.args.point.x)
    const [ pointY, setPointY ] = useState<number>(props.args.point.y)

    useEffect(() => {
        const canvas = initCanvas({ canvasWidth, canvasHeight, imageData, pointX, pointY, pointColor })
        canvas.on('mouse:down', (options):void => {
            setPointX(options.e.clientX)
            setPointY(options.e.clientY)
        });
        setCanvas(canvas)
        Streamlit.setFrameHeight()
        Streamlit.setComponentValue({x:pointX, y:pointY});

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
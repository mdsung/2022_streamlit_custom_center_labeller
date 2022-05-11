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
const addPoint = (canvas:fabric.Canvas, point:PointProps, pointColor:string) => {
    const pointObj = new fabric.Circle({
            radius: 3,
            fill: pointColor,
            left: point.x,
            top: point.y,
            selectable: true,
            originX: "center",
            originY: "center",
            hoverCursor: "auto",
            lockScalingX: true,
            lockScalingY: true,
        })          
    canvas.add(pointObj);
    return canvas
}

const initCanvas = (canvasWidth:number, canvasHeight:number, imageData:Uint8ClampedArray, point:PointProps, pointColor:string) => {
    const datauri = getImage(canvasWidth, canvasHeight, imageData)
    let canvas = new fabric.Canvas("canvas", {height :canvasHeight, width:canvasWidth, backgroundImage: datauri})
    canvas = addPoint(canvas, point, pointColor)
    return canvas
}

const CustomImageLabeller = (props: ComponentProps) => {
    const { canvasWidth, canvasHeight, imageData }: PythonArgs = props.args
    const pointColor = props.args.pointColor
    const [mode, setMode ] = useState<string>("light")
    const [point, setPoint] = useState<PointProps>({x:props.args.point.x, y:props.args.point.y})
    const [canvas, setCanvas ] = useState<fabric.Canvas>(initCanvas(canvasWidth, canvasHeight, imageData, point, pointColor))
    
    canvas.on('mouse:down', (options):void => {   
        setPoint({...point, x:options.e.clientX, y:options.e.clientY})
        console.log(point)
    });
    
    useEffect(() => {
        setCanvas(initCanvas(canvasWidth, canvasHeight, imageData, point, pointColor))
        Streamlit.setFrameHeight()
        Streamlit.setComponentValue({x:point.x, y:point.y});
    }, [point, imageData])
    
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
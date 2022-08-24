import React, { useEffect, useState, useRef} from "react"
import {
    ComponentProps,
    Streamlit,
    withStreamlitConnection,
} from "streamlit-component-lib"
// import { fabric } from "fabric"

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

const CustomImageLabeller = (props: ComponentProps) => {
    const pointColor = props.args.pointColor
    const { canvasWidth, canvasHeight, imageData }: PythonArgs = props.args

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [point, setPoint] = useState<PointProps>({x:props.args.point.x, y:props.args.point.y})
    const [image, setImage] = useState<Uint8ClampedArray>(imageData)

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) =>{
        setPoint({...point, x:e.clientX, y:e.clientY})
        console.log(e.clientX, e.clientY)
    }

    useEffect(() => {
        const canvasObj = canvasRef.current;
        const context = canvasObj!.getContext("2d");
        const idata = context!.createImageData(canvasWidth, canvasHeight)
        idata.data.set(image)
        context!.putImageData(idata, 0, 0)
        context!.fillStyle = pointColor;
        context!.fillRect(point.x, point.y, 3, 3)
        Streamlit.setFrameHeight()
        console.log(point.x, point.y)
        Streamlit.setComponentValue({x:point.x, y:point.y});
    }, [point])
    
    return (
        <div>
            <canvas
                ref={canvasRef}
                onClick={(e)=>{handleCanvasClick(e)}}
                width = {canvasWidth}
                height = {canvasHeight}
            />
        </div>
    )
}

export default withStreamlitConnection(CustomImageLabeller)
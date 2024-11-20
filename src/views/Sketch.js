import {useCallback, useState, useEffect, useRef} from 'react';
import Button from '@enact/sandstone/Button';
import {fabric} from 'fabric';

const Sketch = () => {
	const [canvas, setCanvas] = useState(null);
	const bgColor = useRef('#FFFFFF');

	// 그리기/선택 모드 구분
	const [activeTool, setActiveTool] = useState("select");

	useEffect(() => {
		const initCanvas =
			new fabric.Canvas('canvas', {
				height: 780,
				width: 1700,
				backgroundColor: bgColor.current,
		});
		setCanvas(initCanvas);

		return () => {
			initCanvas.dispose();
		};
	}, []);

	// 그리기/선택 모드 구분
	useEffect(() => {
		if (canvas) {
			if (activeTool == "draw") {
				canvas.isDrawingMode = true;
				canvas.selection = true;
			} else if (activeTool == "select") {
				canvas.isDrawingMode = false;
				canvas.selection = false;
			}
			canvas.renderAll();
		}
	}, [activeTool, canvas]);

	const clearCanvas = useCallback(() => {
		canvas.clear();
		canvas.backgroundColor = bgColor.current;
	}, [canvas]);

	const downloadCanvas = useCallback(() => {}, []);

	const setDrawMode = useCallback(() => {
		canvas.isDrawingMode = true;
				canvas.selection = false;
				canvas.renderAll();
				canvas.forEachObject((obj) => (obj.selectable = false));
	}, [canvas]);

	const setSelectMode = useCallback(() => {
		canvas.isDrawingMode = false;
				canvas.selection = true;
				canvas.forEachObject((obj) => (obj.selectable = true));
				canvas.renderAll();
	}, [canvas]);

	return (
		<div>
			<Button
				icon="trash"
				iconOnly
				backgroundOpacity="opaque"
				onClick={clearCanvas}
			/>
			<Button
				icon="download"
				iconOnly
				backgroundOpacity="opaque"
				onClick={downloadCanvas}
			/>
			<Button
				icon="P"
				iconOnly
				backgroundOpacity="opaque"
				onClick={setDrawMode}
			/>
			<Button
				icon="S"
				iconOnly
				backgroundOpacity="opaque"
				onClick={setSelectMode}
			/>
			<canvas id="canvas" />
		</div>
	);
};

export default Sketch;

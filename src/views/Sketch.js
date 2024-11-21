import { useCallback, useState, useEffect, useRef } from 'react';
import Button from '@enact/sandstone/Button';
import { fabric } from 'fabric';
import { CirclePicker } from 'react-color';

const Sketch = () => {
	const [canvas, setCanvas] = useState(null);
	const bgColor = useRef('#FFFFFF');

	// 그리기/선택 모드 구분
	const [activeTool, setActiveTool] = useState("draw");

	// 브러쉬 초기 설정
	const [lineWidth, setLineWidth] = useState(2);
	const [brushColor, setBrushColor] = useState("#000000");
	const [showPicker, setShowPicker] = useState(false);

	useEffect(() => {
		const initCanvas =
			new fabric.Canvas('canvas', {
				height: 780,
				width: 1700,
				backgroundColor: bgColor.current,
				isDrawingMode: true,
			});

		initCanvas.freeDrawingBrush.color = brushColor;
		initCanvas.freeDrawingBrush.width = lineWidth;
		setCanvas(initCanvas);

		return () => {
			initCanvas.dispose();
		};
	}, []);

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

	const downloadCanvas = useCallback(() => { }, []);

	//MARK: - 그리기/선택 모드 구분
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


	//MARK: - Line 두께 설정
	const changeLightWeight = useCallback(() => {
		if (canvas) {
			const newWidth = 2;
			canvas.freeDrawingBrush.width = newWidth;
		}
	}, [canvas]);

	const changeMediumWeight = useCallback(() => {
		if (canvas) {
			const newWidth = 6;
			canvas.freeDrawingBrush.width = newWidth;
		}
	}, [canvas]);

	const changeBoldWeight = useCallback(() => {
		if (canvas) {
			const newWidth = 10;
			canvas.freeDrawingBrush.width = newWidth;
		}
	}, [canvas]);

	//MARK: - Line 색상 설정
	// const showColorPallete = useCallback(() => {
	// 	setShowPicker((prev) => !prev);
	// }, []);

	const changeBrushColor = useCallback((color) => {
		const selectedColor = color.hex;
		setBrushColor(selectedColor);
		if (canvas) {
			canvas.freeDrawingBrush.color = selectedColor;
		}
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
			<Button
				icon="L"
				iconOnly
				backgroundOpacity="opaque"
				onClick={changeLightWeight}
			/>
			<Button
				icon="M"
				iconOnly
				backgroundOpacity="opaque"
				onClick={changeMediumWeight}
			/>
			<Button
				icon="B"
				iconOnly
				backgroundOpacity="opaque"
				onClick={changeBoldWeight}
			/>
			<div style={{
				position: "fixed",
				top: "20px",
				left: "1400px",
				backgroundColor: "white",
				zIndex: 10
			}}>
				<CirclePicker
					color={brushColor}
					onChangeComplete={changeBrushColor}
				/>
			</div>
			<canvas id="canvas" />
		</div>
	);
};

export default Sketch;
import { VirtualGridList } from '@enact/sandstone/VirtualList';
import React, { useState, useCallback } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import CONFIG from '../config';
import axios from 'axios';

const Gallery = () => {
    const authToken = window.localStorage.getItem('authToken');

    const [stickers, setStickers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const loadDrawing = useCallback(() => {
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/`;

        axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
            },
        })
            .then((resp) => {
                setStickers(resp.data);
                console.log(resp.data, "💕")
            })
            .catch((error) => {
                console.error('Error loading drawing:', error.message, "😍");
            });

    }, []);

    React.useEffect(() => {
        console.log("Loading stickers...");
        loadDrawing();
    }, [loadDrawing]);

    React.useEffect(() => {
        console.log("Updated stickers:", stickers);
    }, [stickers]);

    const itemSelect = (indexPath) => {
        const authToken = window.localStorage.getItem('authToken');
        if (indexPath == selectedIndex) {
            setSelectedIndex();
        } else {
            setSelectedIndex(indexPath);
        }
    }

    const showToggle = () => {
        const indexPath = selectedIndex
        const currentId = stickers[indexPath].id
        const currentShows = stickers[indexPath].shows
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/${currentId}`;

        const data = { shows: !currentShows }
        axios.put(url, data, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                console.log(`Sticker ${currentId} updated successfully:`);
            })
            .catch(() => {
                console.error(`Error updating sticker ${currentId}:`);
            });
    }

    const removeSticker = () => {
        const indexPath = selectedIndex
        const currentId = stickers[indexPath].id
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/${currentId}`;

        axios.delete(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => {
                console.log(`Sticker ${currentId} sent successfully:`, resp.data);
                const updatedStickers = stickers.filter((_, index) => index !== indexPath);
                setStickers(updatedStickers);
            })
            .catch((error) => {
                console.error(`Error sending sticker ${currentId}:`, error.message);
            });
    }

    const itemRenderer = ({ index, ...rest }) => {
        const sticker = stickers[index]?.sticker;

        if (!sticker) {
            return null;
        }

        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sticker.svg)}`;

        return (
            <div
                {...rest}
                onClick={() => setSelectedIndex(index)}
                style={{
                    position: "relative",
                    backgroundColor: "#f0f0f0",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    fontSize: "16px",
                    border: selectedIndex === index ? "7px solid #4caf50" : "1px solid #ccc",
                    cursor: "pointer",
                }}
            >
                {/* 스티커 이미지 */}
                <img
                    src={svgDataUrl}
                    alt={"Sticker"}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                    }}
                />
            </div>
        );
    };

    return (
        <>
            {/* 상단 버튼 컨테이너 */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "#00000",
                    padding: "10px",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-start",
                    borderBottom: "1px solid #ccc",
                }}
            >
                {/* 개별 버튼 */}
                <Button
                    icon="trash"
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={removeSticker}
                />

                <Button
                    icon="folderupper"
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={showToggle}
                />
            </div>

            {/* 스티커 리스트 */}
            <BodyText size="large">내가 그린 스티커그림</BodyText>

            {stickers.length > 0 ? (
                <VirtualGridList
                    dataSize={stickers.length}
                    direction="vertical"
                    horizontalScrollbar="auto"
                    itemRenderer={itemRenderer}
                    itemSize={{
                        minHeight: 190,
                        minWidth: 230,
                    }}
                    scrollMode="native"
                    spacing={10}
                    verticalScrollbar="auto"
                />
            ) : (
                <BodyText size="small">스티커를 그려보세요!</BodyText>
            )}
        </>
    );
};

export default Gallery;
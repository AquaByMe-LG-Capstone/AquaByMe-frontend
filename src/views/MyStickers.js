import { VirtualGridList } from '@enact/sandstone/VirtualList';
import React, { useState, useCallback } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import useAuth from '../hooks/useAuth';
import CONFIG from '../config';
import axios from 'axios';

const MyStickers = () => {
    const authToken = window.localStorage.getItem('authToken');

    const [stickers, setStickers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const loadDrawing = useCallback(() => {
        const authToken = window.localStorage.getItem('authToken');
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/`;

        axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
            },
        })
            .then((resp) => {
                console.log('Post drawing SVG successful:', resp.data, "🧑🏻‍💻");
                setStickers(resp.data);
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

    const showToggle = () => {
        const indexPath = selectedIndex
        const currentId = stickers[indexPath].id
        const currentShows = stickers[indexPath].shows
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/${currentId}`;

        const data = { shows: !currentShows }
        axios.put(url, data, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                console.log(`Sticker ${currentId} updated successfully:`);
                //MARK: - 수정하는 로직 연결
            })
            .catch(() => {
                console.error(`Error updating sticker ${currentId}:`);
            });
    }

    const removeSticker = () => {
        const indexPath = selectedIndex
        const currentId = stickers[indexPath].id
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/${currentId}`;

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
        const sticker = stickers[index];

        if (!sticker) {
            console.log("마이스티커가 없어요!\n")
            return null;
        }

        // fields = ['id', 'svg', 'creator', 'created'] 

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

            <BodyText size="large">
                내가 그린 스티커그림
            </BodyText>

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
                <BodyText size="small">
                    스티커를 그려보세요!
                </BodyText>
            )}
        </>
    );
};

export default MyStickers;
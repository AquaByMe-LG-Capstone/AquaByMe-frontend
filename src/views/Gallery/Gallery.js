import { VirtualGridList } from '@enact/sandstone/VirtualList';
import React, { useState, useCallback } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import CONFIG from '../../config';
import axios from 'axios';
import titleImage from "../../assets/choosechoose.png";
import './Gallery.css';

const Gallery = () => {
    const authToken = window.localStorage.getItem('authToken');

    const [shownStickers, setShownStickers] = useState([]);
    const [waitingStickers, setWaitingStickers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState([]);

    const loadDrawing = useCallback(() => {
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/`;

        axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
            },
        })
            .then((resp) => {
                const allStickers = resp.data;
                const shown = allStickers.filter((sticker) => sticker.shows === true);
                const waiting = allStickers.filter((sticker) => sticker.shows === false);

                setShownStickers(shown);
                setWaitingStickers(waiting);
            })
            .catch((error) => {
                console.error('Error loading drawing:', error.message);
            });
    }, [authToken]);

    React.useEffect(() => {
        loadDrawing();
    }, [loadDrawing]);

    const toggleSelection = (index, isShown) => {
        setSelectedIndex((prevIndexes) => {
            const newIndex = isShown ? `shown-${index}` : `waiting-${index}`;
            if (prevIndexes.includes(newIndex)) {
                return prevIndexes.filter((i) => i !== newIndex);
            } else {
                return [...prevIndexes, newIndex];
            }
        });
    };

    const showToggle = () => {
        selectedIndex.forEach((selectedId) => {
            const [listType, index] = selectedId.split('-');
            const stickerList = listType === 'shown' ? shownStickers : waitingStickers;
            const sticker = stickerList[index];
            const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/${sticker.id}`;

            axios.put(url, { shows: !sticker.shows }, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(() => {
                    if (listType === 'shown') {
                        setShownStickers((prev) => prev.filter((_, i) => i !== parseInt(index)));
                        setWaitingStickers((prev) => [...prev, { ...sticker, shows: !sticker.shows }]);
                    } else {
                        setWaitingStickers((prev) => prev.filter((_, i) => i !== parseInt(index)));
                        setShownStickers((prev) => [...prev, { ...sticker, shows: !sticker.shows }]);
                    }

                    setSelectedIndex([]);
                })
                .catch((error) => {
                    console.error(`Error updating sticker ${sticker.id}:`, error.message);
                });
        });
    };

    const removeSticker = () => {
        selectedIndex.forEach((selectedId) => {
            const [listType, index] = selectedId.split('-');
            const stickerList = listType === 'shown' ? shownStickers : waitingStickers;
            const setStickerList = listType === 'shown' ? setShownStickers : setWaitingStickers;

            const sticker = stickerList[index];
            const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/${sticker.id}`;

            axios.delete(url, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(() => {
                    setStickerList((prev) => prev.filter((_, i) => i !== parseInt(index)));
                    setSelectedIndex([]);
                })
                .catch((error) => {
                    console.error(`Error deleting sticker ${sticker.id}:`, error.message);
                });
        });
    };

    const selectedItemRenderer = ({ index, ...rest }) => {
        const sticker = shownStickers[index];

        if (!sticker) {
            return null;
        }

        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sticker.sticker.svg)}`;
        const listKey = `shown-${index}`;

        return (
            <div
                {...rest}
                onClick={() => toggleSelection(index, true)}
                style={{
                    padding: "0px",
                    position: "relative",
                    backgroundColor: "#EFF6FF",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    fontSize: "30px",
                    marginTop: "100px",
                    marginBottom: "50px",
                    borderRadius: "50%",
                    border: selectedIndex.includes(listKey) ? "7px solid #ff7bbf" : "1px solid #ccc",
                    cursor: "pointer",
                    overflow: "hidden",
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

    const waitingItemRenderer = ({ index, ...rest }) => {
        const sticker = waitingStickers[index];

        if (!sticker) {
            return null;
        }

        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sticker.sticker.svg)}`;
        const listKey = `waiting-${index}`;

        return (
            <div
                {...rest}
                onClick={() => toggleSelection(index, false)}
                style={{
                    padding: "0px",
                    position: "relative",
                    backgroundColor: "#EFF6FF",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    fontSize: "30px",
                    marginTop: "100px",
                    marginBottom: "50px",
                    borderRadius: "50%",
                    border: selectedIndex.includes(listKey) ? "7px solid #ff7bbf" : "1px solid #ccc",
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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#FFFFFF",
                margin: "0",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* 타이틀 이미지 */}
            <img
                src={titleImage}
                alt="Title"
                style={{
                    maxWidth: "100%",
                    maxHeight: "250px",
                    marginBottom: "30px",
                }}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100vh",
                    // overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    paddingBottom: "10px",
                }}
            >
                {/* 버튼 영역 */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <Button
                        icon="trash"
                        iconOnly
                        onClick={removeSticker}
                        style={{
                            padding: "10px",
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            backgroundColor: "#FFE893",
                            color: "#FBB4A5",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px",
                        }}
                    />

                    <Button
                        icon="check"
                        iconOnly
                        onClick={showToggle}
                        style={{
                            padding: "10px",
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            backgroundColor: "#FFE893",
                            color: "#FBB4A5",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px",
                        }}
                    />
                </div>

                {/* 첫 번째 그리드: Swimming Friends */}
                <div
                    style={{
                        width: "90%",
                        height: "40%",
                        marginBottom: "0px",
                    }}
                >
                    <div
                        style={{
                            textAlign: "left",
                            color: "#cccccc",
                            marginBottom: "0px",
                            fontFamily: "HakgyoansimDunggeunmiso, sans-serif",
                        }}
                    >
                        🐡 Swimming Friends 🐡
                    </div>
                    {shownStickers.length > 0 ? (
                        <VirtualGridList
                            dataSize={shownStickers.length}
                            direction="vertical"
                            itemRenderer={selectedItemRenderer}
                            itemSize={{
                                minHeight: 150,
                                minWidth: 150,
                            }}
                            scrollMode="native"
                            spacing={15}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    ) : (
                        <BodyText size="small" style={{ textAlign: "center" }}>
                            스티커를 그려보세요!
                        </BodyText>
                    )}
                </div>

                {/* 두 번째 그리드: Waiting Friends */}
                <div
                    style={{
                        width: "90%",
                        height: "40%",
                        marginBottom: "0px",
                    }}
                >
                    <div
                        style={{
                            textAlign: "left",
                            color: "#cccccc",
                            marginTop: "30px",
                            marginBottom: "0px",
                            fontFamily: "HakgyoansimDunggeunmiso, sans-serif",
                        }}
                    >
                        🦑 Waiting Friends 🦑
                    </div>
                    {waitingStickers.length > 0 ? (
                        <VirtualGridList
                            dataSize={waitingStickers.length}
                            direction="vertical"
                            itemRenderer={waitingItemRenderer}
                            itemSize={{
                                minHeight: 150,
                                minWidth: 150,
                            }}
                            scrollMode="native"
                            spacing={15}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    ) : (
                        <BodyText size="small" style={{ textAlign: "center" }}>
                            스티커를 그려보세요!
                        </BodyText>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gallery;